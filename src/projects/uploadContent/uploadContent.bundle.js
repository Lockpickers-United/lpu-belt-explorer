import {Router} from 'express'

const router = Router()

router.get('/', (req, res) => {
    req.log.info('Upload Content route hit')
    res.json({ message: 'Upload Content endpoint', requestId: req.id })
})

router.post('/', async (req, res, next) => {
    try {
        const {default: uploadContent} = await import('./uploadContent.js')
        await uploadContent(req, res)
    } catch (e) {
        next(e)
    }
})

export default router