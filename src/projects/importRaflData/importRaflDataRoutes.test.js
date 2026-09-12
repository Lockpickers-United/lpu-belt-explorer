import express from 'express'
import request from 'supertest'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {registerRoutes} from '../../routes.js'

const verifyFirebaseIdToken = vi.hoisted(() => vi.fn())

vi.mock('../../api/services/firebaseAdmin.js', () => ({
    verifyFirebaseIdToken
}))

function createApp(importRaflDataHandler) {
    const app = express()
    registerRoutes(app, {prefix: '', importRaflDataHandler})
    app.use((error, _req, res, _next) => {
        res.status(error.status || 500).json({code: error.code})
    })
    return app
}

beforeEach(() => {
    verifyFirebaseIdToken.mockReset()
})

describe('RAFL preview route authorization', () => {
    it('rejects a request without a bearer token', async () => {
        const importRaflDataHandler = vi.fn()
        const response = await request(createApp(importRaflDataHandler)).get('/refresh-preview')

        expect(response.status).toBe(401)
        expect(response.body).toEqual({code: 'unauthorized'})
        expect(verifyFirebaseIdToken).not.toHaveBeenCalled()
        expect(importRaflDataHandler).not.toHaveBeenCalled()
    })

    it('rejects a bearer token that Firebase cannot verify', async () => {
        verifyFirebaseIdToken.mockRejectedValue(new Error('invalid token'))
        const importRaflDataHandler = vi.fn()
        const response = await request(createApp(importRaflDataHandler))
            .get('/refresh-preview')
            .set('Authorization', 'Bearer invalid-token')

        expect(response.status).toBe(401)
        expect(response.body).toEqual({code: 'invalid_token'})
        expect(importRaflDataHandler).not.toHaveBeenCalled()
    })

    it.each([
        ['missing', undefined],
        ['false', false],
        ['a string instead of the boolean true', 'true']
    ])('rejects an authenticated token with a %s raflAdmin claim', async (_label, raflAdmin) => {
        verifyFirebaseIdToken.mockResolvedValue({uid: 'user-1', raflAdmin})
        const importRaflDataHandler = vi.fn()
        const response = await request(createApp(importRaflDataHandler))
            .get('/refresh-preview')
            .set('Authorization', 'Bearer signed-token')

        expect(response.status).toBe(403)
        expect(response.body).toEqual({code: 'rafl_admin_required'})
        expect(importRaflDataHandler).not.toHaveBeenCalled()
    })

    it('uses the injected handler when the verified token has raflAdmin: true', async () => {
        verifyFirebaseIdToken.mockResolvedValue({uid: 'user-1', raflAdmin: true})
        const importRaflDataHandler = vi.fn((_req, res) => res.status(204).end())
        const response = await request(createApp(importRaflDataHandler))
            .get('/refresh-preview')
            .set('Authorization', 'Bearer signed-token')

        expect(response.status).toBe(204)
        expect(verifyFirebaseIdToken).toHaveBeenCalledWith('signed-token')
        expect(importRaflDataHandler).toHaveBeenCalledOnce()
    })
})
