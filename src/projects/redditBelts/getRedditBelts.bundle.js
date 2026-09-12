import {Router} from 'express'
import requireAuth from '../../api/middleware/requireAuth.js'
import requireLpuAdmin from './requireLpuAdmin.js'
import {createRateLimit, rateLimitPolicies} from '../../api/middleware/rateLimit.js'

export function createGetRedditBeltsRouter(getRedditBeltsHandler) {
    const router = Router()
    const redditBeltsRateLimit = createRateLimit(rateLimitPolicies.redditBelts)

    router.use(redditBeltsRateLimit, requireAuth, requireLpuAdmin)

    router.get('/', (req, res) => {
        req.log.info('getRedditBelts route hit')
        res.json({message: 'getRedditBelts endpoint', requestId: req.id})
    })

    router.post('/', async (req, res, next) => {
        try {
            const handler = getRedditBeltsHandler
                ?? (await import('./getRedditBelts.js')).default
            await handler(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createGetRedditBeltsRouter()
