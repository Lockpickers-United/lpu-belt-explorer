import express from 'express'
import request from 'supertest'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {registerRoutes} from '../../routes.js'
import {rateLimitPolicies} from '../../api/middleware/rateLimit.js'

const verifyFirebaseIdToken = vi.hoisted(() => vi.fn())

vi.mock('../../api/services/firebaseAdmin.js', () => ({
    verifyFirebaseIdToken
}))

function createApp(getRedditBeltsHandler) {
    const app = express()
    registerRoutes(app, {prefix: '', getRedditBeltsHandler})
    app.use((error, _req, res, _next) => {
        res.status(error.status || 500).json({code: error.code})
    })
    return app
}

beforeEach(() => {
    verifyFirebaseIdToken.mockReset()
})

describe('Reddit belt route authorization', () => {
    it.each(['get', 'post'])('rejects %s requests without a bearer token', async method => {
        const getRedditBeltsHandler = vi.fn()
        const response = await request(createApp(getRedditBeltsHandler))[method]('/fetch-reddit-flairs')

        expect(response.status).toBe(401)
        expect(response.headers['x-ratelimit-limit']).toBe(String(rateLimitPolicies.redditBelts.max))
        expect(response.body).toEqual({code: 'unauthorized'})
        expect(verifyFirebaseIdToken).not.toHaveBeenCalled()
        expect(getRedditBeltsHandler).not.toHaveBeenCalled()
    })

    it('rejects a bearer token that Firebase cannot verify', async () => {
        verifyFirebaseIdToken.mockRejectedValue(new Error('invalid token'))
        const getRedditBeltsHandler = vi.fn()
        const response = await request(createApp(getRedditBeltsHandler))
            .post('/fetch-reddit-flairs')
            .set('Authorization', 'Bearer invalid-token')

        expect(response.status).toBe(401)
        expect(response.body).toEqual({code: 'invalid_token'})
        expect(getRedditBeltsHandler).not.toHaveBeenCalled()
    })

    it.each([
        ['missing', undefined],
        ['false', false],
        ['a string instead of the boolean true', 'true']
    ])('rejects an authenticated token with a %s lpuAdmin claim', async (_label, lpuAdmin) => {
        verifyFirebaseIdToken.mockResolvedValue({uid: 'user-1', lpuAdmin})
        const getRedditBeltsHandler = vi.fn()
        const response = await request(createApp(getRedditBeltsHandler))
            .post('/fetch-reddit-flairs')
            .set('Authorization', 'Bearer signed-token')

        expect(response.status).toBe(403)
        expect(response.body).toEqual({code: 'lpu_admin_required'})
        expect(getRedditBeltsHandler).not.toHaveBeenCalled()
    })

    it('uses the injected handler when the verified token has lpuAdmin: true', async () => {
        verifyFirebaseIdToken.mockResolvedValue({uid: 'user-1', lpuAdmin: true})
        const getRedditBeltsHandler = vi.fn((_req, res) => res.status(204).end())
        const response = await request(createApp(getRedditBeltsHandler))
            .post('/fetch-reddit-flairs')
            .set('Authorization', 'Bearer signed-token')

        expect(response.status).toBe(204)
        expect(verifyFirebaseIdToken).toHaveBeenCalledWith('signed-token')
        expect(getRedditBeltsHandler).toHaveBeenCalledOnce()
    })
})
