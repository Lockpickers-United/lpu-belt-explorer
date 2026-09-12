import {describe, expect, it} from 'vitest'
import {createRedditBeltsRuntime} from './redditBeltsRuntime.js'

function createResponse() {
    return {
        statusCode: null,
        body: null,
        status(statusCode) {
            this.statusCode = statusCode
            return this
        },
        json(body) {
            this.body = body
            return this
        }
    }
}

describe('createRedditBeltsRuntime', () => {
    it('returns a disabled handler without requiring integration configuration', async () => {
        const runtime = await createRedditBeltsRuntime({env: {NODE_ENV: 'test'}})
        const res = createResponse()

        await runtime.handler({}, res)

        expect(runtime.config.enabled).toBe(false)
        expect(res.statusCode).toBe(503)
        expect(res.body.code).toBe('reddit_belts_disabled')
    })
})
