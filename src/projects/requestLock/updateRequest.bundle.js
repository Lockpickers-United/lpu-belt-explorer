import {Router} from 'express'

export function createUpdateRequestRouter(handlers = {}) {
    const router = Router()

    router.get('/', (req, res) => {
        req.log.info('updateRequest route hit')
        res.json({message: 'updateRequest endpoint', requestId: req.id})
    })

    router.post('/', async (req, res, next) => {
        try {
            const updateRequest = handlers.updateRequest
                ?? (await import('./requestLock.js')).updateRequest
            await updateRequest(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createUpdateRequestRouter()
