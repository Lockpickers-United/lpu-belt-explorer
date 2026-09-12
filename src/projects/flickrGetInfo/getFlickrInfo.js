import {createFlickr, FetchTransport} from 'flickr-sdk'
import {logger} from '../../logger/logger.js'

const log = logger.child({module: 'flickr-info'})
const photosetIdPattern = /^\d{1,30}$/

function flickrInfoError(code, message, status = 500, cause) {
    const error = new Error(message)
    error.code = code
    error.status = status
    if (cause) error.cause = cause
    return error
}

export function validatePhotosetId(value) {
    const photosetId = typeof value === 'string' ? value.trim() : ''
    if (!photosetId) {
        throw flickrInfoError('flickr_photoset_id_required', 'No photoset ID specified', 400)
    }
    if (!photosetIdPattern.test(photosetId)) {
        throw flickrInfoError('flickr_photoset_id_invalid', 'Flickr photoset ID must contain only digits', 400)
    }
    return photosetId
}

export function createFlickrClient({apiKey, timeoutMs}) {
    const transport = new FetchTransport({signal: AbortSignal.timeout(timeoutMs)})
    return createFlickr(apiKey, transport).flickr
}

function requiredContent(value, description) {
    if (typeof value !== 'string') {
        throw flickrInfoError('flickr_response_invalid', `Flickr response is missing ${description}`, 502)
    }
    return value
}

async function getPhotoMedia({flickr, photo, photosetId, sequence}) {
    const [infoResponse, sizesResponse] = await Promise.all([
        flickr('flickr.photos.getInfo', {photo_id: photo.id}),
        flickr('flickr.photos.getSizes', {photo_id: photo.id})
    ])
    const photoInfo = infoResponse?.photo
    const sizes = sizesResponse?.sizes?.size
    if (!photoInfo || !Array.isArray(sizes)) {
        throw flickrInfoError('flickr_response_invalid', `Flickr returned invalid data for photo ${photo.id}`, 502)
    }

    const photoPage = requiredContent(photoInfo.urls?.url?.[0]?._content, 'the photo page URL')
    const thumbnail = sizes.find(size => size.label === 'Small 400')
    const original = sizes.find(size => size.label === 'Original')

    return {
        seq: sequence,
        title: requiredContent(photoInfo.title?._content, 'the photo title'),
        credit: requiredContent(photoInfo.description?._content, 'the photo description'),
        fullURL: `${photoPage}in/album-${photosetId}/`,
        thumbnailURL: requiredContent(thumbnail?.source, 'the Small 400 image'),
        originalURL: requiredContent(original?.source, 'the original image')
    }
}

async function mapWithConcurrency(items, concurrency, mapper) {
    const results = new Array(items.length)
    let nextIndex = 0

    async function worker() {
        while (nextIndex < items.length) {
            const index = nextIndex
            nextIndex += 1
            results[index] = await mapper(items[index], index)
        }
    }

    const workerCount = Math.min(concurrency, items.length)
    await Promise.all(Array.from({length: workerCount}, () => worker()))
    return results
}

export async function fetchFlickrInfo({
    photosetId,
    flickr,
    maxPhotos = 500,
    concurrency = 5
}) {
    const validPhotosetId = validatePhotosetId(photosetId)

    try {
        const [infoResponse, photosResponse] = await Promise.all([
            flickr('flickr.photosets.getInfo', {photoset_id: validPhotosetId}),
            flickr('flickr.photosets.getPhotos', {photoset_id: validPhotosetId})
        ])
        const photosetInfo = infoResponse?.photoset
        const photoList = photosResponse?.photoset?.photo
        if (!photosetInfo || !Array.isArray(photoList)) {
            throw flickrInfoError('flickr_response_invalid', 'Flickr returned invalid photoset data', 502)
        }
        if (photoList.length > maxPhotos) {
            throw flickrInfoError(
                'flickr_photoset_too_large',
                `Flickr photoset exceeds the configured limit of ${maxPhotos} photos`,
                422
            )
        }

        const photos = await mapWithConcurrency(photoList, concurrency, (photo, index) => {
            if (!photo?.id) {
                throw flickrInfoError('flickr_response_invalid', 'Flickr response contains a photo without an ID', 502)
            }
            return getPhotoMedia({
                flickr,
                photo,
                photosetId: validPhotosetId,
                sequence: index + 1
            })
        })

        return {
            title: requiredContent(photosetInfo.title?._content, 'the photoset title'),
            photoCount: photosetInfo.count_photos,
            photos
        }
    } catch (cause) {
        if (cause?.code && cause?.status) throw cause
        throw flickrInfoError('flickr_request_failed', 'Unable to fetch Flickr photoset data', 502, cause)
    }
}

export function createGetFlickrInfoHandler({
    apiKey,
    timeoutMs,
    maxPhotos,
    concurrency,
    createClient = createFlickrClient,
    fetchInfo = fetchFlickrInfo
}) {
    return async function getFlickrInfo(req, res, next) {
        try {
            const photosetId = validatePhotosetId(req.query.id)
            const flickr = createClient({apiKey, timeoutMs})
            const result = await fetchInfo({photosetId, flickr, maxPhotos, concurrency})
            log.info({requestId: req.id, photosetId, photoCount: result.photos.length}, 'Flickr info fetched')
            return res.status(200).json(result)
        } catch (error) {
            log.error({err: error, requestId: req.id}, 'Flickr info request failed')
            return next(error)
        }
    }
}

export default async function getFlickrInfo(req, res, next) {
    const {getDefaultFlickrInfoHandler} = await import('./flickrInfoRuntime.js')
    return (await getDefaultFlickrInfoHandler())(req, res, next)
}
