import express from 'express'
import request from 'supertest'
import {describe, expect, it, vi} from 'vitest'
import {
    createBaselineRateLimit,
    createRateLimit,
    rateLimitPolicies,
    skipBaselineRateLimit,
    userProfileRateLimitConfig
} from '../middleware/rateLimit.js'

function createRateLimitTestApp({
    max = 2,
    windowMs = 60_000,
    penaltyMs = 10_000,
    maxPenaltyMs = 60_000,
    maxRetryAfterMs = 10 * 60_000,
    rateLimitLogger = {warn: () => {}},
    now = () => Date.now()
} = {}) {
    const app = express()
    app.set('trust proxy', true)
    app.use(createRateLimit({
        max,
        windowMs,
        penaltyMs,
        maxPenaltyMs,
        maxRetryAfterMs,
        rateLimitLogger,
        name: 'test-rate-limit',
        now
    }))
    app.get('/limited', (_req, res) => {
        res.json({ok: true})
    })
    app.use((err, _req, res, _next) => {
        res.status(err.status || 500).json({
            error: {
                message: err.message,
                code: err.code,
                details: err.details
            }
        })
    })
    return app
}

function createUserProfileRateLimitTestApp() {
    const app = express()
    app.set('trust proxy', true)
    app.use(createRateLimit({
        ...userProfileRateLimitConfig,
        name: 'test-user-profile-rate-limit'
    }))
    app.get('/limited', (_req, res) => {
        res.json({ok: true})
    })
    app.use((err, _req, res, _next) => {
        res.status(err.status || 500).json({
            error: {
                message: err.message,
                code: err.code,
                details: err.details
            }
        })
    })
    return app
}

