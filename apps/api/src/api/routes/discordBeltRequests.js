import {Router} from 'express'
import {z} from 'zod'
import requireAuth from '../middleware/requireAuth.js'
import {getFirestoreDb} from '../services/firebaseAdmin.js'
import {createDiscordIdentityService} from '../services/discordIdentityService.js'
import {createDiscordBeltRequestService} from '../services/discordBeltRequestService.js'

const router = Router()
const text = (max) => z.string().trim().min(1).max(max)
const optionalText = (max) => z.string().trim().max(max).optional()
const httpUrl = z.url().max(2048).refine(value => ['http:', 'https:'].includes(new URL(value).protocol))
const entry = z.strictObject({
    lockId: text(128).optional(),
    matchId: text(128).optional(),
    lockName: text(160),
    belt: text(32),
    link: httpUrl
}).refine(value => value.lockId || value.matchId)
const quest = z.strictObject({
    discipline: text(100),
    tier: text(50),
    details: text(500)
})
const requestSchema = z.strictObject({
    requestBelt: text(32),
    entries: z.array(entry).max(6),
    quests: z.array(quest).max(2),
    danRequestEvidence: httpUrl.optional(),
    blueBeltProjectInfo: optionalText(1000),
    blackBeltMentoringInfo: optionalText(1000),
    notes: optionalText(1000),
    redditUsername: z.string().regex(/^[A-Za-z0-9_-]{3,20}$/).optional()
})
const postSchema = z.strictObject({
    postingGrant: z.string().regex(/^[A-Za-z0-9_-]{43}$/),
    request: requestSchema
})

function parse(value) {
    const result = postSchema.safeParse(value)
    if (result.success) return result.data
    const error = new Error('Invalid belt request')
    error.status = 400
    error.code = 'belt_request_invalid'
    throw error
}

router.use((_req, res, next) => {
    res.set('Cache-Control', 'private, no-store')
    next()
})
router.use(requireAuth)

router.post('/discord', async (req, res) => {
    const input = parse(req.body)
    const db = await getFirestoreDb()
    const identityService = createDiscordIdentityService({db, config: {}})
    const service = createDiscordBeltRequestService({
        consumePostingGrant: identityService.consumePostingGrant,
        config: {
            target: process.env.BELT_REQUEST_WEBHOOK_TARGET,
            testWebhookUrl: process.env.TEST_WEBHOOK_URL,
            productionWebhookUrl: process.env.BELT_REQUEST_WEBHOOK_URL
        }
    })
    try {
        const data = await service.post({uid: req.user.uid, ...input})
        res.json({metadata: {source: 'discord', fetchedDateTime: new Date().toISOString()}, data})
    } catch (error) {
        if (error.retryAfterSeconds) res.set('Retry-After', String(error.retryAfterSeconds))
        throw error
    }
})

export default router
