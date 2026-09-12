import {createGetFlickrInfoHandler} from './getFlickrInfo.js'
import {loadFlickrInfoConfig} from './flickrInfoConfig.js'

let defaultRuntimePromise

function createDisabledHandler() {
    return async function flickrInfoDisabled(_req, res) {
        return res.status(503).json({
            error: {
                code: 'flickr_info_disabled',
                message: 'Flickr-info access is not enabled'
            }
        })
    }
}

export async function createFlickrInfoRuntime({env = process.env} = {}) {
    const config = loadFlickrInfoConfig({env})
    if (!config.enabled) {
        return Object.freeze({config, handler: createDisabledHandler()})
    }

    const handler = createGetFlickrInfoHandler({
        apiKey: config.apiKey,
        timeoutMs: config.timeoutMs,
        maxPhotos: config.maxPhotos,
        concurrency: config.concurrency
    })
    return Object.freeze({config, handler})
}

export async function getDefaultFlickrInfoHandler() {
    if (!defaultRuntimePromise) defaultRuntimePromise = createFlickrInfoRuntime()
    return (await defaultRuntimePromise).handler
}
