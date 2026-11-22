import express from 'express'
import request from 'supertest'
import {afterEach, beforeEach, expect, it, vi} from 'vitest'

const mocks = vi.hoisted(() => ({getFirestoreDb: vi.fn()}))
vi.mock('../services/firebaseAdmin.js', () => ({getFirestoreDb: mocks.getFirestoreDb}))
import router from '../routes/redditBeltRequests.js'

const app = express()
app.use(express.json())
app.use('/api/v1/belt-requests', router)
const body = {source: 'Reddit', platform: 'Reddit', belt: 'Blue Belt', username: 'lpubelts',
    currentBelt: 'unknown', requestId: '3vm6d4', messageContent: '@lockyjr request blue https://example.test/video'}
let records
let transaction
const send = (payload = body, token = 'test-webhook-key') => request(app)
    .post('/api/v1/belt-requests/reddit').set('Authorization', `Bearer ${token}`).send(payload)

beforeEach(() => {
    vi.stubEnv('REDDIT_BELT_REQUEST_API_KEY', 'test-webhook-key')
    records = new Map()
    transaction = {get: vi.fn(async ref => ({exists: records.has(ref)})),
        set: vi.fn((ref, data) => records.set(ref, data))}
    mocks.getFirestoreDb.mockReset().mockResolvedValue({
        collection: name => {
            expect(name).toBe('belt-requests')
            return {doc: id => id}
        },
        runTransaction: callback => callback(transaction)
    })
})
afterEach(() => vi.unstubAllEnvs())

it('fails closed without configuration or valid bearer authentication before database access', async () => {
    expect((await send(body, 'wrong-key')).status).toBe(401)
    expect((await request(app).post('/api/v1/belt-requests/reddit').send(body)).status).toBe(401)
    vi.stubEnv('REDDIT_BELT_REQUEST_API_KEY', '')
    expect((await send()).status).toBe(503)
    expect(mocks.getFirestoreDb).not.toHaveBeenCalled()
})

it('rejects malformed or privileged fields before database access', async () => {
    for (const invalid of [{...body, status: 'approved'}, {...body, userId: 'forged'},
        {...body, source: 'Site'}, {...body, belt: 'Fake Belt'}, {...body, username: '../bad'},
        {...body, requestId: '../bad'}, {...body, messageContent: ''},
        {...body, messageContent: 'x'.repeat(10001)}, {...body, syncTo: 'Discord'}]) {
        expect((await send(invalid)).status).toBe(400)
    }
    expect(mocks.getFirestoreDb).not.toHaveBeenCalled()
})

it('creates a bot-compatible incoming record and deduplicates retries without resetting status', async () => {
    const response = await send({...body, syncTo: 'Discord', syncUsername: 'example'})
    expect(response.status).toBe(201)
    expect(response.headers['cache-control']).toBe('private, no-store')
    const id = response.body.data.id
    expect(records.get(id)).toEqual({...body, syncTo: 'Discord', syncUsername: 'example', id,
        userId: 'reddit-lpubelts', status: 'incoming', revision: 1,
        dateAdded: expect.any(String), lastUpdated: expect.any(String)})
    records.get(id).status = 'approved'
    const retry = await send({syncUsername: 'example', syncTo: 'Discord', ...body})
    expect(retry.status).toBe(200)
    expect(retry.body.data).toEqual({id, created: false})
    expect(records.get(id).status).toBe('approved')
    expect(transaction.set).toHaveBeenCalledTimes(1)
    expect((await send({...body, messageContent: 'updated evidence'})).status).toBe(201)
    expect(records.size).toBe(2)
})

it('returns a retryable storage error without leaking SDK details', async () => {
    mocks.getFirestoreDb.mockRejectedValue(new Error('private credential detail'))
    const response = await send()
    expect(response.status).toBe(503)
    expect(response.body).toEqual({error: {code: 'belt_request_storage_unavailable'}})
})

it('accepts Dan requests supported by Devvit', async () => {
    expect((await send({...body, belt: '20th Dan'})).status).toBe(201)
})
