import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    req.log.info('logFirebaseActivity route hit')
    res.json({ message: 'logFirebaseActivity endpoint', requestId: req.id })
})

router.post('/', async (req, res, next) => {
    try {
        const {default: handleFirebaseActivityPost} = await import('./logFirebaseActivity.js')
        await handleFirebaseActivityPost(req, res)
    } catch (e) {
        next(e)
    }
})

export default router


// LARGEJSON ??
 // app.post('/log-activity', largeJson, async (req, res) => {})
