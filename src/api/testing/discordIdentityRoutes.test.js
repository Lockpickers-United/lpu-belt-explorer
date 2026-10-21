import express from 'express'
import request from 'supertest'
import {beforeEach, describe, expect, it, vi} from 'vitest'

const mocks = vi.hoisted(() => ({
    verifyFirebaseIdToken: vi.fn(),
    getFirestoreDb: vi.fn(),
    start: vi.fn(),
    exchange: vi.fn()
}))

vi.mock('../services/firebaseAdmin.js', () => ({
    verifyFirebaseIdToken: mocks.verifyFirebaseIdToken,
    getFirestoreDb: mocks.getFirestoreDb
}))
vi.mock('../services/discordIdentityService.js', () => ({
    createDiscordIdentityService: () => ({
        start: mocks.start,
        exchange: mocks.exchange
    })
}))

import discordIdentity from '../routes/discordIdentity.js'

const app = express()
app.use(express.json())
app.use('/api/v1/discord', discordIdentity)
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
    mocks.start.mockResolvedValue({state, authorizeUrl: 'https://discord.com/oauth2/authorize'})
    mocks.exchange.mockResolvedValue({purpose: 'import', returnTo: null, identity: {
        discordId: '123456789012345678', username: 'picker'
    }})
})

describe('Discord identity routes', () => {
    it('requires a verified Firebase token for every route', async () => {
        for (const [method, path] of [
            ['post', '/oauth/start'], ['post', '/oauth/exchange']
        ]) {
            const response = await request(app)[method](`/api/v1/discord${path}`)
            expect(response.status).toBe(401)
            expect(response.headers['cache-control']).toBe('private, no-store')
        }
        expect(mocks.start).not.toHaveBeenCalled()
    })

    it('rejects invalid redirect destinations and purpose combinations', async () => {
        const response = await request(app).post('/api/v1/discord/oauth/start')
            .set(auth).send({
                purpose: 'beltRequest', returnTo: 'https://evil.example/', nonce,
                redirectUri: 'https://lpubelts.com/#/auth/discord'
            })
        expect(response.status).toBe(400)
        expect(response.body.error.code).toBe('invalid_request')
        expect(mocks.start).not.toHaveBeenCalled()
    })

    it('binds start and exchange to the authenticated UID', async () => {
        const startResponse = await request(app).post('/api/v1/discord/oauth/start')
            .set(auth).send({
                purpose: 'beltRequest', returnTo: '/beltRequests', nonce,
                redirectUri: 'https://lpubelts.com/#/auth/discord'
            })
        expect(startResponse.status).toBe(200)
        expect(startResponse.headers['cache-control']).toBe('private, no-store')
        expect(mocks.start).toHaveBeenCalledWith({
            uid: 'firebase-user', purpose: 'beltRequest', returnTo: '/beltRequests', nonce,
            redirectUri: 'https://lpubelts.com/#/auth/discord'
        })

        const exchangeResponse = await request(app).post('/api/v1/discord/oauth/exchange')
            .set(auth).send({code: 'oauth-code', state, nonce})
        expect(exchangeResponse.status).toBe(200)
        expect(mocks.exchange).toHaveBeenCalledWith({
            uid: 'firebase-user', code: 'oauth-code', state, nonce
        })
        expect(JSON.stringify(exchangeResponse.body)).not.toContain('test-firebase-token')
    })

})
