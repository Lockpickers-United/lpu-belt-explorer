import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    req.log.info('updateVotes route hit')
    res.json({ message: 'updateVotes endpoint', requestId: req.id })
})

router.post('/', async (req, res, next) => {
    try {
        const {updateVotes} = await import('./requestLock.js')
        await updateVotes(req, res)
    } catch (e) {
        next(e)
    }
})

export default router
