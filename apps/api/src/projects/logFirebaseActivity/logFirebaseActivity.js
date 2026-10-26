import {logger} from '../../logger/logger.js'

const log = logger.child({module: 'firebase-activity'})
const validActivityTypes = new Set(['READ', 'WRITE', 'REFRESH'])

function activityError(code, message, status = 400) {
    const error = new Error(message)
    error.code = code
    error.status = status
    return error
}

function boundedString(value, field, maxStringLength, {required = false} = {}) {
    if (value === undefined || value === null || value === '') {
        if (required) {
            throw activityError('firebase_activity_invalid', `${field} is required`)
        }
        return undefined
    }
    if (typeof value !== 'string') {
        throw activityError('firebase_activity_invalid', `${field} must be a string`)
    }
    const normalized = value.trim()
    if (required && !normalized) {
        throw activityError('firebase_activity_invalid', `${field} is required`)
    }
    if (normalized.length > maxStringLength) {
        throw activityError(
            'firebase_activity_invalid',
            `${field} must not exceed ${maxStringLength} characters`
        )
    }
    return normalized || undefined
}

function normalizeMessage(message, {productionData, maxStringLength}) {
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
        throw activityError('firebase_activity_invalid', 'Each activity entry must be an object')
    }

    const type = boundedString(message.type ?? message.activity, 'type', maxStringLength, {required: true})
        .toUpperCase()
    if (!validActivityTypes.has(type)) {
        throw activityError('firebase_activity_invalid', `Unsupported activity type: ${type}`)
    }

    const count = message.count ?? message.activityCount
    if (typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0) {
        throw activityError('firebase_activity_invalid', 'count must be a non-negative integer')
    }
    if (type !== 'REFRESH' && count === 0) return null

    const normalized = {
        type,
        count,
        source: boundedString(message.source, 'source', maxStringLength, {required: true}),
        id: boundedString(message.id, 'id', maxStringLength),
        displayName: boundedString(message.displayName, 'displayName', maxStringLength),
        trigger: boundedString(message.trigger, 'trigger', maxStringLength),
        prod: productionData
    }

    return Object.fromEntries(
        Object.entries(normalized).filter(([_key, value]) => value !== undefined)
    )
}

export function normalizeFirebaseActivity(activityData, {
    productionData,
    maxBatchSize = 100,
    maxStringLength = 500
}) {
    const messages = Array.isArray(activityData) ? activityData : [activityData]
    if (activityData === undefined || messages.length === 0) {
        throw activityError('firebase_activity_required', 'activityData is required')
    }
    if (messages.length > maxBatchSize) {
        throw activityError(
            'firebase_activity_batch_too_large',
            `activityData must not contain more than ${maxBatchSize} entries`,
            413
        )
    }

    return messages
        .map(message => normalizeMessage(message, {productionData, maxStringLength}))
        .filter(Boolean)
}

export async function logFirebaseActivity(messages, {activityLogger = log} = {}) {
    const entries = Array.isArray(messages) ? messages : [messages]
    entries.forEach(message => activityLogger.info(message, 'firebase accessed'))
}

export function createFirebaseActivityHandler({
    productionData,
    maxBatchSize,
    maxStringLength,
    activityLogger = logFirebaseActivity
}) {
    return async function handleFirebaseActivityPost(req, res, next) {
        try {
            const messages = normalizeFirebaseActivity(req.body?.activityData, {
                productionData,
                maxBatchSize,
                maxStringLength
            })
            await activityLogger(messages)
            //log.info({requestId: req.id, activityCount: messages.length}, 'Firebase activity accepted')
            return res.status(200).json('Activity Logged')
        } catch (error) {
            log.error({err: error, requestId: req.id}, 'Firebase activity logging failed')
            return next(error)
        }
    }
}

export default async function handleFirebaseActivityPost(req, res, next) {
    const {getDefaultFirebaseActivityHandler} = await import('./firebaseActivityRuntime.js')
    return (await getDefaultFirebaseActivityHandler())(req, res, next)
}
