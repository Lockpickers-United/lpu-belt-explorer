import {beforeEach, describe, expect, it, vi} from 'vitest'
import {createRequestLockHandlers} from './requestLock.js'

function createResponse() {
    const res = {
        headersSent: false,
        statusCode: null,
        body: null
    }
    res.status = vi.fn(status => {
        res.statusCode = status
        return res
    })
    res.json = vi.fn(body => {
        res.body = body
        res.headersSent = true
        return res
    })
    return res
}

function createDependencies(refOverrides = {}) {
    const ref = {
        set: vi.fn().mockResolvedValue(undefined),
        update: vi.fn().mockResolvedValue(undefined),
        get: vi.fn().mockResolvedValue({exists: true, data: () => ({requestedBy: []})}),
        ...refOverrides
    }
    const doc = vi.fn(() => ref)
    const collection = vi.fn(() => ({doc}))
    const activityLogger = vi.fn().mockResolvedValue(undefined)
    const emailSender = vi.fn().mockResolvedValue(undefined)
    const auth = {
        verifyIdToken: vi.fn().mockResolvedValue({
            user_id: 'user-1',
            admin: true
        })
    }
    const handlers = createRequestLockHandlers({
        db: {collection},
        auth,
        uploadDir: '/tmp/request-lock-tests',
        publicImageBaseUrl: 'https://example.test/requestedLocks',
        productionData: false,
        activityLogger,
        emailSender,
        emailRecipients: ['content@example.test'],
        formFactory: vi.fn(() => ({})),
        parseFormData: vi.fn().mockResolvedValue({
            fields: {
                id: ['request-1'],
                make: ['Example'],
                model: ['Lock'],
                displayName: ['Picker One'],
                discordUsername: ['picker-one']
            },
            files: {}
        }),
        now: () => new Date('2026-09-12T12:00:00.000Z')
    })

    return {handlers, ref, collection, activityLogger, emailSender, auth}
}

function authorizedRequest(body = {}) {
    return {
        headers: {authorization: 'Bearer valid-token'},
        body
    }
}

describe('createRequestLockHandlers', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('creates a request using injected services and logs a write', async () => {
        const {handlers, ref, activityLogger, emailSender, auth} = createDependencies()
        const req = authorizedRequest({prod: true})
        const res = createResponse()

        await handlers.requestLock(req, res)

        expect(auth.verifyIdToken).toHaveBeenCalledWith('valid-token')
        expect(ref.set).toHaveBeenCalledWith(expect.objectContaining({
            id: 'request-1',
            displayName: 'Picker One',
            media: []
        }))
        expect(emailSender).toHaveBeenCalledOnce()
        expect(activityLogger).toHaveBeenCalledWith([
            expect.objectContaining({type: 'WRITE', source: 'request-create', prod: false})
        ])
        expect(res.statusCode).toBe(200)
    })

    it('updates a request without consulting the request prod flag', async () => {
        const {handlers, ref, activityLogger} = createDependencies()
        const entry = {id: 'request-1', displayName: 'Updated Picker'}
        const req = authorizedRequest({entry, prod: true})
        const res = createResponse()

        await handlers.updateRequest(req, res)

        expect(ref.set).toHaveBeenCalledWith(entry)
        expect(activityLogger).toHaveBeenCalledWith([
            expect.objectContaining({source: 'request-update', prod: false})
        ])
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual(entry)
    })

    it('returns the updated vote list', async () => {
        const existingVote = {userId: 'user-2', displayName: 'Picker Two'}
        const {handlers, ref} = createDependencies({
            get: vi.fn().mockResolvedValue({
                exists: true,
                data: () => ({requestedBy: [existingVote]})
            })
        })
        const newVote = {entryId: 'request-1', userId: 'user-1', displayName: 'Picker One'}
        const res = createResponse()

        await handlers.updateVotes(authorizedRequest({newVote, prod: true}), res)

        expect(ref.update).toHaveBeenCalledWith({requestedBy: [existingVote, newVote]})
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual([existingVote, newVote])
    })

    it('does not send email or a success response after a Firestore failure', async () => {
        const error = new Error('Firestore unavailable')
        const {handlers, emailSender} = createDependencies({
            set: vi.fn().mockRejectedValue(error)
        })
        const res = createResponse()

        await handlers.requestLock(authorizedRequest(), res)

        expect(emailSender).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.statusCode).toBe(500)
        expect(res.body.status).toBe('error')
    })
})
