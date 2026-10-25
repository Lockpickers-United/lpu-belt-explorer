import {Router} from 'express'
import {z} from 'zod'
import requireAuth from '../middleware/requireAuth.js'
import {getFirestoreDb} from '../services/firebaseAdmin.js'
import {createDiscordIdentityService} from '../services/discordIdentityService.js'

const router = Router()
const nonceSchema = z.string().regex(/^[a-f0-9]{32}$/)
const stateSchema = z.string().regex(/^[A-Za-z0-9_-]{43}$/)
const startSchema = z.strictObject({
    purpose: z.enum(['import', 'beltRequest']),
    returnTo: z.enum(['/beltRequests']).nullable().optional(),
    nonce: nonceSchema,
    redirectUri: z.url().max(512)
}).refine(value => value.purpose !== 'beltRequest' || value.returnTo === '/beltRequests', {
    message: 'Belt request return path is required'
}).refine(value => value.purpose !== 'import' || !value.returnTo, {
    message: 'Import does not accept a return path'
})
const exchangeSchema = z.strictObject({
    code: z.string().min(1).max(2048),
    state: stateSchema,
    nonce: nonceSchema
})

function parse(schema, value) {
    const result = schema.safeParse(value)
    if (result.success) return result.data
    const error = new Error('Invalid request')
    error.status = 400
    error.code = 'invalid_request'
    throw error
}

async function service() {
    return createDiscordIdentityService({
        db: await getFirestoreDb(),
        config: {
            clientId: process.env.DISCORD_CLIENT_ID?.trim(),
            clientSecret: process.env.DISCORD_CLIENT_SECRET?.trim(),
            redirectUris: (process.env.DISCORD_REDIRECT_URIS || '').split(',')
                .map(value => value.trim()).filter(Boolean)
        }
    })
}

function respond(res, data) {
    res.json({
        metadata: {source: 'firebase', fetchedDateTime: new Date().toISOString()},
        data
    })
}

router.use((_req, res, next) => {
    res.set('Cache-Control', 'private, no-store')
    next()
})
router.use(requireAuth)

router.post('/oauth/start', async (req, res) => {
    const input = parse(startSchema, req.body)
    respond(res, await (await service()).start({
        uid: req.user.uid,
        purpose: input.purpose,
        returnTo: input.returnTo || null,
        nonce: input.nonce,
        redirectUri: input.redirectUri
    }))
})

router.post('/oauth/exchange', async (req, res) => {
    const input = parse(exchangeSchema, req.body)
    respond(res, await (await service()).exchange({uid: req.user.uid, ...input}))
})

export default router
