import {createHash} from 'node:crypto'
import {buildEntryProjections, voteBelts, voteIdFor} from './classificationModel.js'
import {voteCreateSchema} from './classificationSchemas.js'

const allowedBelts = new Set([...voteBelts, 'Unranked'])
const collections = [
    'classificationVotes', 'classificationEntries', 'classificationEntryStates',
    'classificationActions', 'classificationPublications', 'classificationOperations'
]

function sha256(bytes) {
    return createHash('sha256').update(bytes).digest('hex')
}

function requireIso(value, label) {
    if (typeof value !== 'string' || Number.isNaN(Date.parse(value))
        || new Date(value).toISOString() !== value) {
        throw new Error(`${label} must be an ISO timestamp`)
    }
    return new Date(value)
}

function parseJson(bytes, label) {
    try {
        return JSON.parse(bytes.toString('utf8'))
    } catch {
        throw new Error(`${label} is not valid JSON`)
    }
}

export function buildClassificationMigration({
    sourceBytes, catalogBytes, fullCatalogBytes, migrationTime, targetDatabaseId = 'lpubelts-dev'
}) {
    if (!['lpubelts-dev', '(default)'].includes(targetDatabaseId)) {
        throw new Error('Unsupported Classification migration database')
    }
    const source = parseJson(sourceBytes, 'Vote source')
    const catalog = parseJson(catalogBytes, 'Compact catalog')
    const migratedAt = requireIso(migrationTime, 'Migration time')
    if (!Array.isArray(source) || !source.length) throw new Error('Vote source must be a nonempty array')
    if (catalog?.schemaVersion !== 1 || !Array.isArray(catalog.entries)
        || !/^sha256:[a-f0-9]{64}$/.test(catalog.catalogVersion)) {
        throw new Error('Compact catalog has an invalid schema')
    }
    if (fullCatalogBytes && `sha256:${sha256(fullCatalogBytes)}` !== catalog.catalogVersion) {
        throw new Error('Full and compact catalog fingerprints differ')
    }

    const catalogEntries = new Map()
    for (const entry of catalog.entries) {
        if (!entry?.id || typeof entry.id !== 'string' || catalogEntries.has(entry.id)
            || !entry.name?.trim() || !allowedBelts.has(entry.belt)
            || (entry.currentBeltDate !== null && entry.currentBeltDate !== undefined
                && (typeof entry.currentBeltDate !== 'string'
                    || Number.isNaN(Date.parse(entry.currentBeltDate))
                    || new Date(entry.currentBeltDate).toISOString() !== entry.currentBeltDate))) {
            throw new Error(`Invalid or duplicate catalog entry: ${entry?.id ?? '(missing)'}`)
        }
        catalogEntries.set(entry.id, entry)
    }

    const votesByEntry = new Map()
    const sourceIds = new Set()
    const voteIds = new Set()
    const syntheticUsers = new Map()
    const mapping = []
    const documents = []
    for (const record of source) {
        if (record?.type !== 'vote' || record.source !== 'sheet'
            || typeof record.id !== 'string' || !record.id.trim()
            || typeof record.userId !== 'string' || !record.userId.trim()
            || record.userId.length > 128 || record.userId.includes('/')
            || typeof record.displayName !== 'string' || !record.displayName.trim()
            || record.displayName.length > 128) {
            throw new Error(`Invalid vote identity or source: ${record?.id ?? '(missing)'}`)
        }
        if (sourceIds.has(record.id)) throw new Error(`Duplicate source ID: ${record.id}`)
        sourceIds.add(record.id)
        const input = voteCreateSchema.safeParse({
            entryId: record.entryId, votedBelt: record.votedBelt,
            comment: record.comment ?? null, mediaUrl: record.mediaUrl ?? null
        })
        if (!input.success) throw new Error(`Invalid vote fields: ${record.id}`)
        if (!catalogEntries.has(record.entryId)) throw new Error(`Missing catalog entry: ${record.entryId}`)
        const createdAt = requireIso(record.createdAt, `Vote ${record.id} createdAt`)
        const updatedAt = record.updatedAt
            ? requireIso(record.updatedAt, `Vote ${record.id} updatedAt`) : createdAt
        if (updatedAt < createdAt) throw new Error(`Vote update precedes creation: ${record.id}`)
        const id = voteIdFor(record.entryId, record.userId)
        if (voteIds.has(id)) throw new Error(`Duplicate entry/user pair: ${record.entryId}/${record.userId}`)
        voteIds.add(id)
        const vote = {
            id, entryId: record.entryId, userId: record.userId,
            displayName: record.displayName, votedBelt: record.votedBelt,
            comment: input.data.comment ?? null, mediaUrl: input.data.mediaUrl ?? null,
            createdAt, updatedAt, revision: 1, sourceId: record.id, source: record.source
        }
        if (!votesByEntry.has(record.entryId)) votesByEntry.set(record.entryId, [])
        votesByEntry.get(record.entryId).push(vote)
        mapping.push({sourceId: record.id, voteId: id, entryId: record.entryId, userId: record.userId})
        documents.push({collection: 'classificationVotes', id, data: vote})
        if (record.userId.startsWith('u_')) {
            const existingName = syntheticUsers.get(record.userId)
            if (existingName && existingName !== record.displayName) {
                throw new Error(`Synthetic user has conflicting names: ${record.userId}`)
            }
            syntheticUsers.set(record.userId, record.displayName)
        }
    }

    const projectedEntryIds = new Set(votesByEntry.keys())
    for (const entry of catalogEntries.values()) {
        if (entry.belt !== 'Unranked' && entry.currentBeltDate) projectedEntryIds.add(entry.id)
    }
    let seededMilestones = 0
    let previousVotes = 0
    for (const entryId of projectedEntryIds) {
        const votes = votesByEntry.get(entryId) ?? []
        if (votes.length + 2 > 500) {
            throw new Error(`Entry ${entryId} exceeds a Firestore batch's write limit`)
        }
        const entry = catalogEntries.get(entryId)
        const milestone = entry.belt !== 'Unranked' && entry.currentBeltDate
            ? requireIso(entry.currentBeltDate, `Catalog ${entryId} currentBeltDate`) : null
        if (milestone) seededMilestones++
        const {summary, state} = buildEntryProjections(entryId, votes, {
            decisionMilestoneAt: milestone,
            lastDecisionStatus: null,
            reopened: false
        }, null, migratedAt)
        previousVotes += summary.previousVoteChips.length
        documents.push({collection: 'classificationEntries', id: entryId, data: summary})
        documents.push({collection: 'classificationEntryStates', id: entryId, data: state})
    }
    documents.sort((a, b) => a.collection.localeCompare(b.collection) || a.id.localeCompare(b.id))
    mapping.sort((a, b) => a.sourceId.localeCompare(b.sourceId))

    const manifest = {
        schemaVersion: 1,
        target: {projectId: 'lpu-belt-explorer', databaseId: targetDatabaseId},
        migrationTime: migratedAt.toISOString(),
        sourceSha256: sha256(sourceBytes),
        catalogSha256: sha256(catalogBytes),
        catalogVersion: catalog.catalogVersion,
        counts: {
            votes: source.length, voteEntries: votesByEntry.size,
            entries: projectedEntryIds.size, entryStates: projectedEntryIds.size,
            seededMilestones, previousVotes,
            syntheticUsers: syntheticUsers.size,
            actions: 0, publications: 0, operations: 0
        },
        sourceMapping: mapping,
        syntheticUserMapping: [...syntheticUsers].sort(([a], [b]) => a.localeCompare(b))
            .map(([userId, displayName]) => ({userId, displayName})),
        createdDocumentIds: Object.fromEntries(collections.map(collection => [
            collection, documents.filter(doc => doc.collection === collection).map(doc => doc.id)
        ]))
    }
    manifest.planSha256 = sha256(Buffer.from(JSON.stringify(documents)))
    return {manifest, documents}
}

