import express from 'express'
import request from 'supertest'
import {describe, expect, it, vi} from 'vitest'
import {registerRoutes} from '../../routes.js'
import {rateLimitPolicies} from '../../api/middleware/rateLimit.js'

function createApp(firebaseActivityHandler) {
    const app = express()
    app.use(express.json())
    registerRoutes(app, {prefix: '', firebaseActivityHandler})
    app.use((error, _req, res, _next) => {
        res.status(error.status || 500).json({
            error: {code: error.code, message: error.message}
        })
    })
    return app
}

describe('Firebase-activity route injection', () => {
    it('uses the injected handler for POST /log-activity', async () => {
        const firebaseActivityHandler = vi.fn((_req, res) => {
            return res.status(200).json('Activity Logged')
        })

        const response = await request(createApp(firebaseActivityHandler))
            .post('/log-activity')
            .send({activityData: {type: 'READ', count: 1, source: 'test'}})

        expect(response.status).toBe(200)
        expect(response.headers['x-ratelimit-limit']).toBe(String(rateLimitPolicies.firebaseActivity.max))
        expect(response.body).toBe('Activity Logged')
        expect(firebaseActivityHandler).toHaveBeenCalledOnce()
    })

    it('passes handler failures to centralized error handling', async () => {
        const firebaseActivityHandler = vi.fn((_req, _res, next) => {
            const error = new Error('Invalid activity')
            error.status = 400
            error.code = 'firebase_activity_invalid'
            return next(error)
        })

        const response = await request(createApp(firebaseActivityHandler))
            .post('/log-activity')
            .send({activityData: {}})

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: {code: 'firebase_activity_invalid', message: 'Invalid activity'}
        })
    })
})
