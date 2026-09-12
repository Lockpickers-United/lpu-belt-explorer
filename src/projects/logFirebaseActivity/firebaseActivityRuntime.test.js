import {describe, expect, it} from 'vitest'
import {createFirebaseActivityRuntime} from './firebaseActivityRuntime.js'

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

describe('createFirebaseActivityRuntime', () => {
    it('returns a disabled handler without requiring runtime configuration', async () => {
        const runtime = await createFirebaseActivityRuntime({env: {NODE_ENV: 'test'}})
        const res = createResponse()

        await runtime.handler({}, res)

        expect(runtime.config.enabled).toBe(false)
        expect(res.statusCode).toBe(503)
        expect(res.body.error.code).toBe('firebase_activity_disabled')
    })
})
