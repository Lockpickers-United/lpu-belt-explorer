import {Router} from 'express'
import requireAuth from '../../api/middleware/requireAuth.js'
import requireRaflAdmin from './requireRaflAdmin.js'
import {createRateLimit, rateLimitPolicies} from '../../api/middleware/rateLimit.js'

export function createImportRaflDataRouter(importRaflDataHandler) {
    const router = Router()
    const importRaflDataRateLimit = createRateLimit(rateLimitPolicies.importRaflData)

    router.get('/', importRaflDataRateLimit, requireAuth, requireRaflAdmin, async (req, res, next) => {
        try {
            const handler = importRaflDataHandler
                ?? (await import('./importRaflData.js')).default
            await handler(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createImportRaflDataRouter()
