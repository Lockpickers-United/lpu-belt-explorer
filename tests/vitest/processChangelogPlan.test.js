import {describe, expect, it} from 'vitest'
import {collectionPatch, prepareUpdates, updateCollection} from '../../scripts/processChangelogPlan.js'

describe('process changelog plan', () => {
    const updates = {
        changes: [
            {approved: true, from: 'old', to: 'new'},
            {approved: false, from: 'unapproved-old', to: 'unapproved-new'}
        ],
        deletions: [
            {approved: true, id: 'deleted'},
            {approved: false, id: 'unapproved-deleted'}
        ]
    }

    it('uses only approved actions and replaces or removes IDs in every collection list', () => {
        const plan = prepareUpdates(updates)
        expect(plan.targetIds).toEqual(['old', 'deleted'])
        const data = {
            own: ['old', 'new', 'deleted', 'unapproved-old', 'unapproved-deleted'],
            picked: ['deleted'],
            recorded: ['old'],
            recordedLocks: ['old'],
            wishlist: ['old'],
            unrelated: ['old']
        }
        expect(collectionPatch(data, plan)).toEqual({
            own: ['new', 'unapproved-old', 'unapproved-deleted'],
            picked: [],
            recorded: ['new'],
            recordedLocks: ['new'],
            wishlist: ['new']
        })
        expect(collectionPatch({...data, own: ['new']}, plan).own).toBeUndefined()
    })

    it('preserves order and makes a repeated run harmless', () => {
        const plan = prepareUpdates(updates)
        const once = updateCollection(['first', 'first', 'old', 'last', 'deleted'], plan)
        expect(once).toEqual(['first', 'first', 'new', 'last'])
        expect(updateCollection(once, plan)).toBeNull()
        expect(updateCollection(['first', 'first'], plan)).toBeNull()
    })

    it.each([
        {changes: [{approved: true, from: 'a', to: 'b'}, {approved: true, from: 'a', to: 'c'}], deletions: []},
        {changes: [{approved: true, from: 'a', to: 'b'}, {approved: true, from: 'b', to: 'c'}], deletions: []},
        {changes: [{approved: true, from: 'a', to: 'b'}], deletions: [{approved: true, id: 'b'}]},
        {changes: [{approved: true, from: 'a', to: 'a'}], deletions: []},
        {changes: [], deletions: [{approved: true, id: 'a'}, {approved: true, id: 'a'}]},
        {changes: [{approved: 'true', from: 'a', to: 'b'}], deletions: []}
    ])('rejects ambiguous or invalid exported actions: %o', invalid => {
        expect(() => prepareUpdates(invalid)).toThrow()
    })

    it('rejects malformed collection fields before a write', () => {
        const plan = prepareUpdates(updates)
        expect(() => collectionPatch({own: 'old'}, plan)).toThrow()
        expect(() => updateCollection(['old', null], plan)).toThrow()
    })
})
