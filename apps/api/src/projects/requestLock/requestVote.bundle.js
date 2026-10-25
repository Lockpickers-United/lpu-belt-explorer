import {Router} from 'express'
import {createRateLimit, rateLimitPolicies} from '../../api/middleware/rateLimit.js'

export function createRequestVoteRouter(handlers = {}) {
    const router = Router()
    const requestVoteRateLimit = createRateLimit(rateLimitPolicies.requestVote)

    router.get('/', (req, res) => {
        req.log.info('updateVotes route hit')
        res.json({message: 'updateVotes endpoint', requestId: req.id})
    })

    router.post('/', requestVoteRateLimit, async (req, res, next) => {
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
