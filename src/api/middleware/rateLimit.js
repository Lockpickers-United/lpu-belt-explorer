const defaultWindowMs = 60_000
const defaultMax = 60
const defaultMaxKeys = 10_000
const defaultPenaltyMs = 10_000
const defaultMaxPenaltyMs = 60_000
const defaultMaxRetryAfterMs = 10 * 60_000

function getClientIp(req) {
    if (req.ip) return req.ip

    const realIp = req.headers['x-real-ip']
    if (typeof realIp === 'string' && realIp.trim()) {
        return realIp.trim()
    }

    const forwardedFor = req.headers['x-forwarded-for']
    if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
        return forwardedFor.split(',')[0].trim()
    }

    return req.socket?.remoteAddress || 'unknown'
}

function setRateLimitHeaders(res, {limit, remaining, resetAt}) {
    const resetSeconds = Math.ceil(resetAt / 1000)
    res.set('X-RateLimit-Limit', String(limit))
    res.set('X-RateLimit-Remaining', String(Math.max(remaining, 0)))
    res.set('X-RateLimit-Reset', String(resetSeconds))
}

function pruneExpiredEntries(hits, now) {
    for (const [key, value] of hits.entries()) {
        if (value.resetAt <= now) {
            hits.delete(key)
        }
    }
}

function pruneOldestEntries(hits, maxKeys) {
    while (hits.size > maxKeys) {
        const oldestKey = hits.keys().next().value
        hits.delete(oldestKey)
    }
}

export function createRateLimit({
    windowMs = defaultWindowMs,
    max = defaultMax,
    penaltyMs = defaultPenaltyMs,
    maxPenaltyMs = defaultMaxPenaltyMs,
    maxRetryAfterMs = defaultMaxRetryAfterMs,
    maxKeys = defaultMaxKeys,
    name = 'rate-limit',
    keyGenerator = getClientIp,
    now = () => Date.now()
} = {}) {
    const hits = new Map()
    let nextCleanupAt = 0

    return function rateLimit(req, res, next) {
        const currentTime = now()

        if (currentTime >= nextCleanupAt) {
            pruneExpiredEntries(hits, currentTime)
            pruneOldestEntries(hits, maxKeys)
            nextCleanupAt = currentTime + windowMs
        }

        const key = `${name}:${keyGenerator(req)}`
        const existing = hits.get(key)
        const entry = existing && existing.resetAt > currentTime
            ? existing
            : {count: 0, resetAt: currentTime + windowMs, penaltyCount: 0}

        if (entry.count >= max) {
            entry.penaltyCount += 1

            const currentRetryAfterMs = Math.max(entry.resetAt - currentTime, 0)
            const nextPenaltyMs = Math.min(
                penaltyMs * (2 ** (entry.penaltyCount - 1)),
                maxPenaltyMs
            )
            const retryAfterMs = Math.min(
                currentRetryAfterMs + nextPenaltyMs,
                maxRetryAfterMs
            )

            entry.resetAt = currentTime + retryAfterMs
            hits.set(key, entry)

            const retryAfterSeconds = Math.max(Math.ceil(retryAfterMs / 1000), 1)
            res.set('Retry-After', String(retryAfterSeconds))
            setRateLimitHeaders(res, {
                limit: max,
                remaining: 0,
                resetAt: entry.resetAt
            })

            const err = new Error('Too many requests')
            err.status = 429
            err.code = 'rate_limited'
            err.details = {
                limit: max,
                windowMs,
                penaltyMs,
                maxPenaltyMs,
                maxRetryAfterMs,
                penaltyCount: entry.penaltyCount,
                retryAfterSeconds
            }
            return next(err)
        }

        entry.count += 1
        hits.set(key, entry)

        setRateLimitHeaders(res, {
            limit: max,
            remaining: max - entry.count,
            resetAt: entry.resetAt
        })

        return next()
    }
}

export const userProfileRateLimitConfig = {
    windowMs: 60_000,
    max: 60,
    penaltyMs: 30_000,
    maxPenaltyMs: 120_000,
    maxRetryAfterMs: 20 * 60_000,
    name: 'api-users'
}

export const userProfileRateLimit = createRateLimit(userProfileRateLimitConfig)
