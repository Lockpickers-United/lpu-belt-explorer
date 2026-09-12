import {Router} from 'express'
import {createRateLimit, rateLimitPolicies} from '../../api/middleware/rateLimit.js'

export function createGetFlickrInfoRouter(getFlickrInfoHandler) {
    const router = Router()
    const flickrInfoRateLimit = createRateLimit(rateLimitPolicies.flickrInfo)

    router.get('/', flickrInfoRateLimit, async (req, res, next) => {
        try {
            const handler = getFlickrInfoHandler
                ?? (await import('./getFlickrInfo.js')).default
            await handler(req, res, next)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createGetFlickrInfoRouter()
