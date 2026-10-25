import express from 'express'
import request from 'supertest'
import {beforeEach, describe, expect, it, vi} from 'vitest'

const mocks = vi.hoisted(() => ({
    verifyFirebaseIdToken: vi.fn(),
    getFirestoreDb: vi.fn(),
    post: vi.fn()
}))
vi.mock('../services/firebaseAdmin.js', () => ({
    verifyFirebaseIdToken: mocks.verifyFirebaseIdToken,
    getFirestoreDb: mocks.getFirestoreDb
}))
vi.mock('../services/discordIdentityService.js', () => ({
    createDiscordIdentityService: () => ({consumePostingGrant: vi.fn()})
}))
vi.mock('../services/discordBeltRequestService.js', () => ({
    createDiscordBeltRequestService: () => ({post: mocks.post})
}))

import discordBeltRequests from '../routes/discordBeltRequests.js'

const app = express()
app.use(express.json())
app.use('/api/v1/belt-requests', discordBeltRequests)
app.use((error, _req, res, _next) => {
    res.status(error.status || 500).json({error: {code: error.code}})
})
const auth = {Authorization: 'Bearer test-firebase-token'}
const body = {postingGrant: 'A'.repeat(43), request: {
    requestBelt: 'White Belt', entries: [{lockId: '562e964e', lockName: 'Master Lock #3',
        belt: 'White', link: 'https://example.test/evidence'}], quests: []
}}

beforeEach(() => {
    vi.clearAllMocks()
    mocks.verifyFirebaseIdToken.mockResolvedValue({uid: 'firebase-user'})
    mocks.getFirestoreDb.mockResolvedValue({})
    mocks.post.mockResolvedValue({messageId: '123456789012345678',
        channelId: '1360395141822812311', guildId: '140129091796992000'})
})

describe('Discord belt request route', () => {
    it('requires Firebase authentication and returns private responses', async () => {
        const response = await request(app).post('/api/v1/belt-requests/discord').send(body)
        expect(response.status).toBe(401)
        expect(response.headers['cache-control']).toBe('private, no-store')
        expect(mocks.post).not.toHaveBeenCalled()
    })

    it('rejects a client-supplied requester ID and invalid evidence before posting', async () => {
        for (const invalid of [
            {...body, request: {...body.request, userId: 'forged'}},
            {...body, request: {...body.request, entries: [{...body.request.entries[0],
                link: 'javascript:alert(1)'}]}}
        ]) {
            const response = await request(app).post('/api/v1/belt-requests/discord')
                .set(auth).send(invalid)
            expect(response.status).toBe(400)
            expect(response.body.error.code).toBe('belt_request_invalid')
        }
        expect(mocks.post).not.toHaveBeenCalled()
    })

    it('passes structured input and authenticated UID to the service', async () => {
        const response = await request(app).post('/api/v1/belt-requests/discord').set(auth).send(body)
        expect(response.status).toBe(200)
        expect(response.headers['cache-control']).toBe('private, no-store')
        expect(mocks.post).toHaveBeenCalledWith({uid: 'firebase-user', ...body})
        expect(response.body.data.messageId).toBe('123456789012345678')
    })

    it('passes Discord rate-limit timing through a safe header', async () => {
        mocks.post.mockRejectedValue(Object.assign(new Error('Discord is rate limiting requests'),
            {status: 429, code: 'discord_rate_limited', retryAfterSeconds: 7}))
        const response = await request(app).post('/api/v1/belt-requests/discord').set(auth).send(body)
        expect(response.status).toBe(429)
        expect(response.headers['retry-after']).toBe('7')
        expect(response.body.error.code).toBe('discord_rate_limited')
    })
})
