import {describe, expect, it} from 'vitest'

import {getHttpLogLevel} from './httpLogger.js'

const createReq = (method = 'GET') => ({method})
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
})
