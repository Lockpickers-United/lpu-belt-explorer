import {Router} from 'express'
import {
    getAllLockCollectionStats,
    getOwnLockCollectionStats,
    getScorecardLockCollectionStats
} from '../services/collectionStatsService.js'

const router = Router()

const publicSummaryCache = 'public, max-age=300'

router.get('/locks', async (_req, res) => {
    res.set('Cache-Control', publicSummaryCache)
    res.json(await getAllLockCollectionStats())
})

router.get('/locks/own', async (_req, res) => {
    res.set('Cache-Control', publicSummaryCache)
    res.json(await getOwnLockCollectionStats())
})

router.get('/locks/scorecard', async (_req, res) => {
    res.set('Cache-Control', publicSummaryCache)
    res.json(await getScorecardLockCollectionStats())
})

export default router
