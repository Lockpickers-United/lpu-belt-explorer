import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    req.log.info('fetchFlairs route hit')
    res.json({ message: 'fetchFlairs endpoint', requestId: req.id })
})

router.post('/', async (req, res, next) => {
    try {
        const {default: fetchFlairs} = await import('./fetchFlairs.js')
        await fetchFlairs(req, res)
    } catch (e) {
        next(e)
    }
})

export default router

