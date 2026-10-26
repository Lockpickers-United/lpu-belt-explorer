import {createHash} from 'node:crypto'
import entryName from '../src/entries/entryName.js'
import {danBelts} from '../src/data/belts.js'

const allowedBelts = new Set(danBelts.filter(belt => belt !== 'Project'))

function isIsoDate(value) {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value))
        && new Date(value).toISOString() === value
}

export function createClassificationCatalog(dataJson, generatedAt = new Date()) {
    const source = JSON.parse(dataJson)
    if (!Array.isArray(source) || !source.length) {
        throw new Error('Classification source must be a nonempty array')
    }

    const seen = new Set()
    const entries = source.map(entry => {
        const id = entry?.id
        if (typeof id !== 'string' || !id.trim() || seen.has(id)) {
            throw new Error(`Invalid or duplicate Classification entry ID: ${id}`)
        }
        seen.add(id)

        const name = entryName(entry, 'short').trim()
        if (!name || !allowedBelts.has(entry.belt)) {
            throw new Error(`Invalid Classification name or belt for ${id}`)
        }
        if (entry.version !== null && entry.version !== undefined && typeof entry.version !== 'string') {
            throw new Error(`Invalid Classification version for ${id}`)
        }
        if (entry.currentBeltDate !== null && entry.currentBeltDate !== undefined
            && !isIsoDate(entry.currentBeltDate)) {
            throw new Error(`Invalid Classification currentBeltDate for ${id}`)
        }

        return {
            id,
            name,
            version: entry.version || null,
            belt: entry.belt,
            currentBeltDate: entry.currentBeltDate ?? null
        }
    }).sort((a, b) => a.id.localeCompare(b.id))

    const generatedAtIso = generatedAt.toISOString()
    return {
        schemaVersion: 1,
        catalogVersion: `sha256:${createHash('sha256').update(dataJson).digest('hex')}`,
        generatedAt: generatedAtIso,
        entries
    }
}

export function validateClassificationCatalog(dataJson, catalog) {
    if (catalog?.schemaVersion !== 1 || !isIsoDate(catalog.generatedAt)) {
        throw new Error('Invalid Classification catalog schema or generatedAt')
    }
    const expected = createClassificationCatalog(dataJson, new Date(catalog.generatedAt))
    if (JSON.stringify(catalog) !== JSON.stringify(expected)) {
        throw new Error('Classification catalog does not match data.json')
    }
}
