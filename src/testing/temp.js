import {Router} from 'express'

const router = Router()

router.get('/temp', (_req, res) => {
    res.json({temp: true})
})

export default router
