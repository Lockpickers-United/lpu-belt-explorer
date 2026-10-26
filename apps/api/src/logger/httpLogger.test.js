import {describe, expect, it} from 'vitest'
import pinoHttp from 'pino-http'

import {
    addResponseRate,
    getHttpLogLevel,
    getHttpResponseTimeMs,
    getRequestPathname,
    isApplicationRoutePath,
    shouldAutoLogRequest
} from './httpLogger.js'

const createReq = (method = 'GET', url = '/ready') => ({method, url})
const createRes = (statusCode = 200, extra = {}) => ({statusCode, ...extra})

describe('http logger log level selection', () => {
    it('silences successful OPTIONS requests in production', () => {
        const level = getHttpLogLevel(
            createReq('OPTIONS'),
            createRes(204),
            undefined,
            {production: true}
        )

        expect(level).toBe('silent')
    })

    it('logs successful OPTIONS requests outside production', () => {
        const level = getHttpLogLevel(
            createReq('OPTIONS'),
            createRes(204),
            undefined,
            {production: false}
        )

        expect(level).toBe('info')
    })

    it('still logs failed OPTIONS requests in production', () => {
        const level = getHttpLogLevel(
            createReq('OPTIONS'),
            createRes(403),
            undefined,
            {production: true}
        )

        expect(level).toBe('warn')
    })

    it('still logs errored OPTIONS requests in production', () => {
        const level = getHttpLogLevel(
            createReq('OPTIONS'),
            createRes(500),
            new Error('preflight failed'),
            {production: true}
        )

        expect(level).toBe('error')
    })

    it('silences normal successful requests in production', () => {
        const level = getHttpLogLevel(
            createReq('POST'),
            createRes(200),
            undefined,
            {production: true, responseTimeMs: 100}
        )

        expect(level).toBe('silent')
    })

    it('logs slow successful requests in production', () => {
        const level = getHttpLogLevel(
            createReq('POST'),
            createRes(200),
            undefined,
            {
                production: true,
                responseTimeMs: 1_200,
                slowRequestThresholdMs: 1_000
            }
        )

        expect(level).toBe('warn')
    })

    it('adds a top-level response rate to slow response log data', () => {
        const logData = addResponseRate(createRes(200), {
            res: createRes(200),
            responseTime: 1_200
        }, {production: true})

        expect(logData).toEqual({
            res: {statusCode: 200},
            responseTime: 1_200,
            responseRate: 'slow'
        })
    })

    it('does not add a response rate to normal response log data', () => {
        const logData = addResponseRate(createRes(200), {
            res: createRes(200),
            responseTime: 100
        }, {production: true})

        expect(logData).toEqual({
            res: {statusCode: 200},
            responseTime: 100
        })
    })

    it('calculates response time from pino-http start time', () => {
        const res = createRes(200)
        const startTime = 10_000
        const endTime = 11_250

        res[pinoHttp.startTime] = startTime

        expect(getHttpResponseTimeMs(res, () => endTime)).toBe(1_250)
    })

    it('normalizes request pathnames before route matching', () => {
        expect(getRequestPathname(createReq('GET', '//api/v1/users/123?cache=1'))).toBe('/api/v1/users/123')
    })

    it('matches known application route prefixes', () => {
        expect(isApplicationRoutePath('/api/v1/users/123')).toBe(true)
        expect(isApplicationRoutePath('/upload')).toBe(true)
        expect(isApplicationRoutePath('/upload/photo')).toBe(true)
        expect(isApplicationRoutePath('/services/api/v1/users/123')).toBe(true)
        expect(isApplicationRoutePath('/servicesDev/ready')).toBe(true)
    })

    it('does not match unknown scanner/probe paths', () => {
        expect(isApplicationRoutePath('/static../.env')).toBe(false)
        expect(isApplicationRoutePath('/@fs/root/.aws/credentials')).toBe(false)
        expect(isApplicationRoutePath('/read')).toBe(false)
        expect(isApplicationRoutePath('/download')).toBe(false)
    })

    it('auto-logs only application routes in production', () => {
        expect(shouldAutoLogRequest(createReq('GET', '/api/v1/users/123'), {production: true})).toBe(true)
        expect(shouldAutoLogRequest(createReq('GET', '/static../.env'), {production: true})).toBe(false)
    })

    it('auto-logs unknown routes outside production', () => {
        expect(shouldAutoLogRequest(createReq('GET', '/static../.env'), {production: false})).toBe(true)
    })
})
