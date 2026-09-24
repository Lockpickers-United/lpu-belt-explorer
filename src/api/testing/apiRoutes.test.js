import fs from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import express from 'express'
import request from 'supertest'
import {afterAll, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest'
import {registerRoutes} from '../../routes.js'
import normalizeRequestUrl from '../../util/normalizeRequestUrl.js'
import {rateLimitPolicies} from '../middleware/rateLimit.js'

const mocks = vi.hoisted(() => ({
    getUserProfileResponse: vi.fn(),
    verifyFirebaseIdToken: vi.fn()
}))

vi.mock('../services/firebaseAdmin.js', () => ({
    verifyFirebaseIdToken: mocks.verifyFirebaseIdToken
}))

vi.mock('../services/userProfileService.js', () => ({
    getUserProfileResponse: mocks.getUserProfileResponse
}))

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
const collectionStatsFixtureDir = fileURLToPath(new URL('../../data/', import.meta.url))
const collectionStatsFixturePath = fileURLToPath(
    new URL('../../data/collectionStatsByIdFull.json', import.meta.url)
)

beforeAll(async () => {
    vi.stubEnv('COLLECTION_API_DIR', collectionStatsFixtureDir)
    app = createApiTestApp()
    collectionStats = JSON.parse(await fs.readFile(collectionStatsFixturePath, 'utf8'))
})

afterAll(() => {
    vi.unstubAllEnvs()
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
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.getUserProfileResponse.mockImplementation(async userId => ({
            metadata: {source: 'firebase'},
            data: {userId, profile: {displayName: 'Test User'}}
        }))
    })

    it('GET /api/v1/users/:id/profile requires auth', async () => {
        const res = await request(app).get('/api/v1/users/example-user/profile')

        expect(res.status).toBe(401)
        expect(res.headers['x-ratelimit-limit']).toBe(String(rateLimitPolicies.userProfiles.max))
        expect(res.body.error.code).toBe('unauthorized')
    })

    it('rejects a bearer token that Firebase cannot verify', async () => {
        mocks.verifyFirebaseIdToken.mockRejectedValue(new Error('invalid token'))

        const res = await request(app)
            .get('/api/v1/users/example-user/profile')
            .set('Authorization', 'Bearer invalid-token')

        expect(res.status).toBe(401)
        expect(res.body.error.code).toBe('invalid_token')
        expect(mocks.getUserProfileResponse).not.toHaveBeenCalled()
    })

    it.each([
        {claims: {uid: 'another-user'}, label: 'non-owner'},
        {claims: {uid: 'another-user', admin: false}, label: 'false admin claim'},
        {claims: {uid: 'another-user', admin: 'true'}, label: 'non-boolean admin claim'}
    ])('denies profile access for a $label', async ({claims}) => {
        mocks.verifyFirebaseIdToken.mockResolvedValue(claims)

        const res = await request(app)
            .get('/api/v1/users/example-user/profile')
            .set('Authorization', 'Bearer signed-token')

        expect(res.status).toBe(403)
        expect(res.body.error.code).toBe('forbidden')
        expect(mocks.getUserProfileResponse).not.toHaveBeenCalled()
    })

    it.each([
        {claims: {uid: 'example-user'}, label: 'profile owner'},
        {claims: {uid: 'another-user', admin: true}, label: 'verified admin'}
    ])('allows the $label to read the full profile', async ({claims}) => {
        mocks.verifyFirebaseIdToken.mockResolvedValue(claims)

        const res = await request(app)
            .get('/api/v1/users/example-user/profile')
            .set('Authorization', 'Bearer signed-token')

        expect(res.status).toBe(200)
        expect(res.headers['cache-control']).toBe('private, no-store')
        expect(res.body.data.userId).toBe('example-user')
        expect(mocks.getUserProfileResponse).toHaveBeenCalledWith('example-user')
    })
})
