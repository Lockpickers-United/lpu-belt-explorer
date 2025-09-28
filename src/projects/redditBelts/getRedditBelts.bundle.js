import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    req.log.info('getRedditBelts route hit')
    res.json({ message: 'getRedditBelts endpoint', requestId: req.id })
})

router.post('/', async (req, res, next) => {
    try {
        const {default: getRedditBelts} = await import('./getRedditBelts.js')
        await getRedditBelts(req, res)
    } catch (e) {
        next(e)
    }
})

export default router