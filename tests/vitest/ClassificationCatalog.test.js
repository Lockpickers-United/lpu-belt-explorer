import {describe, expect, it} from 'vitest'
import {createClassificationCatalog, validateClassificationCatalog} from '../../scripts/classificationCatalog.js'

const source = [
    {id: 'b', makeModels: [{make: 'Any', model: 'Lock B'}], belt: 'Unranked'},
    {id: 'a', makeModels: [{make: 'Acme', model: 'Lock A'}], version: 'v2',
        belt: 'White', currentBeltDate: '2024-01-02T03:04:05.000Z'}
]
const dataJson = JSON.stringify(source, null, 2)

describe('Classification catalog artifact', () => {
    it('projects all locks in ID order and verifies the exact source bytes', () => {
        const catalog = createClassificationCatalog(dataJson, new Date('2026-01-01T00:00:00.000Z'))
        expect(catalog.schemaVersion).toBe(1)
        expect(catalog.catalogVersion).toMatch(/^sha256:[a-f0-9]{64}$/)
        expect(catalog.entries).toEqual([
            {id: 'a', name: 'Acme Lock A', version: 'v2', belt: 'White',
                currentBeltDate: '2024-01-02T03:04:05.000Z'},
            {id: 'b', name: 'Any Lock B', version: null, belt: 'Unranked',
                currentBeltDate: null}
        ])
        expect(() => validateClassificationCatalog(dataJson, catalog)).not.toThrow()
        expect(() => validateClassificationCatalog(`${dataJson}\n`, catalog))
            .toThrow('does not match data.json')
        expect(() => validateClassificationCatalog(dataJson, {...catalog, entries: []}))
            .toThrow('does not match data.json')
    })

    it('rejects ambiguous IDs and invalid source values', () => {
        expect(() => createClassificationCatalog(JSON.stringify([source[0], source[0]])))
            .toThrow('duplicate')
        expect(() => createClassificationCatalog(JSON.stringify([{...source[0], belt: 'Unknown'}])))
            .toThrow('Invalid Classification name or belt')
        expect(() => createClassificationCatalog(JSON.stringify([{...source[0], currentBeltDate: 'tomorrow'}])))
            .toThrow('Invalid Classification currentBeltDate')
    })
})
