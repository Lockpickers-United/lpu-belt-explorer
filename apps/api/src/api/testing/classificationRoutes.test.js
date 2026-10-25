import express from 'express'
import request from 'supertest'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import api from '../index.js'

const mocks = vi.hoisted(() => ({
    verifyFirebaseIdToken: vi.fn(),
    getFirestoreDb: vi.fn(),
    createClassificationService: vi.fn(),
    getEntryVotes: vi.fn(),
    createVote: vi.fn(),
    editVote: vi.fn(),
    moveVote: vi.fn(),
    deleteVote: vi.fn(),
    createAction: vi.fn(),
    editAction: vi.fn(),
    publishBatch: vi.fn(),
    publishSingle: vi.fn(),
    setPublicationApproval: vi.fn()
}))

vi.mock('../services/firebaseAdmin.js', () => ({
    verifyFirebaseIdToken: mocks.verifyFirebaseIdToken,
    getFirestoreDb: mocks.getFirestoreDb
}))

vi.mock('../services/classificationService.js', () => ({
    createClassificationService: mocks.createClassificationService
}))

vi.mock('../services/classificationCatalog.js', () => ({getCatalogEntry: vi.fn()}))

const app = express()
app.use(express.json())
app.use('/api', api)
app.use((error, _req, res, _next) => {
    res.status(error.status || 500).json({error: {code: error.code, message: error.message}})
})

beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv('CLASSIFICATION_WRITE_STAGE', 'publish')
    mocks.verifyFirebaseIdToken.mockImplementation(async token => {
        if (token === 'blackbelt') return {uid: 'blackbelt', blackBelt: true}
        if (token === 'admin') return {uid: 'admin', admin: true}
        if (token === 'classification-admin') return {uid: 'classification-admin', classificationAdmin: true}
        if (token === 'voter') return {uid: 'voter', classificationTeam: true}
        return {uid: 'ordinary'}
    })
    mocks.getFirestoreDb.mockResolvedValue({})
    mocks.createClassificationService.mockReturnValue({
        getEntryVotes: mocks.getEntryVotes,
        createVote: mocks.createVote,
        editVote: mocks.editVote,
        moveVote: mocks.moveVote,
        deleteVote: mocks.deleteVote,
        createAction: mocks.createAction,
        editAction: mocks.editAction,
        publishBatch: mocks.publishBatch,
        publishSingle: mocks.publishSingle,
        setPublicationApproval: mocks.setPublicationApproval
    })
    mocks.getEntryVotes.mockResolvedValue({entryId: 'lock-a', votes: [], nextCursor: null})
    mocks.createVote.mockResolvedValue({vote: {id: 'vote-a'}, entryRevision: 1})
    mocks.editVote.mockResolvedValue({vote: {id: 'vote-a'}, entryRevision: 2})
    mocks.moveVote.mockResolvedValue({vote: {id: 'vote-b'}, entryRevision: 1,
        sourceEntryRevision: 2})
    mocks.deleteVote.mockResolvedValue({voteId: 'vote-a', entryRevision: 3})
    mocks.createAction.mockResolvedValue({action: {id: 'action-a'}, entryRevision: 1})
    mocks.editAction.mockResolvedValue({action: {id: 'action-a'}, entryRevision: 2})
    mocks.publishBatch.mockResolvedValue({publication: {id: 'publication-a'}})
    mocks.publishSingle.mockResolvedValue({publication: {id: 'publication-single'}})
    mocks.setPublicationApproval.mockResolvedValue({publicationId: 'publication-a',
        actionId: 'action-a', approved: true})
})

afterEach(() => vi.unstubAllEnvs())

