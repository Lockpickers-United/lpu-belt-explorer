import {describe, expect, it} from 'vitest'
import {buildEntryProjections, voteIdFor} from './classificationModel.js'
import {createClassificationService} from './classificationService.js'

function fakeDb() {
    const records = new Map()
    let pending = Promise.resolve()
    const snapshot = (path, data) => ({id: path.split('/').at(-1), exists: !!data,
        data: () => data})

    class Query {
        constructor(collection, filters = [], sort = null, count = Infinity, after = null) {
            Object.assign(this, {collection, filters, sort, count, after})
        }
        where(field, op, value) {
            return new Query(this.collection, [...this.filters, {field, op, value}], this.sort,
                this.count, this.after)
        }
        orderBy(field, direction) {
            return new Query(this.collection, this.filters, {field, direction}, this.count, this.after)
        }
        limit(count) {
            return new Query(this.collection, this.filters, this.sort, count, this.after)
        }
        startAfter(after) {
            return new Query(this.collection, this.filters, this.sort, this.count, after)
        }
        async get() {
            let docs = [...records].filter(([path]) => path.startsWith(`${this.collection}/`))
                .map(([path, data]) => snapshot(path, data))
                .filter(doc => this.filters.every(({field, op, value}) =>
                    op === '==' && doc.data()[field] === value))
            if (this.sort) {
                const {field, direction} = this.sort
                docs.sort((a, b) => {
                    const av = a.data()[field] instanceof Date ? a.data()[field].getTime() : a.data()[field]
                    const bv = b.data()[field] instanceof Date ? b.data()[field].getTime() : b.data()[field]
                    return (av < bv ? -1 : av > bv ? 1 : 0) * (direction === 'desc' ? -1 : 1)
                })
            }
            if (this.after) docs = docs.slice(docs.findIndex(doc => doc.id === this.after.id) + 1)
            return {docs: docs.slice(0, this.count)}
        }
    }

    const db = {
        collection(name) {
            return {
                doc: id => ({path: `${name}/${id}`, id,
                    get: async () => snapshot(`${name}/${id}`, records.get(`${name}/${id}`))}),
                where: (field, op, value) => new Query(name).where(field, op, value),
                orderBy: (field, direction) => new Query(name).orderBy(field, direction)
            }
        },
        runTransaction(work) {
            const task = pending.then(async () => {
                const writes = []
                const tx = {
                    get: ref => ref.get(),
                    set: (ref, value) => writes.push(() => records.set(ref.path, value)),
                    create: (ref, value) => writes.push(() => {
                        if (records.has(ref.path)) throw new Error('Already exists')
                        records.set(ref.path, value)
                    }),
                    delete: ref => writes.push(() => records.delete(ref.path))
                }
                const result = await work(tx)
                writes.forEach(write => write())
                return result
            })
            pending = task.catch(() => {})
            return task
        }
    }
    return {db, records}
}

function fixture() {
    const {db, records} = fakeDb()
    records.set('lockcollections/voter-1', {displayName: 'Profile Voter'})
    let time = Date.parse('2026-10-13T12:00:00Z')
    const catalog = new Map([
        ['lock-a', {id: 'lock-a', name: 'Lock A', belt: 'White'}],
        ['lock-b', {id: 'lock-b', name: 'Lock B', belt: 'Yellow'}]
    ])
    const service = createClassificationService({db, getCatalogEntry: id => catalog.get(id),
        clock: () => new Date(time += 1000)})
    return {service, records, catalog}
}

const voter = {uid: 'voter-1', name: 'Voter One'}
const admin = {uid: 'admin-1', name: 'Admin One'}

