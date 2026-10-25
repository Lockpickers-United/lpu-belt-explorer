import {createHash} from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {voteBelts} from './classificationModel.js'

const allowedBelts = new Set([...voteBelts, 'Unranked'])
const maxCatalogBytes = 8 * 1024 * 1024
let cachedPath
let cachedFingerprint
let cachedCatalog

function unavailable(message) {
    const error = new Error(message)
    error.status = 503
    error.code = 'classification_catalog_unavailable'
    return error
}

function isIsoDate(value) {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value))
        && new Date(value).toISOString() === value
}

function legacyName(entry) {
    return entry?.makeModels?.map(({make, model}) =>
        make === 'Any' ? model : `${make} ${model}`).join(' / ') || entry?.id
}

function loadCatalog() {
    const catalogPath = process.env.CLASSIFICATION_CATALOG_PATH
    if (!catalogPath || !path.isAbsolute(catalogPath)) {
        throw unavailable('CLASSIFICATION_CATALOG_PATH must name an absolute catalog file')
    }

    let data
    let sourceBytes
    let fingerprint
    let file
    try {
        file = fs.openSync(catalogPath, 'r')
        const stat = fs.fstatSync(file, {bigint: true})
        fingerprint = `${stat.dev}:${stat.ino}:${stat.size}:${stat.mtimeNs}`
        if (cachedPath === catalogPath && cachedFingerprint === fingerprint && cachedCatalog) {
            return cachedCatalog
        }
        if (stat.size <= 0 || stat.size > maxCatalogBytes) {
            throw unavailable('Classification catalog has an invalid size')
        }
        sourceBytes = fs.readFileSync(file, 'utf8')
        data = JSON.parse(sourceBytes)
    } catch (error) {
        if (error.code === 'classification_catalog_unavailable') throw error
        throw unavailable('Classification catalog could not be loaded')
    } finally {
        if (file !== undefined) fs.closeSync(file)
    }

    let catalogVersion
    let catalogEntries
    if (Array.isArray(data)) {
        // Keep existing development data.json paths usable until they switch to the compact file.
        catalogVersion = `sha256:${createHash('sha256').update(sourceBytes).digest('hex')}`
        catalogEntries = data.map(entry => ({
            id: entry?.id,
            name: legacyName(entry),
            version: entry?.version ?? null,
            belt: entry?.belt,
            currentBeltDate: entry?.currentBeltDate ?? null
        }))
    } else if (data?.schemaVersion === 1 && /^sha256:[a-f0-9]{64}$/.test(data.catalogVersion)
        && isIsoDate(data.generatedAt) && Array.isArray(data.entries)) {
        catalogVersion = data.catalogVersion
        catalogEntries = data.entries
    } else {
        throw unavailable('Classification catalog has an invalid schema')
    }
    if (!catalogEntries.length) throw unavailable('Classification catalog has an invalid schema')
    const entries = new Map()
    for (const entry of catalogEntries) {
        if (typeof entry?.id !== 'string' || !entry.id.trim()
            || typeof entry.name !== 'string' || !entry.name.trim()
            || (entry.version !== null && typeof entry.version !== 'string')
            || !allowedBelts.has(entry.belt)
            || (entry.currentBeltDate !== null && !isIsoDate(entry.currentBeltDate))) {
            throw unavailable('Classification catalog contains an invalid lock')
        }
        if (entries.has(entry.id)) {
            throw unavailable('Classification catalog contains duplicate lock IDs')
        }
        entries.set(entry.id, entry)
    }
    const catalog = {version: catalogVersion, entries}
    cachedPath = catalogPath
    cachedFingerprint = fingerprint
    cachedCatalog = catalog
    return catalog
}

export function getCatalogEntry(entryId) {
    return loadCatalog().entries.get(entryId) ?? null
}

export function getCatalogVersion() {
    return loadCatalog().version
}
