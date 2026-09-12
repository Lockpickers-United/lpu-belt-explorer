import {describe, expect, it, vi} from 'vitest'
import {
    createGetFlickrInfoHandler,
    fetchFlickrInfo,
    validatePhotosetId
} from './getFlickrInfo.js'

const photosetId = '72177720322353676'

function createFlickrMock(photoIds = ['photo-1', 'photo-2']) {
    return vi.fn(async (method, params) => {
        if (method === 'flickr.photosets.getInfo') {
            return {photoset: {title: {_content: 'Test Album'}, count_photos: photoIds.length}}
        }
        if (method === 'flickr.photosets.getPhotos') {
            return {photoset: {photo: photoIds.map(id => ({id}))}}
        }
        if (method === 'flickr.photos.getInfo') {
            return {
                photo: {
                    title: {_content: `Title ${params.photo_id}`},
                    description: {_content: `Credit ${params.photo_id}`},
                    urls: {url: [{_content: `https://flickr.test/${params.photo_id}/`}]}
                }
            }
        }
        if (method === 'flickr.photos.getSizes') {
            return {
                sizes: {
                    size: [
                        {label: 'Small 400', source: `https://images.test/${params.photo_id}-small.jpg`},
                        {label: 'Original', source: `https://images.test/${params.photo_id}-original.jpg`}
                    ]
                }
            }
        }
        throw new Error(`Unexpected method: ${method}`)
    })
}

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

describe('validatePhotosetId', () => {
    it('accepts numeric IDs and rejects missing or malformed values', () => {
        expect(validatePhotosetId(` ${photosetId} `)).toBe(photosetId)
        expect(() => validatePhotosetId('')).toThrowError(expect.objectContaining({
            code: 'flickr_photoset_id_required',
            status: 400
        }))
        expect(() => validatePhotosetId('123-not-an-id')).toThrowError(expect.objectContaining({
            code: 'flickr_photoset_id_invalid',
            status: 400
        }))
    })
})

describe('fetchFlickrInfo', () => {
    it('fetches and transforms photoset media in source order', async () => {
        const flickr = createFlickrMock()

        const result = await fetchFlickrInfo({photosetId, flickr, concurrency: 2})

        expect(result).toEqual({
            title: 'Test Album',
            photoCount: 2,
            photos: [
                {
                    seq: 1,
                    title: 'Title photo-1',
                    credit: 'Credit photo-1',
                    fullURL: `https://flickr.test/photo-1/in/album-${photosetId}/`,
                    thumbnailURL: 'https://images.test/photo-1-small.jpg',
                    originalURL: 'https://images.test/photo-1-original.jpg'
                },
                {
                    seq: 2,
                    title: 'Title photo-2',
                    credit: 'Credit photo-2',
                    fullURL: `https://flickr.test/photo-2/in/album-${photosetId}/`,
                    thumbnailURL: 'https://images.test/photo-2-small.jpg',
                    originalURL: 'https://images.test/photo-2-original.jpg'
                }
            ]
        })
        expect(flickr).toHaveBeenCalledTimes(6)
    })

    it('rejects oversized photosets before requesting individual photo details', async () => {
        const flickr = createFlickrMock(['photo-1', 'photo-2'])

        await expect(fetchFlickrInfo({photosetId, flickr, maxPhotos: 1}))
            .rejects.toMatchObject({code: 'flickr_photoset_too_large', status: 422})
        expect(flickr).toHaveBeenCalledTimes(2)
    })

    it('turns unexpected Flickr failures into a stable upstream error', async () => {
        const flickr = vi.fn().mockRejectedValue(new Error('API key and request details'))

        await expect(fetchFlickrInfo({photosetId, flickr}))
            .rejects.toMatchObject({
                code: 'flickr_request_failed',
                message: 'Unable to fetch Flickr photoset data',
                status: 502
            })
    })
})

describe('createGetFlickrInfoHandler', () => {
    it('creates a request-scoped client and returns transformed data', async () => {
        const flickr = vi.fn()
        const createClient = vi.fn(() => flickr)
        const fetchInfo = vi.fn().mockResolvedValue({title: 'Album', photoCount: 0, photos: []})
        const handler = createGetFlickrInfoHandler({
            apiKey: 'secret-key',
            timeoutMs: 10_000,
            maxPhotos: 20,
            concurrency: 3,
            createClient,
            fetchInfo
        })
        const res = createResponse()
        const next = vi.fn()

        await handler({id: 'request-1', query: {id: photosetId}}, res, next)

        expect(createClient).toHaveBeenCalledWith({apiKey: 'secret-key', timeoutMs: 10_000})
        expect(fetchInfo).toHaveBeenCalledWith({
            photosetId,
            flickr,
            maxPhotos: 20,
            concurrency: 3
        })
        expect(res.statusCode).toBe(200)
        expect(res.body.title).toBe('Album')
        expect(next).not.toHaveBeenCalled()
    })

    it('rejects invalid input before creating a Flickr client', async () => {
        const createClient = vi.fn()
        const handler = createGetFlickrInfoHandler({createClient})
        const next = vi.fn()

        await handler({id: 'request-1', query: {id: 'invalid'}}, createResponse(), next)

        expect(createClient).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            code: 'flickr_photoset_id_invalid',
            status: 400
        }))
    })
})
