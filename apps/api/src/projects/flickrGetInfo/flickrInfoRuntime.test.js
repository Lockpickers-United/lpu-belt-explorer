import {describe, expect, it} from 'vitest'
import {createFlickrInfoRuntime} from './flickrInfoRuntime.js'

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

describe('createFlickrInfoRuntime', () => {
    it('returns a disabled handler without requiring an API key', async () => {
        const runtime = await createFlickrInfoRuntime({env: {NODE_ENV: 'test'}})
        const res = createResponse()

        await runtime.handler({}, res)

        expect(runtime.config.enabled).toBe(false)
        expect(res.statusCode).toBe(503)
        expect(res.body.error.code).toBe('flickr_info_disabled')
    })
})
