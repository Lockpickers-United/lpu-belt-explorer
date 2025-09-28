import {Router} from 'express'

const router = Router()

router.get('/', async (req, res, next) => {
    try {
        const {default: importRaflData} = await import('./importRaflData.js')
        await importRaflData(res, req).then(results => {
            res.send(results)
        })
    } catch (e) {
        next(e)
    }
})

export default router