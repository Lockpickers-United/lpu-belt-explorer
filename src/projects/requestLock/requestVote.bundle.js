import {Router} from 'express'

export function createRequestVoteRouter(handlers = {}) {
    const router = Router()

    router.get('/', (req, res) => {
        req.log.info('updateVotes route hit')
        res.json({message: 'updateVotes endpoint', requestId: req.id})
    })

    router.post('/', async (req, res, next) => {
        try {
            const updateVotes = handlers.updateVotes
                ?? (await import('./requestLock.js')).updateVotes
            await updateVotes(req, res)
        } catch (error) {
            next(error)
        }
    })

    return router
}

export default createRequestVoteRouter()
