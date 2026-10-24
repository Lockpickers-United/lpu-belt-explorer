import {z} from 'zod'
import {voteBelts} from './classificationModel.js'

const id = z.string().min(1).max(128).regex(/^[^/]+$/)
const revision = z.number().int().positive()
const optionalText = max => z.string().max(max).nullable().optional()
const mediaUrl = z.string().max(2048).refine(value => {
    try {
        return ['http:', 'https:'].includes(new URL(value).protocol)
    } catch {
        return false
    }
}, 'Only HTTP(S) URLs are allowed').nullable().optional()

export const voteCreateSchema = z.strictObject({
    entryId: id,
    votedBelt: z.enum(voteBelts),
    comment: optionalText(2000),
    mediaUrl
})

export const voteEditSchema = z.strictObject({
    expectedRevision: revision,
    votedBelt: z.enum(voteBelts),
    comment: optionalText(2000),
    mediaUrl
})

export const voteMoveSchema = z.strictObject({
    entryId: id,
    expectedRevision: revision
})

export const revisionSchema = z.strictObject({expectedRevision: revision})

const actionFields = {
    status: z.enum(['Draft', 'Pending', 'Staged', 'Re-opened', 'Settled']),
    action: z.enum(['Belt Change', 'Sameline', 'Add New Sameline', 'Delete', 'Other']).nullable().optional(),
    updatedBelt: z.enum(voteBelts).nullable().optional(),
    samelineTargetId: id.nullable().optional(),
    newSamelineName: optionalText(256),
    note: optionalText(4000),
    adminNote: optionalText(4000),
    omitChangelog: z.boolean().optional()
}

function validateActionFields(value, context) {
    const {action, updatedBelt, samelineTargetId, newSamelineName, status} = value
    if (status === 'Staged' && !action) {
        context.addIssue({code: 'custom', path: ['action'], message: 'A staged action needs a decision'})
    }
    if (action === 'Belt Change' && !updatedBelt) {
        context.addIssue({code: 'custom', path: ['updatedBelt'], message: 'A belt change needs a belt'})
    }
    if (action === 'Sameline' && !samelineTargetId) {
        context.addIssue({code: 'custom', path: ['samelineTargetId'], message: 'A sameline needs a target'})
    }
    if (action !== 'Belt Change' && updatedBelt) {
        context.addIssue({code: 'custom', path: ['updatedBelt'], message: 'Unexpected belt'})
    }
    if (action !== 'Sameline' && samelineTargetId) {
        context.addIssue({code: 'custom', path: ['samelineTargetId'], message: 'Unexpected sameline target'})
    }
    if (action === 'Add New Sameline' && !newSamelineName?.trim()) {
        context.addIssue({code: 'custom', path: ['newSamelineName'], message: 'A new sameline needs a name'})
    }
    if (action !== 'Add New Sameline' && newSamelineName !== null && newSamelineName !== undefined) {
        context.addIssue({code: 'custom', path: ['newSamelineName'], message: 'Unexpected new sameline name'})
    }
    if (status === 'Re-opened' && action) {
        context.addIssue({code: 'custom', path: ['action'], message: 'Re-opened has no decision'})
    }
}

export const actionFieldsSchema = z.strictObject(actionFields).superRefine(validateActionFields)

export const actionCreateSchema = z.strictObject({
    entryId: id,
    ...actionFields
}).superRefine(validateActionFields)

export const actionEditSchema = z.strictObject({
    expectedRevision: revision,
    ...actionFields
}).superRefine(validateActionFields)

export const batchPublishSchema = z.strictObject({
    actions: z.array(z.strictObject({actionId: id, expectedRevision: revision})).min(1).max(50)
})

export const singlePublishSchema = z.strictObject({
    entryId: id,
    actionId: id.nullable().optional(),
    expectedRevision: revision.nullable(),
    action: z.enum(['Belt Change', 'Sameline', 'Add New Sameline', 'Delete', 'Other']),
    updatedBelt: z.enum(voteBelts).nullable().optional(),
    samelineTargetId: id.nullable().optional(),
    newSamelineName: optionalText(256),
    note: optionalText(4000),
    adminNote: optionalText(4000),
    omitChangelog: z.literal(false)
})

export const entryIdSchema = id
export const resourceIdSchema = id
