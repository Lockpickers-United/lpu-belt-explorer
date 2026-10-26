import {describe, expect, it} from 'vitest'
import {
    applyClassificationMigration,
    assertDevelopmentTarget,
    assertProductionTarget,
    buildClassificationMigration,
    inspectClassificationTarget
} from './classificationMigration.js'
import {voteIdFor} from './classificationModel.js'

const catalog = {
    schemaVersion: 1,
    catalogVersion: 'sha256:' + 'a'.repeat(64),
    entries: [
        {id: 'ranked', name: 'Ranked lock', belt: 'Blue', currentBeltDate: '2026-10-01T00:00:00.000Z'},
        {id: 'unranked', name: 'Unranked lock', belt: 'Unranked', currentBeltDate: '2026-10-01T00:00:00.000Z'},
        {id: 'empty-ranked', name: 'Empty ranked lock', belt: 'Red', currentBeltDate: '2026-09-01T00:00:00.000Z'}
    ]
}
const votes = [
    {
        id: 'source-1', type: 'vote', source: 'sheet', entryId: 'ranked',
        userId: 'u_1234', displayName: 'Reader', votedBelt: 'Green',
        comment: 'Before the decision', createdAt: '2026-09-01T00:00:00.000Z'
    },
    {
        id: 'source-2', type: 'vote', source: 'sheet', entryId: 'ranked',
        userId: 'user-2', displayName: 'Member', votedBelt: 'Blue',
        createdAt: '2026-10-02T00:00:00.000Z'
    },
    {
        id: 'source-3', type: 'vote', source: 'sheet', entryId: 'unranked',
        userId: 'user-3', displayName: 'Member 3', votedBelt: 'Orange',
        createdAt: '2026-09-01T00:00:00.000Z'
    }
]

function plan(source = votes, compactCatalog = catalog) {
    return buildClassificationMigration({
        sourceBytes: Buffer.from(JSON.stringify(source)),
        catalogBytes: Buffer.from(JSON.stringify(compactCatalog)),
        migrationTime: '2026-10-14T00:00:00.000Z'
    })
}

function fakeDb(initial = {}) {
    const records = new Map(Object.entries(initial))
    return {
        records,
        batch() {
            const pending = []
            return {
                create(ref, data) {
                    pending.push([ref.key, data])
                },
                async commit() {
                    for (const [key] of pending) {
                        if (records.has(key)) throw new Error('already exists')
                    }
                    for (const [key, data] of pending) records.set(key, data)
                }
            }
        },
        collection(name) {
            return {
                async get() {
                    const docs = [...records].filter(([key]) => key.startsWith(`${name}/`))
                        .map(([key, value]) => ({id: key.slice(name.length + 1), data: () => value}))
                    return {docs}
                },
                doc(id) {
                    return {key: `${name}/${id}`}
                }
            }
        }
    }
}

