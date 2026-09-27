import { Router } from 'express'

export function createReadyRouter(readinessHandler = (_req, res) => res.json({ready: true})) {
    const router = Router()
    router.get('/ready', readinessHandler)
    return router
}

export default createReadyRouter()
