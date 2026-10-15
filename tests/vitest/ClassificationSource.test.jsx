import {describe, expect, it} from 'vitest'
import featureIds from '../../src/data/classification-feature-ids.json'
import migratedVotes from '../../src/data/classification-samples.json'
import catalog from '../../src/data/data.json'

describe('Classification feature projection', () => {
    it('preserves the migration worklist as compact lock IDs', () => {
        const expected = [...new Set(migratedVotes.map(vote => vote.entryId))].sort()
        expect(featureIds).toEqual(expected)
        expect(featureIds.every(id => catalog.some(entry => entry.id === id))).toBe(true)
        expect(featureIds.every(id => typeof id === 'string')).toBe(true)
    })
})
