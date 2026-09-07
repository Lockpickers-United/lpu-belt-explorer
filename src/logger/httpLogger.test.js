import {describe, expect, it} from 'vitest'

import {
    getHttpLogLevel,
    getRequestPathname,
    isApplicationRoutePath,
    shouldAutoLogRequest
} from './httpLogger.js'

const createReq = (method = 'GET', url = '/ready') => ({method, url})
const createRes = (statusCode = 200) => ({statusCode})

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

    it('logs normal successful requests in production', () => {
        const level = getHttpLogLevel(
            createReq('POST'),
            createRes(200),
            undefined,
            {production: true}
        )

        expect(level).toBe('info')
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
