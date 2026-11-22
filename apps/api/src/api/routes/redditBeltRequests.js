import {createHash, timingSafeEqual} from 'node:crypto'
import {Router} from 'express'
import {getFirestoreDb} from '../services/firebaseAdmin.js'
import {parseRedditBeltRequest, saveRedditBeltRequest} from '../services/redditBeltRequestService.js'
import {logger} from '../../logger/logger.js'

const router = Router()
const log = logger.child({module: 'api.redditBeltRequests'})
const digest = value => createHash('sha256').update(value).digest()

router.post('/reddit', async (req, res) => {
    res.set('Cache-Control', 'private, no-store')
    const key = process.env.REDDIT_BELT_REQUEST_API_KEY?.trim()
    if (!key) return res.status(503).json({error: {code: 'belt_request_webhook_disabled'}})
    const token = /^Bearer ([^\s]+)$/.exec(req.get('Authorization') || '')?.[1]
    if (!token || !timingSafeEqual(digest(token), digest(key))) {
        return res.status(401).json({error: {code: 'unauthorized'}})
    }
    let input
    try {
        input = parseRedditBeltRequest(req.body)
    } catch {
        return res.status(400).json({error: {code: 'belt_request_invalid'}})
    }
    try {
        const data = await saveRedditBeltRequest(await getFirestoreDb(), input)
        return res.status(data.created ? 201 : 200).json({data})
    } catch {
        // Do not pass webhook bodies or credential-bearing SDK errors to generic logging.
        log.error({requestId: req.id}, 'Reddit belt request persistence failed')
        return res.status(503).json({error: {code: 'belt_request_storage_unavailable'}})
    }
})

export default router
