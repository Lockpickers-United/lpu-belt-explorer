import express from 'express'
import request from 'supertest'
import {describe, expect, it, vi} from 'vitest'
import {registerRoutes} from '../../routes.js'
import {rateLimitPolicies} from '../../api/middleware/rateLimit.js'

function createApp(getFlickrInfoHandler) {
    const app = express()
    registerRoutes(app, {prefix: '', getFlickrInfoHandler})
    app.use((error, _req, res, _next) => {
        res.status(error.status || 500).json({
            error: {code: error.code, message: error.message}
        })
    })
    return app
}

describe('Flickr-info route injection', () => {
    it('uses the injected handler for GET /flickr-info', async () => {
        const getFlickrInfoHandler = vi.fn((_req, res) => {
            return res.status(200).json({title: 'Injected album', photoCount: 0, photos: []})
        })

        const response = await request(createApp(getFlickrInfoHandler))
            .get('/flickr-info?id=72177720322353676')

        expect(response.status).toBe(200)
        expect(response.headers['x-ratelimit-limit']).toBe(String(rateLimitPolicies.flickrInfo.max))
        expect(response.body.title).toBe('Injected album')
        expect(getFlickrInfoHandler).toHaveBeenCalledOnce()
    })

    it('passes handler failures to centralized error handling', async () => {
        const getFlickrInfoHandler = vi.fn((_req, _res, next) => {
            const error = new Error('Invalid photoset')
            error.status = 400
            error.code = 'flickr_photoset_id_invalid'
            return next(error)
        })

        const response = await request(createApp(getFlickrInfoHandler))
            .get('/flickr-info?id=invalid')

        expect(response.status).toBe(400)
        expect(response.body).toEqual({
            error: {code: 'flickr_photoset_id_invalid', message: 'Invalid photoset'}
        })
    })
})
