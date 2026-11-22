import {createHash} from 'node:crypto'
import {z} from 'zod'

const schema = z.strictObject({
    source: z.literal('Reddit'),
    platform: z.literal('Reddit'),
    belt: z.enum(['White', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Brown', 'Red', 'Black']
        .map(color => `${color} Belt`).concat(Array.from({length: 20}, (_, index) => {
            const number = index + 1
            const suffix = number === 1 ? 'st' : number === 2 ? 'nd' : number === 3 ? 'rd' : 'th'
            return `${number}${suffix} Dan`
        }))),
    username: z.string().regex(/^[A-Za-z0-9_-]{1,32}$/),
    currentBelt: z.string().trim().min(1).max(128),
    requestId: z.string().regex(/^[a-zA-Z0-9]{1,64}$/),
    messageContent: z.string().trim().min(1).max(10000),
    syncTo: z.literal('Discord').optional(),
    syncUsername: z.string().trim().min(1).max(100).optional()
}).refine(value => Boolean(value.syncTo) === Boolean(value.syncUsername))

export function parseRedditBeltRequest(value) {
    const result = schema.safeParse(value)
    if (result.success) return result.data
    const error = new Error('Invalid Reddit belt request')
    error.status = 400
    error.code = 'belt_request_invalid'
    throw error
}

export async function saveRedditBeltRequest(db, input) {
    const data = parseRedditBeltRequest(input)
    // Hash validated fields in schema order so JSON property order does not affect retries.
    const id = 'reddit-' + createHash('sha256').update(JSON.stringify(data)).digest('hex')
    const ref = db.collection('belt-requests').doc(id)
    return db.runTransaction(async transaction => {
        const existing = await transaction.get(ref)
        if (existing.exists) return {id, created: false}
        const now = new Date().toISOString()
        transaction.set(ref, {...data, id, userId: `reddit-${data.username.toLowerCase()}`,
            status: 'incoming', dateAdded: now, lastUpdated: now, revision: 1})
        return {id, created: true}
    })
}
