import {Router} from 'express'
import {
    getAllLockCollectionStats,
    getOwnLockCollectionStats,
    getScorecardLockCollectionStats,
    getWishlistLockCollectionStats
} from '../services/collectionStatsService.js'
import {logger} from '../../logger/logger.js'
import {createRateLimit, rateLimitPolicies} from '../middleware/rateLimit.js'

const log = logger.child({module: 'api.routes.stats.collections'})

const router = Router()
const collectionStatsRateLimit = createRateLimit(rateLimitPolicies.collectionStats)

router.use(collectionStatsRateLimit)

const publicSummaryCache = 'public, max-age=300'

router.get('/locks', async (req, res) => {
    log.info({
        requestId: req.id,
        endpoint: 'GET /api/v1/stats/collections/locks',
        ip: req.ip
    }, 'lock stats served')
    res.set('Cache-Control', publicSummaryCache)
    res.json(await getAllLockCollectionStats())
})

router.get('/locks/own', async (req, res) => {
    log.info({
        requestId: req.id,
        endpoint: 'GET /api/v1/stats/collections/locks/own',
        ip: req.ip
    }, 'lock stats served')
    res.set('Cache-Control', publicSummaryCache)
    res.json(await getOwnLockCollectionStats())
})

router.get('/locks/scorecard', async (req, res) => {
    log.info({
        requestId: req.id,
        endpoint: 'GET /api/v1/stats/collections/locks/scorecard',
        ip: req.ip
    }, 'lock stats served')
    res.set('Cache-Control', publicSummaryCache)
    res.json(await getScorecardLockCollectionStats())
})

router.get('/locks/wishlist', async (req, res) => {
    log.info({
        requestId: req.id,
        endpoint: 'GET /api/v1/stats/collections/locks/wishlist',
        ip: req.ip
    }, 'lock stats served')
    res.set('Cache-Control', publicSummaryCache)
    res.json(await getWishlistLockCollectionStats())
})

export default router