describe('createRateLimit', () => {
    it('allows requests up to the configured limit, then returns 429', async () => {
        const app = createRateLimitTestApp({max: 2})

        const first = await request(app).get('/limited')
        const second = await request(app).get('/limited')
        const third = await request(app).get('/limited')

        expect(first.status).toBe(200)
        expect(first.headers['x-ratelimit-limit']).toBe('2')
        expect(first.headers['x-ratelimit-remaining']).toBe('1')

        expect(second.status).toBe(200)
        expect(second.headers['x-ratelimit-remaining']).toBe('0')

        expect(third.status).toBe(429)
        expect(third.headers['retry-after']).toBeTruthy()
        expect(third.headers['x-ratelimit-limit']).toBe('2')
        expect(third.headers['x-ratelimit-remaining']).toBe('0')
        expect(third.body.error.code).toBe('rate_limited')
        expect(third.body.error.details.limit).toBe(2)
        expect(third.body.error.details.penaltyCount).toBe(1)
    })

    it('extends the cooldown when additional requests arrive while rate limited', async () => {
        let currentTime = 1_000
        const app = createRateLimitTestApp({
            max: 1,
            windowMs: 60_000,
            penaltyMs: 10_000,
            maxPenaltyMs: 60_000,
            now: () => currentTime
        })

        const first = await request(app).get('/limited')
        const second = await request(app).get('/limited')
        currentTime = 11_000
        const third = await request(app).get('/limited')

        expect(first.status).toBe(200)

        expect(second.status).toBe(429)
        expect(second.headers['retry-after']).toBe('70')
        expect(second.body.error.details.penaltyCount).toBe(1)

        expect(third.status).toBe(429)
        expect(third.headers['retry-after']).toBe('80')
        expect(third.body.error.details.penaltyCount).toBe(2)
    })

    it('caps the cooldown extension', async () => {
        let currentTime = 1_000
        const app = createRateLimitTestApp({
            max: 1,
            windowMs: 60_000,
            penaltyMs: 60_000,
            maxPenaltyMs: 60_000,
            maxRetryAfterMs: 120_000,
            now: () => currentTime
        })

        await request(app).get('/limited')
        const second = await request(app).get('/limited')
        const third = await request(app).get('/limited')

        expect(second.status).toBe(429)
        expect(second.headers['retry-after']).toBe('120')
        expect(third.status).toBe(429)
        expect(third.headers['retry-after']).toBe('120')
    })

    it('logs a warning once when the max retry delay is reached', async () => {
        let currentTime = 1_000
        const rateLimitLogger = {
            warn: vi.fn()
        }
        const app = createRateLimitTestApp({
            max: 1,
            windowMs: 60_000,
            penaltyMs: 60_000,
            maxPenaltyMs: 60_000,
            maxRetryAfterMs: 120_000,
            rateLimitLogger,
            now: () => currentTime
        })

        await request(app)
            .get('/limited')
            .set('X-Forwarded-For', '203.0.113.70')
        const second = await request(app)
            .get('/limited')
            .set('X-Forwarded-For', '203.0.113.70')
        const third = await request(app)
            .get('/limited')
            .set('X-Forwarded-For', '203.0.113.70')

        expect(second.status).toBe(429)
        expect(third.status).toBe(429)
        expect(rateLimitLogger.warn).toHaveBeenCalledOnce()
        expect(rateLimitLogger.warn).toHaveBeenCalledWith({
            limiter: 'test-rate-limit',
            clientKey: '203.0.113.70',
            limit: 1,
            windowMs: 60_000,
            penaltyMs: 60_000,
            maxPenaltyMs: 60_000,
            maxRetryAfterMs: 120_000,
            penaltyCount: 1,
            retryAfterSeconds: 120
        }, 'rate limit max delay reached')
    })

    it('tracks separate client IPs independently', async () => {
        const app = createRateLimitTestApp({max: 1})

        const firstIpFirstRequest = await request(app)
            .get('/limited')
            .set('X-Forwarded-For', '203.0.113.10')
        const firstIpSecondRequest = await request(app)
            .get('/limited')
            .set('X-Forwarded-For', '203.0.113.10')
        const secondIpFirstRequest = await request(app)
            .get('/limited')
            .set('X-Forwarded-For', '203.0.113.20')

        expect(firstIpFirstRequest.status).toBe(200)
        expect(firstIpSecondRequest.status).toBe(429)
        expect(secondIpFirstRequest.status).toBe(200)
    })

    it('resets counts after the configured window', async () => {
        let currentTime = 1_000
        const app = createRateLimitTestApp({
            max: 1,
            windowMs: 1_000,
            penaltyMs: 100,
            now: () => currentTime
        })

        const first = await request(app).get('/limited')
        const second = await request(app).get('/limited')
        currentTime = 2_101
        const third = await request(app).get('/limited')

        expect(first.status).toBe(200)
        expect(second.status).toBe(429)
        expect(third.status).toBe(200)
    })

    it('uses stricter backoff settings for user profile routes', async () => {
        const app = createUserProfileRateLimitTestApp()

        for (let i = 0; i < 60; i += 1) {
            const allowed = await request(app)
                .get('/limited')
                .set('X-Forwarded-For', '203.0.113.50')
            expect(allowed.status).toBe(200)
        }

        const blocked = await request(app)
            .get('/limited')
            .set('X-Forwarded-For', '203.0.113.50')

        expect(blocked.status).toBe(429)
        expect(blocked.body.error.details.penaltyMs).toBe(30_000)
        expect(blocked.body.error.details.maxPenaltyMs).toBe(120_000)
        expect(blocked.body.error.details.maxRetryAfterMs).toBe(20 * 60_000)
    })

    it('keeps source-controlled route policies separate', () => {
        const policies = Object.values(rateLimitPolicies)
        const names = policies.map(policy => policy.name)

        expect(new Set(names).size).toBe(policies.length)
        expect(rateLimitPolicies.baseline.max).toBe(300)
        expect(rateLimitPolicies.uploadContent.max).toBeLessThan(rateLimitPolicies.userProfiles.max)
        expect(rateLimitPolicies.importRaflData.max).toBeLessThan(rateLimitPolicies.flickrInfo.max)
    })

    it('skips preflight requests and operational probes at the baseline layer', () => {
        expect(skipBaselineRateLimit({method: 'OPTIONS', path: '/anything'})).toBe(true)
        expect(skipBaselineRateLimit({method: 'GET', path: '/health'})).toBe(true)
        expect(skipBaselineRateLimit({method: 'HEAD', path: '/services/ready'})).toBe(true)
        expect(skipBaselineRateLimit({method: 'POST', path: '/health'})).toBe(false)
        expect(skipBaselineRateLimit({method: 'GET', path: '/api/v1/users/example'})).toBe(false)
    })

    it('does not count skipped probes against the baseline limit', async () => {
        const app = express()
        app.use(createBaselineRateLimit({
            max: 1,
            name: 'test-baseline',
            rateLimitLogger: {warn: () => {}}
        }))
        app.get('/health', (_req, res) => res.json({ok: true}))
        app.get('/work', (_req, res) => res.json({ok: true}))
        app.use((err, _req, res, _next) => {
            res.status(err.status || 500).json({code: err.code})
        })

        await request(app).get('/health').expect(200)
        await request(app).get('/health').expect(200)
        await request(app).get('/work').expect(200)
        await request(app).get('/work').expect(429)
    })
})
