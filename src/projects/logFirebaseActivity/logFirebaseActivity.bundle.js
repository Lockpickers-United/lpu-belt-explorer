import {Router} from 'express'
import {createRateLimit, rateLimitPolicies} from '../../api/middleware/rateLimit.js'

export function createFirebaseActivityRouter(firebaseActivityHandler) {
    const router = Router()
    const firebaseActivityRateLimit = createRateLimit(rateLimitPolicies.firebaseActivity)

    router.get('/', (req, res) => {
        req.log.info('logFirebaseActivity route hit')
        res.json({message: 'logFirebaseActivity endpoint', requestId: req.id})
    })

    router.post('/', firebaseActivityRateLimit, async (req, res, next) => {
        try {
            const handler = firebaseActivityHandler
                ?? (await import('./logFirebaseActivity.js')).default
            await handler(req, res, next)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createFirebaseActivityRouter()


// LARGEJSON ??
// app.post('/log-activity', largeJson, async (req, res) => {})
