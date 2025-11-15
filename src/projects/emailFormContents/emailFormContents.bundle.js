import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    req.log.info('emailFormContents route hit')
    res.json({ message: 'emailFormContents endpoint', requestId: req.id })
})

router.post('/', async (req, res, next) => {
    try {
        const {default: emailFormContents} = await import('./emailFormContents.js')
        await emailFormContents(req, res)
    } catch (e) {
        next(e)
    }
})

export default router