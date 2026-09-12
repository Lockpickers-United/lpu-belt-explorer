import {Router} from 'express'
import {createRateLimit, rateLimitPolicies} from '../../api/middleware/rateLimit.js'

export function createUpdateRequestRouter(handlers = {}) {
    const router = Router()
    const updateRequestRateLimit = createRateLimit(rateLimitPolicies.updateRequest)

    router.get('/', (req, res) => {
        req.log.info('updateRequest route hit')
        res.json({message: 'updateRequest endpoint', requestId: req.id})
    })

    router.post('/', updateRequestRateLimit, async (req, res, next) => {
        try {
            const updateRequest = handlers.updateRequest
                ?? (await import('./requestLock.js')).updateRequest
            await updateRequest(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createUpdateRequestRouter()
