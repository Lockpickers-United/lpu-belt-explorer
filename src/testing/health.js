import { Router } from 'express'
import {logger} from '../logger/logger.js'
const router = Router()

const log = logger.child({
    module: 'health'
})

router.get('/health', (_req, res) => {
    log.info({var: process.env.REQUESTED_LOCKS_UPLOAD_DIR}, 'process.env logged')

    res.json({ ok: true })
})

export default router
