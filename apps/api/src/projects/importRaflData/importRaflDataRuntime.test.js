import {describe, expect, it} from 'vitest'
import {createImportRaflDataRuntime} from './importRaflDataRuntime.js'

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

describe('createImportRaflDataRuntime', () => {
    it('returns a disabled handler without requiring integration configuration', async () => {
        const runtime = await createImportRaflDataRuntime({env: {NODE_ENV: 'test'}})
        const res = createResponse()

        await runtime.handler({}, res)

        expect(runtime.config.enabled).toBe(false)
        expect(res.statusCode).toBe(503)
        expect(res.body.errors[0].code).toBe('rafl_preview_disabled')
    })
})
