import { Router } from 'express'
const router = Router()

router.get('/ready', (_req, res) => res.json({ ready: true }))

export default router
