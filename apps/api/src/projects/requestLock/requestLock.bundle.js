import {Router} from 'express'
import {createRateLimit, rateLimitPolicies} from '../../api/middleware/rateLimit.js'

export function createRequestLockRouter(handlers = {}) {
    const router = Router()
    const requestLockRateLimit = createRateLimit(rateLimitPolicies.requestLock)

    router.get('/', (req, res) => {
        req.log.info('requestLock route hit')
        res.json({message: 'requestLock endpoint', requestId: req.id})
    })

    router.post('/', requestLockRateLimit, async (req, res, next) => {
        try {
            const requestLock = handlers.requestLock
                ?? (await import('./requestLock.js')).default
            await requestLock(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createRequestLockRouter()
