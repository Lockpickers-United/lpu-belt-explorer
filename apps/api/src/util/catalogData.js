import fs from 'node:fs/promises'
import path from 'node:path'
import fetch from 'node-fetch'

export const catalogFilenames = Object.freeze([
    'data.json',
    'rafl.json',
    'dials.json',
    'projects.json',
    'awards.json',
    'glossary.json'
])

function configError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function boundedInteger(env, name, defaultValue, minimum, maximum) {
    const value = Number(env[name] ?? defaultValue)
    if (!Number.isInteger(value) || value < minimum || value > maximum) {
        throw configError('catalog_config_invalid_number', `${name} must be between ${minimum} and ${maximum}`)
    }
    return value
}

function enabledFlag(env, name) {
    const value = env[name] ?? 'false'
    if (!['true', 'false'].includes(value)) {
        throw configError('catalog_config_invalid_enabled', `${name} must be true or false`)
    }
    return value === 'true'
}

export function loadCatalogDataConfig(env = process.env) {
    const source = env.LPU_CATALOG_SOURCE?.trim()
    if (!['filesystem', 'remote'].includes(source)) {
        throw configError(
            'catalog_config_invalid_source',
            'LPU_CATALOG_SOURCE must be filesystem or remote'
        )
    }

    const timeoutMs = boundedInteger(env, 'LPU_CATALOG_TIMEOUT_MS', 15_000, 1_000, 120_000)
    const maxBytes = boundedInteger(
        env,
        'LPU_CATALOG_MAX_BYTES',
        10 * 1024 * 1024,
        1_024,
        50 * 1024 * 1024
    )

    if (source === 'filesystem') {
        const catalogDir = env.LPU_CATALOG_DIR?.trim()
        if (!catalogDir || !path.isAbsolute(catalogDir)) {
            throw configError(
                'catalog_config_invalid_path',
                'LPU_CATALOG_DIR must be an absolute path in filesystem mode'
            )
        }
        return Object.freeze({source, catalogDir: path.normalize(catalogDir), baseUrl: null, timeoutMs, maxBytes})
    }

    let baseUrl
    try {
        baseUrl = new URL(env.LPU_CATALOG_BASE_URL?.trim() || 'https://lpubelts.com')
    } catch {
        throw configError('catalog_config_invalid_url', 'LPU_CATALOG_BASE_URL must be a valid HTTPS URL')
    }
    if (baseUrl.protocol !== 'https:' || baseUrl.username || baseUrl.password) {
        throw configError('catalog_config_invalid_url', 'LPU_CATALOG_BASE_URL must be a valid HTTPS URL')
    }
    return Object.freeze({
        source,
        catalogDir: null,
        baseUrl: baseUrl.toString(),
        timeoutMs,
        maxBytes
    })
}

export function loadCatalogRefreshConfig(env = process.env) {
    const enabled = enabledFlag(env, 'LPU_CATALOG_REFRESH_ENABLED')
    const catalogDir = env.LPU_CATALOG_DIR?.trim()
    if ((enabled && !catalogDir) || (catalogDir && !path.isAbsolute(catalogDir))) {
        throw configError(
            'catalog_config_invalid_path',
            'LPU_CATALOG_DIR must be an absolute path for catalog refreshes'
        )
    }

    const remoteConfig = loadCatalogDataConfig({
        ...env,
        LPU_CATALOG_SOURCE: 'remote'
    })
    return Object.freeze({
        enabled,
        catalogDir: catalogDir ? path.normalize(catalogDir) : null,
        baseUrl: remoteConfig.baseUrl,
        timeoutMs: remoteConfig.timeoutMs,
        maxBytes: remoteConfig.maxBytes,
        remoteConfig
    })
}

export function catalogRefreshConfigSummary(config) {
    return {
        enabled: config.enabled,
        catalogDir: config.catalogDir,
        baseUrl: config.baseUrl,
        timeoutMs: config.timeoutMs,
        maxBytes: config.maxBytes
    }
}

function validateCatalogArray(data, filename) {
    if (!Array.isArray(data) || data.length === 0
        || data.some(entry => !entry || typeof entry !== 'object' || Array.isArray(entry))) {
        throw configError('catalog_data_invalid', `Invalid catalog array: ${filename}`)
    }
    return data
}

function parseCatalogJson(text, filename) {
    try {
        return validateCatalogArray(JSON.parse(text), filename)
    } catch (error) {
        if (error?.code === 'catalog_data_invalid') throw error
        throw configError('catalog_data_invalid', `Invalid catalog JSON: ${filename}`)
    }
}

async function readBoundedFile(filePath, maxBytes) {
    const stats = await fs.stat(filePath)
    if (stats.size > maxBytes) throw configError('catalog_data_too_large', `Catalog input exceeds size limit: ${filePath}`)
    return fs.readFile(filePath, 'utf8')
}

export async function validateCatalogInputFiles(config) {
    if (config.source !== 'filesystem') return
    await Promise.all(catalogFilenames.map(filename =>
        fs.access(path.join(config.catalogDir, filename))))
}

export async function loadCatalogArray(filename, {
    env = process.env,
    config = loadCatalogDataConfig(env),
    fetchImpl = fetch
} = {}) {
    if (!catalogFilenames.includes(filename)) {
        throw configError('catalog_filename_invalid', `Unsupported catalog filename: ${filename}`)
    }

    let text
    if (config.source === 'filesystem') {
        text = await readBoundedFile(path.join(config.catalogDir, filename), config.maxBytes)
    } else {
        const url = new URL(filename, config.baseUrl).toString()
        const response = await fetchImpl(url, {
            signal: AbortSignal.timeout(config.timeoutMs),
            size: config.maxBytes
        })
        if (!response.ok) throw configError('catalog_download_failed', `Unable to download ${filename}: HTTP ${response.status}`)
        const contentLength = Number(response.headers?.get?.('content-length'))
        if (Number.isFinite(contentLength) && contentLength > config.maxBytes) {
            throw configError('catalog_data_too_large', `Catalog response exceeds size limit: ${filename}`)
        }
        text = await response.text()
        if (Buffer.byteLength(text) > config.maxBytes) {
            throw configError('catalog_data_too_large', `Catalog response exceeds size limit: ${filename}`)
        }
    }
    return parseCatalogJson(text, filename)
}
