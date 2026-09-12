import fs from 'node:fs/promises'
import express from 'express'
import request from 'supertest'
import {beforeAll, describe, expect, it} from 'vitest'
import {registerRoutes} from '../../routes.js'
import normalizeRequestUrl from '../../util/normalizeRequestUrl.js'
import {rateLimitPolicies} from '../middleware/rateLimit.js'

function createApiTestApp() {
    const app = express()
    app.use(normalizeRequestUrl)
    app.use(express.json({limit: '200kb'}))
    registerRoutes(app, {prefix: ''})
    app.use((err, _req, res, _next) => {
        res.status(err.status || 500).json({
            error: {
                message: err.message,
                code: err.code
            }
        })
    })
    return app
}

let app
let collectionStats

beforeAll(async () => {
    app = createApiTestApp()
    collectionStats = JSON.parse(await fs.readFile('src/data/collectionStatsByIdFull.json', 'utf8'))
})

describe('collection stats API', () => {
    it('GET /api/v1/stats/collections/locks returns the generated lock stats', async () => {
        const res = await request(app).get('/api/v1/stats/collections/locks')

        expect(res.status).toBe(200)
        expect(res.headers['x-ratelimit-limit']).toBe(String(rateLimitPolicies.collectionStats.max))
        expect(res.headers['cache-control']).toBe('public, max-age=300')
        expect(res.body.metadata).toEqual(collectionStats.metadata)
        expect(res.body.data.locks).toHaveLength(collectionStats.data.locks.length)
        expect(res.body.data.locks[0]).toEqual(collectionStats.data.locks[0])
        expect(res.body.data.locks[0]).toHaveProperty('scorecardCount')
        expect(res.body.data.locks[0]).not.toHaveProperty('scorcardCount')
    })

    it('GET //api/v1/stats/collections/locks handles DreamHost double-leading slash proxy paths', async () => {
        const res = await request(app).get('//api/v1/stats/collections/locks')

        expect(res.status).toBe(200)
        expect(res.req.path).toBe('//api/v1/stats/collections/locks')
        expect(res.body.metadata).toEqual(collectionStats.metadata)
        expect(res.body.data.locks).toHaveLength(collectionStats.data.locks.length)
    })

    it('GET /api/v1/stats/collections/locks/own returns only own counts', async () => {
        const res = await request(app).get('/api/v1/stats/collections/locks/own')

        expect(res.status).toBe(200)
        expect(res.body.metadata).toEqual(collectionStats.metadata)
        expect(res.body.data.locks).toHaveLength(collectionStats.data.locks.length)
        expect(res.body.data.locks[0]).toEqual({
            id: collectionStats.data.locks[0].id,
            name: collectionStats.data.locks[0].name,
            ownCount: collectionStats.data.locks[0].ownCount
        })
    })

    it('GET /api/v1/stats/collections/locks/scorecard returns only scorecard counts', async () => {
        const res = await request(app).get('/api/v1/stats/collections/locks/scorecard')

        expect(res.status).toBe(200)
        expect(res.body.metadata).toEqual(collectionStats.metadata)
        expect(res.body.data.locks).toHaveLength(collectionStats.data.locks.length)
        expect(res.body.data.locks[0]).toEqual({
            id: collectionStats.data.locks[0].id,
            name: collectionStats.data.locks[0].name,
            scorecardCount: collectionStats.data.locks[0].scorecardCount
        })
    })
})

describe('user API auth guard', () => {
    it('GET /api/v1/users/:id/profile requires auth', async () => {
        const res = await request(app).get('/api/v1/users/example-user/profile')

        expect(res.status).toBe(401)
        expect(res.headers['x-ratelimit-limit']).toBe(String(rateLimitPolicies.userProfiles.max))
        expect(res.body.error.code).toBe('unauthorized')
    })
})
