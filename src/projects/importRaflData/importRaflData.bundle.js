import {Router} from 'express'
import requireAuth from '../../api/middleware/requireAuth.js'
import requireRaflAdmin from './requireRaflAdmin.js'

export function createImportRaflDataRouter(importRaflDataHandler) {
    const router = Router()

    router.get('/', requireAuth, requireRaflAdmin, async (req, res, next) => {
        try {
            const handler = importRaflDataHandler
                ?? (await import('./importRaflData.js')).default
            await handler(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createImportRaflDataRouter()
