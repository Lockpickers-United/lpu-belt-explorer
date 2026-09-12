import express from 'express'
import request from 'supertest'
import {describe, expect, it, vi} from 'vitest'
import {registerRoutes} from '../../routes.js'
import {rateLimitPolicies} from '../../api/middleware/rateLimit.js'

describe('upload-content route injection', () => {
    it('uses the injected handler for POST /upload', async () => {
        const uploadContentHandler = vi.fn((_req, res) => res.status(204).end())
        const app = express()
        registerRoutes(app, {prefix: '', uploadContentHandler})

        const response = await request(app).post('/upload')

        expect(response.status).toBe(204)
        expect(response.headers['x-ratelimit-limit']).toBe(String(rateLimitPolicies.uploadContent.max))
        expect(uploadContentHandler).toHaveBeenCalledOnce()
    })
})
