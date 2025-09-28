import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    req.log.info('requestLock route hit')
    res.json({ message: 'requestLock endpoint', requestId: req.id })
})

router.post('/', async (req, res, next) => {
    try {
        const {default: requestLock} = await import('./requestLock.js')
        await requestLock(req, res)
    } catch (e) {
        next(e)
    }
})

export default router