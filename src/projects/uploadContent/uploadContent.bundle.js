import {Router} from 'express'
import {createRateLimit, rateLimitPolicies} from '../../api/middleware/rateLimit.js'

export function createUploadContentRouter(uploadContentHandler) {
    const router = Router()
    const uploadContentRateLimit = createRateLimit(rateLimitPolicies.uploadContent)

    router.get('/', (req, res) => {
        req.log.info('Upload Content route hit')
        res.json({message: 'Upload Content endpoint', requestId: req.id})
    })

    router.post('/', uploadContentRateLimit, async (req, res, next) => {
        try {
            const uploadContent = uploadContentHandler
                ?? (await import('./uploadContent.js')).default
            await uploadContent(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createUploadContentRouter()
