import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    req.log.info('updateRequest route hit')
    res.json({ message: 'updateRequest endpoint', requestId: req.id })
})

router.post('/', async (req, res, next) => {
    try {
        const {updateRequest} = await import('./requestLock.js')
        await updateRequest(req, res)
    } catch (e) {
        next(e)
    }
})

export default router
