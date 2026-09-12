import {describe, expect, it} from 'vitest'
import {createEmailFormRuntime} from './emailFormContentsRuntime.js'

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

describe('createEmailFormRuntime', () => {
    it('returns a disabled handler without loading email configuration', async () => {
        const runtime = await createEmailFormRuntime({env: {NODE_ENV: 'test'}})
        const res = createResponse()

        await runtime.handler({}, res)

        expect(runtime.config.enabled).toBe(false)
        expect(res.statusCode).toBe(503)
        expect(res.body.error.code).toBe('email_form_disabled')
    })
})
