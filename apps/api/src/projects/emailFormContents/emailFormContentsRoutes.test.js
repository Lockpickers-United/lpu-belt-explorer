import express from 'express'
import request from 'supertest'
import {describe, expect, it, vi} from 'vitest'
import {registerRoutes} from '../../routes.js'
import {rateLimitPolicies} from '../../api/middleware/rateLimit.js'

describe('email-form route injection', () => {
    it('uses the injected handler for POST /email-form', async () => {
        const emailFormHandler = vi.fn((_req, res) => res.status(204).end())
        const app = express()
        registerRoutes(app, {prefix: '', emailFormHandler})

        const response = await request(app).post('/email-form')

        expect(response.status).toBe(204)
        expect(response.headers['x-ratelimit-limit']).toBe(String(rateLimitPolicies.emailForm.max))
        expect(emailFormHandler).toHaveBeenCalledOnce()
    })
})