export function assertProductionTarget(env) {
    if (env.NODE_ENV !== 'production' || env.LPU_JOB_ENV !== 'production'
        || env.FIREBASE_PROJECT_ID !== 'lpu-belt-explorer'
        || env.FIRESTORE_DATABASE_ID !== '(default)'
        || env.ALLOW_PRODUCTION_JOB !== 'true'
        || env.FIRESTORE_EMULATOR_HOST) {
        throw new Error('Migration requires the real lpu-belt-explorer/(default) production target')
    }
}

export function assertDevelopmentTarget(env) {
    if (env.NODE_ENV !== 'development' || env.LPU_JOB_ENV !== 'development'
        || env.FIREBASE_PROJECT_ID !== 'lpu-belt-explorer'
        || env.FIRESTORE_DATABASE_ID !== 'lpubelts-dev'
        || env.ALLOW_PRODUCTION_JOB === 'true'
        || env.FIRESTORE_EMULATOR_HOST) {
        throw new Error('Migration requires the real lpu-belt-explorer/lpubelts-dev development target')
    }
}

function normalized(value) {
    if (value instanceof Date) return value.toISOString()
    if (value && typeof value.toDate === 'function') return value.toDate().toISOString()
    if (Array.isArray(value)) return value.map(normalized)
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.keys(value).sort().map(key => [key, normalized(value[key])]))
    }
    return value
}

function stableJson(value) {
    return JSON.stringify(normalized(value))
}

export async function inspectClassificationTarget(db, documents) {
    const conflicts = []
    const matching = []
    const absent = []
    const planned = new Map(documents.map(doc => [`${doc.collection}/${doc.id}`, doc]))
    const found = new Set()
    for (const collection of collections) {
        const snapshot = await db.collection(collection).get()
        for (const doc of snapshot.docs) {
            const key = `${collection}/${doc.id}`
            found.add(key)
            const expected = planned.get(key)
            if (expected && stableJson(doc.data()) === stableJson(expected.data)) matching.push(key)
            else conflicts.push(key)
        }
    }
    for (const key of planned.keys()) if (!found.has(key)) absent.push(key)
    return {absent, matching, conflicts}
}

export async function applyClassificationMigration(db, documents, inspected) {
    if (inspected.conflicts.length) throw new Error('Import target has conflicting documents')
    const absent = new Set(inspected.absent)
    let created = 0
    const byEntry = new Map()
    for (const doc of documents) {
        const entryId = doc.data.entryId
        if (!byEntry.has(entryId)) byEntry.set(entryId, [])
        byEntry.get(entryId).push(doc)
    }
    for (const entryDocuments of byEntry.values()) {
        const missing = entryDocuments.filter(doc => absent.has(`${doc.collection}/${doc.id}`))
        if (!missing.length) continue
        const batch = db.batch()
        for (const doc of missing) {
            batch.create(db.collection(doc.collection).doc(doc.id), doc.data)
        }
        await batch.commit()
        created += missing.length
    }
    return created
}
