import {Router} from 'express'
import {z} from 'zod'
import requireAuth from '../middleware/requireAuth.js'
import {userProfileRateLimit} from '../middleware/rateLimit.js'
import {logger} from '../../logger/logger.js'

const router = Router()
const log = logger.child({
    module: 'api.routes.users'
})

const userIdSchema = z.string().min(8).max(128)
const publicProfileCache = 'public, max-age=60'

function parseUserId(req) {
    const parsed = userIdSchema.safeParse(req.params.id)
    if (!parsed.success) {
        log.warn({
            requestId: req.id,
            userId: req.params.id,
            ip: req.ip
        }, 'invalid user id')
        const err = new Error('Invalid user id')
        err.status = 400
        err.code = 'invalid_user_id'
        err.details = parsed.error.issues
        throw err
    }
    return parsed.data
}

async function getUserProfileService() {
    return import('../services/userProfileService.js')
}

router.use(userProfileRateLimit)

function getUserSummaryHandler(endpoint) {
    return async (req, res) => {
        const userId = parseUserId(req)
        const {getUserSummary} = await getUserProfileService()
        const summary = await getUserSummary(userId)
        log.info({
            requestId: req.id,
            endpoint,
            userId,
            displayName: summary.data.displayName,
            ip: req.ip
        }, 'user summary served')

        res.set('Cache-Control', publicProfileCache)
        res.json(summary)
    }
}

router.get('/:id', getUserSummaryHandler('GET /api/v1/users/:id'))
router.get('/:id/summary', getUserSummaryHandler('GET /api/v1/users/:id/summary'))

router.get('/:id/wishlist', async (req, res) => {
    const userId = parseUserId(req)
    const {getUserWishlist} = await getUserProfileService()
    const wishlist = await getUserWishlist(userId)

    log.info({
        requestId: req.id,
        endpoint: 'GET /api/v1/users/:id/wishlist',
        userId,
        wishlistCount: wishlist.data.wishlist.length,
        ip: req.ip
    }, 'user wishlist served')

    res.set('Cache-Control', publicProfileCache)
    res.json(wishlist)
})

router.get('/:id/profile', requireAuth, async (req, res) => {
    const userId = parseUserId(req)
    if (req.user?.uid !== userId && req.user?.admin !== true) {
        log.warn({
            requestId: req.id,
            endpoint: 'GET /api/v1/users/:id/profile',
            userId,
            authUid: req.user?.uid,
            ip: req.ip
        }, 'user profile access denied')
        const err = new Error('Forbidden')
        err.status = 403
        err.code = 'forbidden'
        throw err
    }

    const {getUserProfileResponse} = await getUserProfileService()
    const profileResponse = await getUserProfileResponse(userId)

    log.info({
        requestId: req.id,
        endpoint: 'GET /api/v1/users/:id/profile',
        userId,
        authUid: req.user.uid,
        displayName: profileResponse.data.profile?.displayName,
        ip: req.ip
    }, 'authenticated user profile served')

    res.set('Cache-Control', 'private, no-store')
    res.json(profileResponse)
})

export default router