describe('classification routes', () => {
    it('allows only admins to set a published action approval with a boolean', async () => {
        const patchApproval = token => request(app)
            .patch('/api/v1/classification/publications/publication-a/actions/action-a/approval')
            .set('Authorization', `Bearer ${token}`).set('Idempotency-Key', 'approval-key')

        expect((await patchApproval('voter').send({approved: true})).status).toBe(403)
        expect((await patchApproval('admin').send({approved: 'true'})).status).toBe(400)
        expect((await patchApproval('admin').send({approved: true, status: 'Published'})).status).toBe(400)
        expect(mocks.setPublicationApproval).not.toHaveBeenCalled()
        vi.stubEnv('CLASSIFICATION_WRITE_STAGE', 'action')
        expect((await patchApproval('admin').send({approved: true})).status).toBe(503)
        vi.stubEnv('CLASSIFICATION_WRITE_STAGE', 'publish')

        const response = await patchApproval('classification-admin').send({approved: true})
        expect(response.status).toBe(200)
        expect(mocks.setPublicationApproval).toHaveBeenCalledWith(
            {uid: 'classification-admin', classificationAdmin: true}, 'approval-key',
            'publication-a', 'action-a', {approved: true})
    })
    it('keeps writes closed by default and promotes vote, action, and publication stages separately', async () => {
        const vote = {entryId: 'lock-a', votedBelt: 'Blue'}
        const sendVote = () => request(app).post('/api/v1/classification/votes')
            .set('Authorization', 'Bearer blackbelt').set('Idempotency-Key', 'stage-vote')
            .send(vote)
        vi.stubEnv('CLASSIFICATION_WRITE_STAGE', '')
        expect((await sendVote()).body.error.code).toBe('writes_disabled')
        vi.stubEnv('CLASSIFICATION_WRITE_STAGE', 'vote')
        expect((await sendVote()).status).toBe(201)
        const action = await request(app).post('/api/v1/classification/actions')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'stage-action')
            .send({entryId: 'lock-a', status: 'Draft'})
        expect(action.body.error.code).toBe('writes_disabled')
        vi.stubEnv('CLASSIFICATION_WRITE_STAGE', 'action')
        expect((await request(app).post('/api/v1/classification/actions')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'stage-action')
            .send({entryId: 'lock-a', status: 'Draft'})).status).toBe(201)
        const publish = await request(app).post('/api/v1/classification/publications')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'stage-publish')
            .send({actions: [{actionId: 'action-a', expectedRevision: 1}]})
        expect(publish.body.error.code).toBe('writes_disabled')
        vi.stubEnv('CLASSIFICATION_WRITE_STAGE', 'publish')
        expect((await request(app).post('/api/v1/classification/publications')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'stage-publish')
            .send({actions: [{actionId: 'action-a', expectedRevision: 1}]})).status).toBe(201)
    })
    it('requires a verified token and eligible claim for protected reads', async () => {
        const anonymous = await request(app).get('/api/v1/classification/entries/lock-a/votes')
        expect(anonymous.status).toBe(401)
        const ordinary = await request(app).get('/api/v1/classification/entries/lock-a/votes')
            .set('Authorization', 'Bearer ordinary')
        expect(ordinary.status).toBe(403)
        expect(mocks.getEntryVotes).not.toHaveBeenCalled()

        const blackBelt = await request(app).get('/api/v1/classification/entries/lock-a/votes')
            .set('Authorization', 'Bearer blackbelt')
        expect(blackBelt.status).toBe(200)
        expect(blackBelt.headers['cache-control']).toBe('private, no-store')
        expect(blackBelt.body.data.votes).toEqual([])
        expect(mocks.getEntryVotes).toHaveBeenCalledWith('lock-a', {limit: 25})
    })

    it('requires an eligible voter claim and validates vote input before service access', async () => {
        const body = {entryId: 'lock-a', votedBelt: 'Blue'}
        const ordinary = await request(app).post('/api/v1/classification/votes')
            .set('Authorization', 'Bearer ordinary').set('Idempotency-Key', 'unique-key-1')
            .send(body)
        expect(ordinary.status).toBe(403)

        const invalid = await request(app).post('/api/v1/classification/votes')
            .set('Authorization', 'Bearer voter').set('Idempotency-Key', 'unique-key-2')
            .send({...body, votedBelt: 'Unranked'})
        expect(invalid.status).toBe(400)
        expect(invalid.body.error.code).toBe('invalid_request')
        expect(mocks.createVote).not.toHaveBeenCalled()

        const saved = await request(app).post('/api/v1/classification/votes')
            .set('Authorization', 'Bearer voter').set('Idempotency-Key', 'unique-key-3')
            .send(body)
        expect(saved.status).toBe(201)
        expect(saved.body.data.vote.id).toBe('vote-a')
        expect(mocks.createVote).toHaveBeenCalledWith(
            {uid: 'voter', classificationTeam: true}, 'unique-key-3', body)
    })

    it('allows a verified Black Belt to create, edit, and delete a vote without admin access', async () => {
        const user = {uid: 'blackbelt', blackBelt: true}
        const createdBody = {entryId: 'lock-a', votedBelt: 'Blue'}
        const created = await request(app).post('/api/v1/classification/votes')
            .set('Authorization', 'Bearer blackbelt').set('Idempotency-Key', 'blackbelt-create')
            .send(createdBody)
        expect(created.status).toBe(201)
        expect(mocks.createVote).toHaveBeenCalledWith(user, 'blackbelt-create', createdBody)

        const editBody = {expectedRevision: 1, votedBelt: 'Green'}
        const edited = await request(app).patch('/api/v1/classification/votes/vote-a')
            .set('Authorization', 'Bearer blackbelt').set('Idempotency-Key', 'blackbelt-edit')
            .send(editBody)
        expect(edited.status).toBe(200)
        expect(mocks.editVote).toHaveBeenCalledWith(user, 'blackbelt-edit', 'vote-a', editBody, false)

        const deleted = await request(app).delete('/api/v1/classification/votes/vote-a')
            .set('Authorization', 'Bearer blackbelt').set('Idempotency-Key', 'blackbelt-delete')
            .send({expectedRevision: 2})
        expect(deleted.status).toBe(200)
        expect(mocks.deleteVote).toHaveBeenCalledWith(user, 'blackbelt-delete', 'vote-a', 2, false)

        const action = await request(app).post('/api/v1/classification/actions')
            .set('Authorization', 'Bearer blackbelt').set('Idempotency-Key', 'blackbelt-action')
            .send({})
        expect(action.status).toBe(403)

        const publication = await request(app).post('/api/v1/classification/publications')
            .set('Authorization', 'Bearer blackbelt').set('Idempotency-Key', 'blackbelt-publish')
            .send({})
        expect(publication.status).toBe(403)
    })

    it('allows only admins to move a vote and validates its target and revision', async () => {
        const body = {entryId: 'lock-b', expectedRevision: 2}
        const move = token => request(app).post('/api/v1/classification/votes/vote-a/move')
            .set('Authorization', `Bearer ${token}`).set('Idempotency-Key', 'move-vote-key')

        expect((await move('blackbelt').send(body)).status).toBe(403)
        expect((await move('admin').send({entryId: 'lock-b', expectedRevision: 0})).status).toBe(400)
        expect((await move('admin').send({...body, votedBelt: 'Blue'})).status).toBe(400)
        expect(mocks.moveVote).not.toHaveBeenCalled()

        const moved = await move('admin').send(body)
        expect(moved.status).toBe(200)
        expect(moved.body.data.vote.id).toBe('vote-b')
        expect(mocks.moveVote).toHaveBeenCalledWith({uid: 'admin', admin: true},
            'move-vote-key', 'vote-a', body)

        expect((await move('classification-admin').send(body)).status).toBe(200)
        expect(mocks.moveVote).toHaveBeenCalledWith(
            {uid: 'classification-admin', classificationAdmin: true},
            'move-vote-key', 'vote-a', body)
    })

    it('accepts Other for admin saves and direct publication without belt or target', async () => {
        const actor = {uid: 'admin', admin: true}
        const action = {status: 'Staged', action: 'Other', updatedBelt: null,
            samelineTargetId: null, note: 'Updated lock details'}
        const createBody = {entryId: 'lock-a', ...action}
        const created = await request(app).post('/api/v1/classification/actions')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'other-create')
            .send(createBody)
        expect(created.status).toBe(201)
        expect(mocks.createAction).toHaveBeenCalledWith(actor, 'other-create', createBody)

        const editBody = {expectedRevision: 1, ...action}
        const edited = await request(app).patch('/api/v1/classification/actions/action-a')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'other-edit')
            .send(editBody)
        expect(edited.status).toBe(200)
        expect(mocks.editAction).toHaveBeenCalledWith(actor, 'other-edit', 'action-a', editBody)

        const publishBody = {entryId: 'lock-a', actionId: null, expectedRevision: null,
            action: 'Other', updatedBelt: null, samelineTargetId: null,
            note: 'Updated lock details', omitChangelog: false}
        const published = await request(app).post('/api/v1/classification/publications/single')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'other-publish')
            .send(publishBody)
        expect(published.status).toBe(201)
        expect(mocks.publishSingle).toHaveBeenCalledWith(actor, 'other-publish', publishBody)

        const invalid = await request(app).post('/api/v1/classification/publications/single')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'other-invalid')
            .send({...publishBody, updatedBelt: 'Blue'})
        expect(invalid.status).toBe(400)
        expect(mocks.publishSingle).toHaveBeenCalledTimes(1)
    })

    it('validates the new sameline name on save and direct publication', async () => {
        const actor = {uid: 'admin', admin: true}
        const action = {status: 'Staged', action: 'Add New Sameline',
            newSamelineName: 'New Lock Name', updatedBelt: null, samelineTargetId: null}
        const createBody = {entryId: 'lock-a', ...action}
        const created = await request(app).post('/api/v1/classification/actions')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'new-sameline-create')
            .send(createBody)
        expect(created.status).toBe(201)
        expect(mocks.createAction).toHaveBeenCalledWith(actor, 'new-sameline-create', createBody)

        const editBody = {expectedRevision: 1, ...action}
        const edited = await request(app).patch('/api/v1/classification/actions/action-a')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'new-sameline-edit')
            .send(editBody)
        expect(edited.status).toBe(200)
        expect(mocks.editAction).toHaveBeenCalledWith(actor, 'new-sameline-edit', 'action-a', editBody)

        const publishBody = {entryId: 'lock-a', actionId: null, expectedRevision: null,
            action: 'Add New Sameline', newSamelineName: 'New Lock Name',
            updatedBelt: null, samelineTargetId: null, omitChangelog: false}
        const published = await request(app).post('/api/v1/classification/publications/single')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'new-sameline-publish')
            .send(publishBody)
        expect(published.status).toBe(201)
        expect(mocks.publishSingle).toHaveBeenCalledWith(actor, 'new-sameline-publish', publishBody)

        for (const newSamelineName of [null, '   ']) {
            const invalid = await request(app).post('/api/v1/classification/actions')
                .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'invalid-name')
                .send({...createBody, newSamelineName})
            expect(invalid.status).toBe(400)
        }
        const unrelated = await request(app).post('/api/v1/classification/publications/single')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'unexpected-name')
            .send({...publishBody, action: 'Other'})
        expect(unrelated.status).toBe(400)
        expect(mocks.createAction).toHaveBeenCalledTimes(1)
        expect(mocks.publishSingle).toHaveBeenCalledTimes(1)
    })

    it('allows publication only to admins with a bounded action list', async () => {
        const body = {actions: [{actionId: 'action-a', expectedRevision: 1}]}
        const voter = await request(app).post('/api/v1/classification/publications')
            .set('Authorization', 'Bearer voter').set('Idempotency-Key', 'unique-key-4')
            .send(body)
        expect(voter.status).toBe(403)

        const admin = await request(app).post('/api/v1/classification/publications')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'unique-key-5')
            .send(body)
        expect(admin.status).toBe(201)
        expect(admin.body.data.publication.id).toBe('publication-a')
        expect(mocks.publishBatch).toHaveBeenCalledWith(
            {uid: 'admin', admin: true}, 'unique-key-5', body)
    })

    it('accepts 50 publication actions and rejects 51', async () => {
        const actions = Array.from({length: 51}, (_, index) => ({
            actionId: `action-${index}`, expectedRevision: 1
        }))
        const accepted = await request(app).post('/api/v1/classification/publications')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'batch-of-50')
            .send({actions: actions.slice(0, 50)})
        expect(accepted.status).toBe(201)
        expect(mocks.publishBatch).toHaveBeenCalledWith(
            {uid: 'admin', admin: true}, 'batch-of-50', {actions: actions.slice(0, 50)})

        const rejected = await request(app).post('/api/v1/classification/publications')
            .set('Authorization', 'Bearer admin').set('Idempotency-Key', 'batch-of-51')
            .send({actions})
        expect(rejected.status).toBe(400)
        expect(mocks.publishBatch).toHaveBeenCalledTimes(1)
    })
})
