import express from 'express'
import request from 'supertest'
import {beforeEach, describe, expect, it, vi} from 'vitest'

const mocks = vi.hoisted(() => ({
    verifyFirebaseIdToken: vi.fn(), getFirestoreDb: vi.fn(),
    start: vi.fn(), exchange: vi.fn()
}))

vi.mock('../services/firebaseAdmin.js', () => ({
    verifyFirebaseIdToken: mocks.verifyFirebaseIdToken,
    getFirestoreDb: mocks.getFirestoreDb
}))
vi.mock('../services/redditImportService.js', () => ({
    createRedditImportService: () => ({start: mocks.start, exchange: mocks.exchange})
}))

import redditImport from '../routes/redditImport.js'

const app = express()
app.use(express.json())
app.use('/api/v1/reddit', redditImport)
app.use((error, _req, res, _next) => {
    res.status(error.status || 500).json({error: {code: error.code}})
})

const auth = {Authorization: 'Bearer test-firebase-token'}
const nonce = 'a'.repeat(32)
const state = 'A'.repeat(43)

beforeEach(() => {
    vi.clearAllMocks()
    mocks.verifyFirebaseIdToken.mockResolvedValue({uid: 'firebase-user'})
    mocks.getFirestoreDb.mockResolvedValue({})
    mocks.start.mockResolvedValue({state, authorizeUrl: 'https://www.reddit.com/api/v1/authorize'})
    mocks.exchange.mockResolvedValue({purpose: 'import', username: 'picker', flairText: null,
        bookmark: null, nextBookmark: null, messages: []})
})

describe('Reddit import routes', () => {
    it('requires Firebase authentication and marks both routes private', async () => {
        for (const path of ['/oauth/start', '/oauth/exchange']) {
            const result = await request(app).post(`/api/v1/reddit${path}`).send({})
            expect(result.status).toBe(401)
            expect(result.headers['cache-control']).toBe('private, no-store')
        }
        expect(mocks.start).not.toHaveBeenCalled()
        expect(mocks.exchange).not.toHaveBeenCalled()
    })

    it('rejects unexpected purposes, fields, and malformed state before service calls', async () => {
        const badStart = await request(app).post('/api/v1/reddit/oauth/start').set(auth)
            .send({purpose: 'beltRequest', nonce, redirectUri: 'https://dev.lpubelts.com/'})
        expect(badStart.status).toBe(400)
        const badExchange = await request(app).post('/api/v1/reddit/oauth/exchange').set(auth)
            .send({code: 'code', state: 'bad', nonce, token: 'unexpected'})
        expect(badExchange.status).toBe(400)
        expect(mocks.start).not.toHaveBeenCalled()
        expect(mocks.exchange).not.toHaveBeenCalled()
    })

    it('passes only validated data and the verified UID to service methods', async () => {
        const start = await request(app).post('/api/v1/reddit/oauth/start').set(auth)
            .send({purpose: 'debugImport', nonce, redirectUri: 'https://dev.lpubelts.com/'})
        expect(start.status).toBe(200)
        expect(start.headers['cache-control']).toBe('private, no-store')
        expect(mocks.start).toHaveBeenCalledWith({uid: 'firebase-user', purpose: 'debugImport',
            nonce, redirectUri: 'https://dev.lpubelts.com/'})
        const exchange = await request(app).post('/api/v1/reddit/oauth/exchange').set(auth)
            .send({code: 'code', state, nonce})
        expect(exchange.status).toBe(200)
        expect(mocks.exchange).toHaveBeenCalledWith({uid: 'firebase-user', code: 'code', state, nonce})
        expect(JSON.stringify(exchange.body)).not.toContain('test-firebase-token')
    })
})
