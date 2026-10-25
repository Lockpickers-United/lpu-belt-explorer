import {Router} from 'express'
import {z} from 'zod'
import requireAuth from '../middleware/requireAuth.js'
import {createClassificationService} from '../services/classificationService.js'
import {
    actionCreateSchema, actionEditSchema, actionFieldsSchema, batchPublishSchema, entryIdSchema,
    publicationApprovalSchema, resourceIdSchema, revisionSchema, singlePublishSchema, voteCreateSchema, voteEditSchema,
    voteMoveSchema
} from '../services/classificationSchemas.js'
import {getFirestoreDb} from '../services/firebaseAdmin.js'
import {getCatalogEntry} from '../services/classificationCatalog.js'

const router = Router()
const privateCache = 'private, no-store'
const readerClaims = ['admin', 'classificationAdmin', 'lpuMod', 'classificationTeam', 'blackBelt']
const writerClaims = ['admin', 'classificationAdmin', 'lpuMod', 'classificationTeam', 'blackBelt']
const adminClaims = ['admin', 'classificationAdmin']
const writeStages = {read: 0, vote: 1, action: 2, publish: 3}
const pageSchema = z.strictObject({
    limit: z.coerce.number().int().min(1).max(100).default(25),
    cursor: z.string().max(512).optional()
})

function apiError(status, code, message, details) {
    const error = new Error(message)
    error.status = status
    error.code = code
    error.details = details
    return error
}

function parse(schema, value) {
    const parsed = schema.safeParse(value)
    if (!parsed.success) {
        throw apiError(400, 'invalid_request', 'Invalid request', parsed.error.issues)
    }
    return parsed.data
}

function requireClaims(claims) {
    return (req, _res, next) => {
        if (claims.some(claim => req.user?.[claim] === true)) return next()
        return next(apiError(403, 'forbidden', 'Forbidden'))
    }
}

function isAdmin(user) {
    return adminClaims.some(claim => user?.[claim] === true)
}

function requireWriteStage(required) {
    return (_req, _res, next) => {
        const active = writeStages[process.env.CLASSIFICATION_WRITE_STAGE] ?? writeStages.read
        if (active >= writeStages[required]) return next()
        return next(apiError(503, 'writes_disabled', 'Classification writes are not enabled at this stage'))
    }
}

function idempotencyKey(req) {
    const key = req.get('Idempotency-Key')
    if (!key || key.length < 8 || key.length > 128) {
        throw apiError(400, 'invalid_idempotency_key', 'A valid Idempotency-Key is required')
    }
    return key
}

async function service() {
    return createClassificationService({db: await getFirestoreDb(), getCatalogEntry})
}

function respond(res, data, status = 200) {
    return res.status(status).json({
        metadata: {source: 'firebase', fetchedDateTime: new Date().toISOString()},
        data
    })
}

router.use((_req, res, next) => {
    res.set('Cache-Control', privateCache)
    next()
})
router.use(requireAuth)

router.get('/entries/:entryId/votes', requireClaims(readerClaims), async (req, res) => {
    const entryId = parse(entryIdSchema, req.params.entryId)
    const page = parse(pageSchema, req.query)
    respond(res, await (await service()).getEntryVotes(entryId, page))
})

router.get('/entries/:entryId/action', requireClaims(adminClaims), async (req, res) => {
    const entryId = parse(entryIdSchema, req.params.entryId)
    respond(res, await (await service()).getCurrentAction(entryId))
})

router.get('/actions/staged', requireClaims(readerClaims), async (req, res) => {
    const page = parse(pageSchema.omit({cursor: true}), req.query)
    respond(res, {actions: await (await service()).getStagedActions(page)})
})

router.get('/publications', requireClaims(readerClaims), async (req, res) => {
    const page = parse(pageSchema, req.query)
    respond(res, await (await service()).getPublications(page))
})

