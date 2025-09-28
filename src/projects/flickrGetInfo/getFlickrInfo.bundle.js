import {Router} from 'express'

const router = Router()

router.get('/', async (req, res, next) => {
    try {
        const {default: getFlickrInfo} = await import('./getFlickrInfo.js')
        const results = await getFlickrInfo(req.query.id)
        res.send(results)
    } catch (e) {
        next(e)
    }
})

export default router
