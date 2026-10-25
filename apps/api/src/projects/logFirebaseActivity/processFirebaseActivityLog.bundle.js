import {Router} from 'express'

const router = Router()

router.get('/', async (req, res, next) => {
    try {
        const {default: processFirebaseActivityLog} = await import('./processFirebaseActivityLog.js')
        const results = await processFirebaseActivityLog(req, res)
        return res.status(200).json(results)
    } catch (e) {
        next(e)
    }
})

export default router

