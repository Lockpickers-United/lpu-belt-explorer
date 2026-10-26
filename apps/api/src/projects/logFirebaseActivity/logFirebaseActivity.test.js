import {describe, expect, it, vi} from 'vitest'
import {
    createFirebaseActivityHandler,
    logFirebaseActivity,
    normalizeFirebaseActivity
} from './logFirebaseActivity.js'

function createResponse() {
    const res = {statusCode: null, body: null}
    res.status = vi.fn(status => {
        res.statusCode = status
        return res
    })
    res.json = vi.fn(body => {
        res.body = body
        return res
    })
    return res
}

describe('normalizeFirebaseActivity', () => {
    it('whitelists fields, removes blank values, and derives the production marker', () => {
        const result = normalizeFirebaseActivity({
            type: 'read',
            count: 3,
            source: 'collection-export',
            id: '',
            displayName: undefined,
            trigger: 'cronjob',
            prod: false,
            authorization: 'must-not-be-logged',
            arbitrary: 'must-not-be-logged'
        }, {productionData: true})

        expect(result).toEqual([{
            type: 'READ',
            count: 3,
            source: 'collection-export',
            trigger: 'cronjob',
            prod: true
        }])
    })

    it('normalizes legacy field names and preserves zero-count refreshes', () => {
        expect(normalizeFirebaseActivity({
            activity: 'REFRESH',
            activityCount: 0,
            source: 'request-subscription'
        }, {productionData: false})).toEqual([{
            type: 'REFRESH',
            count: 0,
            source: 'request-subscription',
            prod: false
        }])
    })

    it('drops zero-count reads and writes', () => {
        expect(normalizeFirebaseActivity([
            {type: 'READ', count: 0, source: 'source-a'},
            {type: 'WRITE', count: 0, source: 'source-b'}
        ], {productionData: false})).toEqual([])
    })

    it('rejects missing, malformed, or oversized activity', () => {
        expect(() => normalizeFirebaseActivity(undefined, {productionData: false}))
            .toThrowError(expect.objectContaining({code: 'firebase_activity_required'}))
        expect(() => normalizeFirebaseActivity({type: 'DELETE', count: 1, source: 'source'}, {
            productionData: false
        })).toThrowError(expect.objectContaining({code: 'firebase_activity_invalid'}))
        expect(() => normalizeFirebaseActivity({type: 'READ', count: -1, source: 'source'}, {
            productionData: false
        })).toThrowError(expect.objectContaining({code: 'firebase_activity_invalid'}))
        expect(() => normalizeFirebaseActivity({type: 'READ', count: '1', source: 'source'}, {
            productionData: false
        })).toThrowError(expect.objectContaining({code: 'firebase_activity_invalid'}))
        expect(() => normalizeFirebaseActivity([
            {type: 'READ', count: 1, source: 'one'},
            {type: 'READ', count: 1, source: 'two'}
        ], {
            productionData: false,
            maxBatchSize: 1
        })).toThrowError(expect.objectContaining({
            code: 'firebase_activity_batch_too_large',
            status: 413
        }))
    })
})

describe('logFirebaseActivity', () => {
    it('writes each entry through the injected structured logger', async () => {
        const activityLogger = {info: vi.fn()}
        const messages = [{type: 'READ', count: 2, source: 'test', prod: false}]

        await logFirebaseActivity(messages, {activityLogger})

        expect(activityLogger.info).toHaveBeenCalledWith(messages[0], 'firebase accessed')
    })
})

describe('createFirebaseActivityHandler', () => {
    it('normalizes and logs accepted activity', async () => {
        const activityLogger = vi.fn()
        const handler = createFirebaseActivityHandler({
            productionData: true,
            maxBatchSize: 5,
            maxStringLength: 100,
            activityLogger
        })
        const res = createResponse()
        const next = vi.fn()

        await handler({
            id: 'request-1',
            body: {activityData: {type: 'READ', count: 2, source: 'test', prod: false}}
        }, res, next)

        expect(activityLogger).toHaveBeenCalledWith([{
            type: 'READ',
            count: 2,
            source: 'test',
            prod: true
        }])
        expect(res.statusCode).toBe(200)
        expect(res.body).toBe('Activity Logged')
        expect(next).not.toHaveBeenCalled()
    })

    it('passes validation failures to centralized error handling', async () => {
        const activityLogger = vi.fn()
        const handler = createFirebaseActivityHandler({productionData: false, activityLogger})
        const next = vi.fn()

        await handler({id: 'request-1', body: {}}, createResponse(), next)

        expect(activityLogger).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            code: 'firebase_activity_required',
            status: 400
        }))
    })
})
