import {Router} from 'express'
import {createRateLimit, rateLimitPolicies} from '../../api/middleware/rateLimit.js'

export function createEmailFormRouter(emailFormHandler) {
    const router = Router()
    const emailFormRateLimit = createRateLimit(rateLimitPolicies.emailForm)

    router.get('/', (req, res) => {
        req.log.info('Email Form route hit')
        res.json({message: 'Email Form endpoint', requestId: req.id})
    })

    router.post('/', emailFormRateLimit, async (req, res, next) => {
        try {
            const handler = emailFormHandler
                ?? (await import('./emailFormContents.js')).default
            await handler(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createEmailFormRouter()
