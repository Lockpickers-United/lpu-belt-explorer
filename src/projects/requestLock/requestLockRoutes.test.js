import express from 'express'
import request from 'supertest'
import {describe, expect, it, vi} from 'vitest'
import {registerRoutes} from '../../routes.js'

describe('request-lock route injection', () => {
    it.each([
        ['/request-lock', 'requestLock'],
        ['/update-request', 'updateRequest'],
        ['/request-vote', 'updateVotes']
    ])('uses the injected handler for POST %s', async (route, handlerName) => {
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
        expect(handlers[handlerName]).toHaveBeenCalledOnce()
    })
})