router.get('/publications/:publicationId', requireClaims(readerClaims), async (req, res) => {
    const id = parse(resourceIdSchema, req.params.publicationId)
    respond(res, await (await service()).getPublication(id))
})

router.post('/votes', requireClaims(writerClaims), requireWriteStage('vote'), async (req, res) => {
    const input = parse(voteCreateSchema, req.body)
    respond(res, await (await service()).createVote(req.user, idempotencyKey(req), input), 201)
})

router.patch('/votes/:voteId', requireClaims(writerClaims), requireWriteStage('vote'), async (req, res) => {
    const id = parse(resourceIdSchema, req.params.voteId)
    const input = parse(voteEditSchema, req.body)
    respond(res, await (await service()).editVote(req.user, idempotencyKey(req), id, input,
        isAdmin(req.user)))
})

router.post('/votes/:voteId/move', requireClaims(adminClaims), requireWriteStage('vote'), async (req, res) => {
    const id = parse(resourceIdSchema, req.params.voteId)
    const input = parse(voteMoveSchema, req.body)
    respond(res, await (await service()).moveVote(req.user, idempotencyKey(req), id, input))
})

router.delete('/votes/:voteId', requireClaims(writerClaims), requireWriteStage('vote'), async (req, res) => {
    const id = parse(resourceIdSchema, req.params.voteId)
    const {expectedRevision} = parse(revisionSchema, req.body)
    respond(res, await (await service()).deleteVote(req.user, idempotencyKey(req), id,
        expectedRevision, isAdmin(req.user)))
})

router.post('/actions', requireClaims(adminClaims), requireWriteStage('action'), async (req, res) => {
    const input = parse(actionCreateSchema, req.body)
    respond(res, await (await service()).createAction(req.user, idempotencyKey(req), input), 201)
})

router.patch('/actions/:actionId', requireClaims(adminClaims), requireWriteStage('action'), async (req, res) => {
    const id = parse(resourceIdSchema, req.params.actionId)
    const input = parse(actionEditSchema, req.body)
    respond(res, await (await service()).editAction(req.user, idempotencyKey(req), id, input))
})

router.delete('/actions/:actionId', requireClaims(adminClaims), requireWriteStage('action'), async (req, res) => {
    const id = parse(resourceIdSchema, req.params.actionId)
    const {expectedRevision} = parse(revisionSchema, req.body)
    respond(res, await (await service()).deleteAction(req.user, idempotencyKey(req), id,
        expectedRevision))
})

router.post('/publications', requireClaims(adminClaims), requireWriteStage('publish'), async (req, res) => {
    const input = parse(batchPublishSchema, req.body)
    respond(res, await (await service()).publishBatch(req.user, idempotencyKey(req), input), 201)
})

router.post('/publications/single', requireClaims(adminClaims), requireWriteStage('publish'), async (req, res) => {
    const input = parse(singlePublishSchema, req.body)
    parse(actionFieldsSchema, {
        status: 'Staged',
        action: input.action,
        updatedBelt: input.updatedBelt,
        samelineTargetId: input.samelineTargetId,
        newSamelineName: input.newSamelineName,
        note: input.note,
        adminNote: input.adminNote,
        omitChangelog: input.omitChangelog
    })
    if ((input.actionId && input.expectedRevision === null) ||
        (!input.actionId && input.expectedRevision !== null)) {
        throw apiError(400, 'invalid_revision', 'Revision must match action selection')
    }
    respond(res, await (await service()).publishSingle(req.user, idempotencyKey(req), input), 201)
})

router.patch('/publications/:publicationId/actions/:actionId/approval',
    requireClaims(adminClaims), requireWriteStage('publish'), async (req, res) => {
        const publicationId = parse(resourceIdSchema, req.params.publicationId)
        const actionId = parse(resourceIdSchema, req.params.actionId)
        const input = parse(publicationApprovalSchema, req.body)
        respond(res, await (await service()).setPublicationApproval(req.user, idempotencyKey(req),
            publicationId, actionId, input))
    })

export default router
