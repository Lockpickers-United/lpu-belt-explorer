import {Router} from 'express'
import {z} from 'zod'
import requireAuth from '../middleware/requireAuth.js'

const router = Router()

const userIdSchema = z.string().min(1).max(128)
const publicProfileCache = 'public, max-age=60'

function parseUserId(req) {
    const parsed = userIdSchema.safeParse(req.params.id)
    if (!parsed.success) {
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

router.get('/:id/summary', async (req, res) => {
    const userId = parseUserId(req)
    const {getUserSummary} = await getUserProfileService()
    res.set('Cache-Control', publicProfileCache)
    res.json(await getUserSummary(userId))
})

router.get('/:id/wishlist', async (req, res) => {
    const userId = parseUserId(req)
    const {getUserWishlist} = await getUserProfileService()
    res.set('Cache-Control', publicProfileCache)
    res.json(await getUserWishlist(userId))
})

router.get('/:id/profile', requireAuth, async (req, res) => {
    const userId = parseUserId(req)
    if (req.user?.uid !== userId && req.user?.admin !== true) {
        const err = new Error('Forbidden')
        err.status = 403
        err.code = 'forbidden'
        throw err
    }

    const {getUserProfileResponse} = await getUserProfileService()
    res.set('Cache-Control', 'private, no-store')
    res.json(await getUserProfileResponse(userId))
})

export default router
