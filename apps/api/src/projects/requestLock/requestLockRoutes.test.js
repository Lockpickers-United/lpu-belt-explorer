import express from 'express'
import request from 'supertest'
import {describe, expect, it, vi} from 'vitest'
import {registerRoutes} from '../../routes.js'
import {rateLimitPolicies} from '../../api/middleware/rateLimit.js'

describe('request-lock route injection', () => {
    it.each([
        ['/request-lock', 'requestLock', rateLimitPolicies.requestLock],
        ['/update-request', 'updateRequest', rateLimitPolicies.updateRequest],
        ['/request-vote', 'updateVotes', rateLimitPolicies.requestVote]
    ])('uses the injected handler for POST %s', async (route, handlerName, policy) => {
        const handlers = {
            requestLock: vi.fn((_req, res) => res.status(204).end()),
            updateRequest: vi.fn((_req, res) => res.status(204).end()),
            updateVotes: vi.fn((_req, res) => res.status(204).end())
        }
        const app = express()
        app.use(express.json())
        registerRoutes(app, {prefix: '', requestLockHandlers: handlers})

        const response = await request(app).post(route).send({prod: true})

        expect(response.status).toBe(204)
        expect(response.headers['x-ratelimit-limit']).toBe(String(policy.max))
        expect(handlers[handlerName]).toHaveBeenCalledOnce()
    })
})
