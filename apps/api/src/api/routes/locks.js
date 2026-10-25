import {Router} from 'express'
import {z} from 'zod'
import {createRateLimit, rateLimitPolicies} from '../middleware/rateLimit.js'
import {getLockVideosResponse} from '../services/lockVideosService.js'
import {logger} from '../../logger/logger.js'

const router = Router()
const log = logger.child({module: 'api.routes.locks'})
const lockVideosRateLimit = createRateLimit(rateLimitPolicies.collectionStats)
const lockIdSchema = z.string().min(1).max(128).regex(/^[A-Za-z0-9_-]+$/)
const publicVideosCache = 'public, max-age=300'

router.use(lockVideosRateLimit)

router.get('/:lockId/videos', async (req, res) => {
    const parsedLockId = lockIdSchema.safeParse(req.params.lockId)
    if (!parsedLockId.success) {
        log.warn({
            requestId: req.id,
            lockId: req.params.lockId,
            ip: req.ip
        }, 'invalid lock id')
        const error = new Error('Invalid lock id')
        error.status = 400
        error.code = 'invalid_lock_id'
        error.details = parsedLockId.error.issues
        throw error
    }

    const response = await getLockVideosResponse(parsedLockId.data)
    log.info({
        requestId: req.id,
        endpoint: 'GET /api/v1/locks/:lockId/videos',
        lockId: parsedLockId.data,
        videoCount: response.data.videos.length,
        ip: req.ip
    }, 'lock videos served')

    res.set('Cache-Control', publicVideosCache)
    res.json(response)
})

export default router