describe('classification service', () => {
    it('uses deterministic pair IDs and a single vote under concurrent creates', async () => {
        const {service, records} = fixture()
        const input = {entryId: 'lock-a', votedBelt: 'Blue', comment: 'First'}
        const outcomes = await Promise.allSettled([
            service.createVote(voter, 'create-key-1', input),
            service.createVote(voter, 'create-key-2', input)
        ])
        expect(outcomes.filter(result => result.status === 'fulfilled')).toHaveLength(1)
        expect(outcomes.find(result => result.status === 'rejected').reason.code).toBe('duplicate_vote')
        expect(records.get(`classificationVotes/${voteIdFor('lock-a', voter.uid)}`).userId)
            .toBe(voter.uid)
        expect(records.get(`classificationVotes/${voteIdFor('lock-a', voter.uid)}`).displayName)
            .toBe('Profile Voter')
        expect(records.get('classificationEntries/lock-a').currentVoteCount).toBe(1)
        expect(records.get('classificationEntryStates/lock-a').voterIds).toEqual([voter.uid])
        expect([...records.keys()].some(path => path.startsWith('classificationFeatureEntries/')))
            .toBe(false)
    })

    it('never uses the auth name when the profile has no display name', async () => {
        const {service, records} = fixture()
        records.set('lockcollections/voter-1', {})
        const created = await service.createVote(voter, 'missing-profile-name',
            {entryId: 'lock-a', votedBelt: 'Blue'})
        expect(created.vote.displayName).toBe('no display name')
    })

    it('refreshes the profile name when the voter edits an existing vote', async () => {
        const {service, records} = fixture()
        const created = await service.createVote(voter, 'profile-name-create',
            {entryId: 'lock-a', votedBelt: 'Blue'})
        records.set('lockcollections/voter-1', {displayName: 'Updated Profile Voter'})
        const edited = await service.editVote(voter, 'profile-name-edit', created.vote.id,
            {expectedRevision: 1, votedBelt: 'Green'}, false)
        expect(edited.vote.displayName).toBe('Updated Profile Voter')
    })

    it('clears the summary vote flag when the last modern vote is deleted', async () => {
        const {service, records} = fixture()
        const created = await service.createVote(voter, 'feature-create',
            {entryId: 'lock-a', votedBelt: 'Blue'})
        await service.deleteVote(voter, 'feature-delete', created.vote.id, 1, false)
        expect(records.get('classificationEntries/lock-a').hasModernVotes).toBe(false)
    })

    it('enforces ownership, revisions, and preserves attribution on admin edits', async () => {
        const {service, records} = fixture()
        const created = await service.createVote(voter, 'create-key-3',
            {entryId: 'lock-a', votedBelt: 'Blue'})
        const id = created.vote.id
        await expect(service.editVote({uid: 'other', blackBelt: true}, 'edit-key-1', id,
            {expectedRevision: 1, votedBelt: 'Green'}, false))
            .rejects.toMatchObject({status: 403})
        await expect(service.deleteVote({uid: 'other', blackBelt: true}, 'delete-key-1', id,
            1, false)).rejects.toMatchObject({status: 403})
        const edited = await service.editVote(admin, 'edit-key-2', id,
            {expectedRevision: 1, votedBelt: 'Green', comment: 'Reviewed'}, true)
        expect(edited.vote).toMatchObject({userId: voter.uid, displayName: 'Profile Voter',
            votedBelt: 'Green', revision: 2})
        expect(records.get('classificationEntries/lock-a').currentBeltCounts).toEqual({Green: 1})
        await expect(service.editVote(admin, 'edit-key-3', id,
            {expectedRevision: 1, votedBelt: 'Blue'}, true))
            .rejects.toMatchObject({code: 'revision_conflict'})
    })

    it('moves a vote atomically and recomputes both lock summaries', async () => {
        const {service, records} = fixture()
        const created = await service.createVote(voter, 'move-create',
            {entryId: 'lock-a', votedBelt: 'Blue', comment: 'Original vote'})
        const createdAt = records.get(`classificationVotes/${created.vote.id}`).createdAt
        const moved = await service.moveVote(admin, 'move-command', created.vote.id,
            {entryId: 'lock-b', expectedRevision: 1})
        const targetId = voteIdFor('lock-b', voter.uid)

        expect(moved.vote).toMatchObject({id: targetId, entryId: 'lock-b', userId: voter.uid,
            votedBelt: 'Blue', comment: 'Original vote', revision: 1})
        expect(records.has(`classificationVotes/${created.vote.id}`)).toBe(false)
        expect(records.get(`classificationVotes/${targetId}`).createdAt).toEqual(createdAt)
        expect(records.get('classificationEntries/lock-a').currentVoteCount).toBe(0)
        expect(records.get('classificationEntries/lock-a').hasModernVotes).toBe(false)
        expect(records.get('classificationEntryStates/lock-a').voterIds).toEqual([])
        expect(records.get('classificationEntries/lock-b').currentBeltCounts).toEqual({Blue: 1})
        expect(records.get('classificationEntryStates/lock-b').voterIds).toEqual([voter.uid])
        expect(await service.moveVote(admin, 'move-command', created.vote.id,
            {entryId: 'lock-b', expectedRevision: 1})).toEqual(moved)
    })

    it('rejects stale moves, duplicate target votes, and settled targets without changing either lock', async () => {
        const {service, records} = fixture()
        const first = await service.createVote(voter, 'move-conflict-first',
            {entryId: 'lock-a', votedBelt: 'Blue'})
        await expect(service.moveVote(admin, 'move-conflict-stale', first.vote.id,
            {entryId: 'lock-b', expectedRevision: 2})).rejects.toMatchObject({code: 'revision_conflict'})

        const second = await service.createVote(voter, 'move-conflict-second',
            {entryId: 'lock-b', votedBelt: 'Green'})
        await expect(service.moveVote(admin, 'move-conflict-duplicate', first.vote.id,
            {entryId: 'lock-b', expectedRevision: 1})).rejects.toMatchObject({code: 'duplicate_vote'})
        expect(records.get('classificationEntries/lock-a').currentVoteCount).toBe(1)
        expect(records.get('classificationEntries/lock-b').currentBeltCounts).toEqual({Green: 1})

        await service.deleteVote(voter, 'move-conflict-delete', second.vote.id, 1, false)
        records.set('classificationEntries/lock-b', {lastDecisionStatus: 'Settled'})
        await expect(service.moveVote(admin, 'move-conflict-settled', first.vote.id,
            {entryId: 'lock-b', expectedRevision: 1})).rejects.toMatchObject({code: 'entry_settled'})
        expect(records.has(`classificationVotes/${first.vote.id}`)).toBe(true)
    })

    it('lets only one simultaneous edit of a vote revision succeed', async () => {
        const {service, records} = fixture()
        const created = await service.createVote(voter, 'concurrent-vote-create',
            {entryId: 'lock-a', votedBelt: 'Blue'})
        const changes = await Promise.allSettled([
            service.editVote(voter, 'concurrent-vote-green', created.vote.id,
                {expectedRevision: 1, votedBelt: 'Green'}, false),
            service.editVote(voter, 'concurrent-vote-yellow', created.vote.id,
                {expectedRevision: 1, votedBelt: 'Yellow'}, false)
        ])
        expect(changes.filter(result => result.status === 'fulfilled')).toHaveLength(1)
        expect(changes.find(result => result.status === 'rejected').reason.code)
            .toBe('revision_conflict')
        expect(records.get(`classificationVotes/${created.vote.id}`).revision).toBe(2)
    })

    it('stages, settles, and reopens an action without copying votes', async () => {
        const {service, records} = fixture()
        const vote = await service.createVote(voter, 'lifecycle-vote',
            {entryId: 'lock-a', votedBelt: 'Blue'})
        const draft = await service.createAction(admin, 'lifecycle-draft', {
            entryId: 'lock-a', status: 'Draft', action: 'Belt Change', updatedBelt: 'Blue'
        })
        const staged = await service.editAction(admin, 'lifecycle-stage', draft.action.id, {
            expectedRevision: 1, status: 'Staged', action: 'Belt Change', updatedBelt: 'Blue'
        })
        expect(staged.action.status).toBe('Staged')
        await service.editAction(admin, 'lifecycle-settle', draft.action.id, {
            expectedRevision: 2, status: 'Settled', action: null
        })
        expect(records.get('classificationEntries/lock-a').previousVoteChips).toHaveLength(1)
        await service.editAction(admin, 'lifecycle-reopen', draft.action.id, {
            expectedRevision: 3, status: 'Re-opened', action: null
        })
        expect(records.get('classificationEntries/lock-a').currentVoteChips).toHaveLength(1)
        expect(records.get(`classificationVotes/${vote.vote.id}`).revision).toBe(1)
    })

    it('publishes only selected staged actions and replays an idempotent result', async () => {
        const {service, records} = fixture()
        const vote = await service.createVote(voter, 'create-key-4',
            {entryId: 'lock-a', votedBelt: 'Blue'})
        const actionA = await service.createAction(admin, 'action-key-a', {
            entryId: 'lock-a', status: 'Staged', action: 'Belt Change', updatedBelt: 'Blue',
            note: 'Approved', adminNote: 'Private'
        })
        const actionB = await service.createAction(admin, 'action-key-b', {
            entryId: 'lock-b', status: 'Staged', action: 'Delete', note: 'Separate'
        })
        const request = {actions: [{actionId: actionA.action.id, expectedRevision: 1}]}
        const published = await service.publishBatch(admin, 'publish-key-1', request)
        const replay = await service.publishBatch(admin, 'publish-key-1', request)
        expect(replay).toEqual(published)
        expect(published.publication.actions).toHaveLength(1)
        expect(published.publication.actions[0]).not.toHaveProperty('adminNote')
        expect(records.get(`classificationActions/${actionA.action.id}`).status).toBe('Published')
        expect(records.get(`classificationActions/${actionB.action.id}`).status).toBe('Staged')
        expect(records.get('classificationEntries/lock-a').currentVoteCount).toBe(0)
        expect(records.get('classificationEntries/lock-a').hasPreviousModernVotes).toBe(true)
        await expect(service.deleteAction(admin, 'delete-key-1', actionA.action.id, 2))
            .rejects.toMatchObject({code: 'published_action_immutable'})
        expect(records.get(`classificationVotes/${vote.vote.id}`).revision).toBe(1)
    })

    it('publishes one saved form decision without changing unrelated staged work', async () => {
        const {service, records} = fixture()
        const staged = await service.createAction(admin, 'action-key-c', {
            entryId: 'lock-b', status: 'Staged', action: 'Delete'
        })
        const published = await service.publishSingle(admin, 'single-key-1', {
            entryId: 'lock-a', actionId: null, expectedRevision: null,
            action: 'Belt Change', updatedBelt: 'Blue', note: 'Direct decision',
            omitChangelog: false
        })
        expect(published.publication.kind).toBe('single')
        expect(published.publication.actions).toMatchObject([{
            entryId: 'lock-a', previousBelt: 'White', updatedBelt: 'Blue'
        }])
        expect(records.get(`classificationActions/${staged.action.id}`).status).toBe('Staged')
        expect(records.get('classificationEntries/lock-a').lastDecisionStatus).toBe('Published')
        await expect(service.publishSingle(admin, 'single-key-1', {
            entryId: 'lock-a', actionId: null, expectedRevision: null,
            action: 'Delete', omitChangelog: false
        })).rejects.toMatchObject({code: 'idempotency_conflict'})
    })

    it('keeps a publication snapshot stable while the catalog import is delayed', async () => {
        const {service, catalog} = fixture()
        const staged = await service.createAction(admin, 'delayed-action', {
            entryId: 'lock-a', status: 'Staged', action: 'Belt Change', updatedBelt: 'Blue'
        })
        const result = await service.publishBatch(admin, 'delayed-publication', {
            actions: [{actionId: staged.action.id, expectedRevision: 1}]
        })
        const beforeImport = await service.getPublication(result.publication.id)
        expect(beforeImport.actions[0]).toMatchObject({
            entryName: 'Lock A', previousBelt: 'White', updatedBelt: 'Blue'
        })
        catalog.set('lock-a', {id: 'lock-a', name: 'Renamed Lock', belt: 'Blue'})
        expect(await service.getPublication(result.publication.id)).toEqual(beforeImport)
    })

    it('rejects stale publication revisions after a simultaneous admin edit', async () => {
        const {service, records} = fixture()
        const staged = await service.createAction(admin, 'concurrent-action', {
            entryId: 'lock-a', status: 'Staged', action: 'Delete'
        })
        const [edit, publish] = await Promise.allSettled([
            service.editAction(admin, 'concurrent-edit', staged.action.id, {
                expectedRevision: 1, status: 'Staged', action: 'Delete', note: 'Revised'
            }),
            service.publishBatch(admin, 'concurrent-publish', {
                actions: [{actionId: staged.action.id, expectedRevision: 1}]
            })
        ])
        expect(edit.status).toBe('fulfilled')
        expect(publish.status).toBe('rejected')
        expect(publish.reason.code).toBe('revision_conflict')
        expect([...records.keys()].filter(path => path.startsWith('classificationPublications/')))
            .toHaveLength(0)
    })

    it('does not publish when an action lock is absent from the catalog', async () => {
        const {service, records, catalog} = fixture()
        const staged = await service.createAction(admin, 'missing-action', {
            entryId: 'lock-a', status: 'Staged', action: 'Delete'
        })
        catalog.delete('lock-a')
        await expect(service.publishBatch(admin, 'missing-publish', {
            actions: [{actionId: staged.action.id, expectedRevision: 1}]
        })).rejects.toMatchObject({code: 'entry_not_found'})
        expect(records.get(`classificationActions/${staged.action.id}`).status).toBe('Staged')
        expect([...records.keys()].filter(path => path.startsWith('classificationPublications/')))
            .toHaveLength(0)
    })

    it('makes reopened votes current until the next decision', () => {
        const vote = {id: 'v1', userId: 'u1', displayName: 'One', votedBelt: 'Blue',
            updatedAt: new Date('2026-01-01T00:00:00Z')}
        const previous = {decisionMilestoneAt: new Date('2026-02-01T00:00:00Z'), revision: 1}
        expect(buildEntryProjections('lock-a', [vote], previous, null, new Date()).summary
            .previousVoteChips).toHaveLength(1)
        expect(buildEntryProjections('lock-a', [vote], {...previous, reopened: true}, null,
            new Date()).summary.currentVoteCount).toBe(1)
    })

    it('pages vote detail without repeats and rejects stale or malformed cursors', async () => {
        const {service} = fixture()
        for (const uid of ['voter-1', 'voter-2', 'voter-3']) {
            await service.createVote({uid, name: uid}, `create-${uid}`,
                {entryId: 'lock-a', votedBelt: 'Blue'})
        }
        const first = await service.getEntryVotes('lock-a', {limit: 2})
        const second = await service.getEntryVotes('lock-a',
            {limit: 2, cursor: first.nextCursor})
        expect(first.votes).toHaveLength(2)
        expect(second.votes).toHaveLength(1)
        expect(new Set([...first.votes, ...second.votes].map(vote => vote.id)).size).toBe(3)
        expect(second.nextCursor).toBeNull()
        await expect(service.getEntryVotes('lock-a', {cursor: 'bogus'}))
            .rejects.toMatchObject({code: 'invalid_cursor'})
        await service.editVote({uid: 'voter-1'}, 'edit-cursor', first.votes.find(vote =>
            vote.userId === 'voter-1')?.id ?? second.votes[0].id,
        {expectedRevision: 1, votedBelt: 'Green'}, false)
        await expect(service.getEntryVotes('lock-a', {cursor: first.nextCursor}))
            .rejects.toMatchObject({code: 'entry_changed'})
    })
})
