import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it} from 'vitest'
import {getCatalogEntry, getCatalogVersion} from './classificationCatalog.js'

const originalPath = process.env.CLASSIFICATION_CATALOG_PATH
const directories = []

function catalog(belt, hash = 'a') {
    return {
        schemaVersion: 1,
        catalogVersion: `sha256:${hash.repeat(64)}`,
        generatedAt: '2026-10-13T00:00:00.000Z',
        entries: [{id: 'lock-a', name: 'Acme Lock', version: null, belt,
            currentBeltDate: null}]
    }
}

function temporaryCatalog(data) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'classification-catalog-'))
    directories.push(directory)
    const filename = path.join(directory, 'classification-catalog.json')
    fs.writeFileSync(filename, JSON.stringify(data))
    process.env.CLASSIFICATION_CATALOG_PATH = filename
    return filename
}

afterEach(() => {
    if (originalPath === undefined) delete process.env.CLASSIFICATION_CATALOG_PATH
    else process.env.CLASSIFICATION_CATALOG_PATH = originalPath
    for (const directory of directories.splice(0)) fs.rmSync(directory, {recursive: true})
})

describe('Classification catalog loader', () => {
    it('reloads an atomically replaced file at the same path without restart', () => {
        const filename = temporaryCatalog(catalog('White'))
        expect(getCatalogEntry('lock-a').belt).toBe('White')
        expect(getCatalogVersion()).toBe(`sha256:${'a'.repeat(64)}`)

        const replacement = `${filename}.tmp`
        fs.writeFileSync(replacement, JSON.stringify(catalog('Yellow', 'b')))
        fs.renameSync(replacement, filename)
        expect(getCatalogEntry('lock-a').belt).toBe('Yellow')
        expect(getCatalogVersion()).toBe(`sha256:${'b'.repeat(64)}`)
    })

    it('keeps the existing full-catalog format readable during development transition', () => {
        temporaryCatalog([{id: 'lock-a', makeModels: [{make: 'Acme', model: 'Lock'}],
            belt: 'White'}])
        expect(getCatalogEntry('lock-a')).toMatchObject({
            id: 'lock-a', name: 'Acme Lock', belt: 'White'
        })
        expect(getCatalogVersion()).toMatch(/^sha256:[a-f0-9]{64}$/)
    })

    it('fails closed on an invalid or missing replacement', () => {
        const filename = temporaryCatalog(catalog('White'))
        expect(getCatalogEntry('lock-a').belt).toBe('White')
        const replacement = `${filename}.tmp`
        fs.writeFileSync(replacement, JSON.stringify({...catalog('White'), entries: []}))
        fs.renameSync(replacement, filename)
        expect(() => getCatalogEntry('lock-a')).toThrow(/invalid schema/)
        fs.rmSync(filename)
        expect(() => getCatalogEntry('lock-a')).toThrow(/could not be loaded/)
    })
})
