import path from 'node:path'
import fetch from 'node-fetch'
import isDirectRun from '../../util/isDirectRun.js'
import {writeJsonFileAtomic} from '../../util/writeJsonFileAtomic.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'

export const discordBeltCountsUrl =
    'https://explore.lpubelts.com/data/discordBeltCounts.json'

function configurationError(code, message) {
    const error = new Error(message)
    error.code = code
    return error
}

function boundedInteger(env, name, defaultValue, minimum, maximum) {
    const value = Number(env[name] ?? defaultValue)
    if (!Number.isInteger(value) || value < minimum || value > maximum) {
        throw configurationError(
            'discord_belt_counts_config_invalid_number',
            `${name} must be between ${minimum} and ${maximum}`
        )
    }
    return value
}

export function loadDiscordBeltCountsConfig(env = process.env) {
    const enabledValue = env.DISCORD_BELT_COUNTS_REFRESH_ENABLED ?? 'false'
    if (!['true', 'false'].includes(enabledValue)) {
        throw configurationError(
            'discord_belt_counts_config_invalid_enabled',
            'DISCORD_BELT_COUNTS_REFRESH_ENABLED must be true or false'
        )
    }

    let url
    try {
        url = new URL(env.DISCORD_BELT_COUNTS_URL?.trim() || discordBeltCountsUrl)
    } catch {
        throw configurationError(
            'discord_belt_counts_config_invalid_url',
            'DISCORD_BELT_COUNTS_URL must be a valid HTTPS URL'
        )
    }
    if (url.protocol !== 'https:' || url.username || url.password) {
        throw configurationError(
            'discord_belt_counts_config_invalid_url',
            'DISCORD_BELT_COUNTS_URL must be a valid HTTPS URL'
        )
    }

    return Object.freeze({
        enabled: enabledValue === 'true',
        url: url.toString(),
        timeoutMs: boundedInteger(env, 'DISCORD_BELT_COUNTS_TIMEOUT_MS', 15_000, 1_000, 120_000),
        maxBytes: boundedInteger(
            env,
            'DISCORD_BELT_COUNTS_MAX_BYTES',
            1024 * 1024,
            1_024,
            10 * 1024 * 1024
        )
    })
}

function validateDiscordBeltCounts(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)
        || Object.values(data).some(count => !Number.isFinite(count) || count < 0)) {
        throw new Error('Invalid Discord belt counts response')
    }
    return data
}

export async function runDiscordBeltCountsDownload({
    publicDataDir,
    fetchImpl = fetch,
    url = discordBeltCountsUrl,
    timeoutMs = 15_000,
    maxBytes = 1024 * 1024
}) {
    const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(timeoutMs),
        size: maxBytes
    })
    if (!response.ok) {
        throw new Error(`Unable to download Discord belt counts: HTTP ${response.status}`)
    }

    const contentLength = Number(response.headers?.get?.('content-length'))
    if (Number.isFinite(contentLength) && contentLength > maxBytes) {
        throw new Error('Discord belt counts response exceeds size limit')
    }
    const responseText = await response.text()
    if (Buffer.byteLength(responseText) > maxBytes) {
        throw new Error('Discord belt counts response exceeds size limit')
    }
    let parsed
    try {
        parsed = JSON.parse(responseText)
    } catch {
        throw new Error('Invalid Discord belt counts response')
    }
    const discordBeltCounts = validateDiscordBeltCounts(parsed)
    const outputFile = path.join(publicDataDir, 'discordBeltCounts.json')
    await writeJsonFileAtomic(outputFile, discordBeltCounts, {spaces: 2})

    return Object.freeze({outputFile, discordBeltCounts})
}

export async function discordBeltCountsDownloadMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment,
    fetchImpl = fetch
} = {}) {
    loadCollectionEnvironment({env, loadEnvironment})
    const config = loadExportJobConfig({env, requirePublicDataDir: true})
    const downloadConfig = loadDiscordBeltCountsConfig(env)
    const summary = {...exportJobConfigSummary(config), discordBeltCounts: downloadConfig}
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }
    if (!downloadConfig.enabled) {
        throw configurationError(
            'discord_belt_counts_disabled',
            'Discord belt-count refresh is disabled'
        )
    }

    const result = await runDiscordBeltCountsDownload({
        publicDataDir: config.publicDataDir,
        fetchImpl,
        url: downloadConfig.url,
        timeoutMs: downloadConfig.timeoutMs,
        maxBytes: downloadConfig.maxBytes
    })
    if (!argv.includes('cron')) {
        writeOutput('Discord belt counts download complete', {
            outputFile: result.outputFile
        })
    }
    return result
}

if (isDirectRun(import.meta.url)) {
    await discordBeltCountsDownloadMain()
}
