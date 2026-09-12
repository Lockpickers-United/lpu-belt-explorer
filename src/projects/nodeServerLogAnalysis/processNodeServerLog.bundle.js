import {Router} from 'express'

const router = Router()

router.get('/', async (req, res, next) => {
    try {
        const {processNodeServerLog: processNodeServerLog} = await import('./processNodeServerLog.js')
        const results = await processNodeServerLog(req, res)
        return res.status(200).json(results)
    } catch (e) {
        next(e)
    }
})

export default router