describe('classification development migration', () => {
    it('preserves source provenance and computes the canonical vote and entry projections', () => {
        const {manifest, documents} = plan()
        const vote = documents.find(doc => doc.id === voteIdFor('ranked', 'u_1234'))
        const ranked = documents.find(doc => doc.collection === 'classificationEntries' && doc.id === 'ranked')
        const state = documents.find(doc => doc.collection === 'classificationEntryStates' && doc.id === 'ranked')
        const unranked = documents.find(doc => doc.collection === 'classificationEntries' && doc.id === 'unranked')
        const emptyRanked = documents.find(doc => doc.collection === 'classificationEntries' && doc.id === 'empty-ranked')
        expect(vote.data).toMatchObject({sourceId: 'source-1', source: 'sheet', revision: 1})
        expect(vote.data.createdAt.toISOString()).toBe('2026-09-01T00:00:00.000Z')
        expect(ranked.data).toMatchObject({currentVoteCount: 1, hasPreviousModernVotes: true})
        expect(ranked.data.previousVoteChips).toHaveLength(1)
        expect(state.data.voterIds).toEqual(['u_1234', 'user-2'])
        expect(unranked.data.decisionMilestoneAt).toBeNull()
        expect(emptyRanked.data).toMatchObject({currentVoteCount: 0, hasModernVotes: false})
        expect(emptyRanked.data.decisionMilestoneAt.toISOString()).toBe('2026-09-01T00:00:00.000Z')
        expect(manifest.counts).toMatchObject({votes: 3, voteEntries: 2, entries: 3,
            previousVotes: 1, seededMilestones: 2, syntheticUsers: 1})
        expect(manifest.createdDocumentIds.classificationActions).toEqual([])
    })

    it('rejects changed pairs, invalid dates, and a mismatched full catalog', () => {
        expect(() => plan([...votes, {...votes[0], id: 'other-source'}])).toThrow('Duplicate entry/user pair')
        expect(() => plan([{...votes[0], createdAt: 'yesterday'}])).toThrow('must be an ISO timestamp')
        expect(() => buildClassificationMigration({
            sourceBytes: Buffer.from(JSON.stringify(votes)),
            catalogBytes: Buffer.from(JSON.stringify(catalog)),
            fullCatalogBytes: Buffer.from('different'),
            migrationTime: '2026-10-14T00:00:00.000Z'
        })).toThrow('fingerprints differ')
    })

    it('identifies conflicts and safely resumes after a partial import', async () => {
        const {documents} = plan()
        const db = fakeDb()
        const first = await inspectClassificationTarget(db, documents)
        expect(first.absent).toHaveLength(documents.length)
        const firstEntry = documents.filter(doc => doc.data.entryId === 'empty-ranked')
        expect(await applyClassificationMigration(db, firstEntry, first)).toBe(2)
        const retry = await inspectClassificationTarget(db, documents)
        expect(retry.matching).toHaveLength(2)
        expect(await applyClassificationMigration(db, documents, retry)).toBe(documents.length - 2)
        expect((await inspectClassificationTarget(db, documents)).conflicts).toEqual([])
        const voteKey = `classificationVotes/${voteIdFor('ranked', 'u_1234')}`
        const storedVote = db.records.get(voteKey)
        db.records.set(voteKey, {...storedVote,
            createdAt: {toDate: () => storedVote.createdAt},
            updatedAt: {toDate: () => storedVote.updatedAt}})
        expect((await inspectClassificationTarget(db, documents)).conflicts).toEqual([])
        db.records.set('classificationVotes/extra', {userId: 'other'})
        const conflict = await inspectClassificationTarget(db, documents)
        expect(conflict.conflicts).toEqual(['classificationVotes/extra'])
        await expect(applyClassificationMigration(db, documents, conflict)).rejects.toThrow('conflicting')
    })

    it('requires the explicit production Firestore target', () => {
        const env = {NODE_ENV: 'production', LPU_JOB_ENV: 'production',
            FIREBASE_PROJECT_ID: 'lpu-belt-explorer', FIRESTORE_DATABASE_ID: '(default)',
            ALLOW_PRODUCTION_JOB: 'true'}
        expect(() => assertProductionTarget(env)).not.toThrow()
        expect(() => assertProductionTarget({...env, FIRESTORE_DATABASE_ID: 'lpubelts-dev'})).toThrow()
        expect(() => assertProductionTarget({...env, FIRESTORE_EMULATOR_HOST: 'localhost:8080'})).toThrow()
    })

    it('requires the named development Firestore database', () => {
        const env = {NODE_ENV: 'development', LPU_JOB_ENV: 'development',
            FIREBASE_PROJECT_ID: 'lpu-belt-explorer', FIRESTORE_DATABASE_ID: 'lpubelts-dev'}
        expect(() => assertDevelopmentTarget(env)).not.toThrow()
        expect(() => assertDevelopmentTarget({...env, FIRESTORE_DATABASE_ID: '(default)'})).toThrow()
        expect(() => assertDevelopmentTarget({...env, ALLOW_PRODUCTION_JOB: 'true'})).toThrow()
    })
})
