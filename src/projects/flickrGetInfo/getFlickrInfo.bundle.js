import {Router} from 'express'

export function createGetFlickrInfoRouter(getFlickrInfoHandler) {
    const router = Router()

    router.get('/', async (req, res, next) => {
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
