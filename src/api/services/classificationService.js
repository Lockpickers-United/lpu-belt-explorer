import {createHash, randomUUID} from 'node:crypto'
import {buildEntryProjections, isCurrentVote, voteIdFor} from './classificationModel.js'

const operationTtlMs = 7 * 24 * 60 * 60 * 1000

function apiError(status, code, message, recovery) {
    const error = new Error(message)
    error.status = status
    error.code = code
    if (recovery) error.recovery = recovery
    return error
}

function digest(value) {
    return createHash('sha256').update(JSON.stringify(value)).digest('hex')
}

function iso(value) {
    return value?.toDate?.().toISOString() ?? (value ? new Date(value).toISOString() : null)
}

function dateFields(record, fields) {
    const result = {...record}
    for (const field of fields) result[field] = iso(record[field])
    return result
}

function requireRevision(record, expectedRevision, current) {
    if (record.revision !== expectedRevision) {
        throw apiError(409, 'revision_conflict', 'The record has changed', {current})
    }
}

function asAction(record) {
    return dateFields(record, ['createdAt', 'updatedAt', 'lastPublishedAt'])
}

function asVote(record) {
    const {
        id, entryId, userId, displayName, votedBelt, comment, mediaUrl,
        createdAt, updatedAt, revision
    } = record
    return {
        id, entryId, userId, displayName, votedBelt,
        comment: comment ?? null,
        mediaUrl: mediaUrl ?? null,
        createdAt: iso(createdAt),
        updatedAt: iso(updatedAt ?? createdAt),
        revision
    }
}

function profileDisplayName(snapshot) {
    const name = snapshot?.data()?.displayName
    return typeof name === 'string' && name.trim() ? name.slice(0, 128) : 'no display name'
}

function cleanActionInput(value) {
    return {
        status: value.status,
        action: value.action ?? null,
        updatedBelt: value.updatedBelt ?? null,
        samelineTargetId: value.samelineTargetId ?? null,
        note: value.note ?? null,
        adminNote: value.adminNote ?? null,
        omitChangelog: value.omitChangelog ?? false
    }
}

export function createClassificationService({db, getCatalogEntry, clock = () => new Date()}) {
    const votesRef = db.collection('classificationVotes')
    const profilesRef = db.collection('lockcollections')
    const entriesRef = db.collection('classificationEntries')
    const statesRef = db.collection('classificationEntryStates')
    const actionsRef = db.collection('classificationActions')
    const publicationsRef = db.collection('classificationPublications')
    const operationsRef = db.collection('classificationOperations')

    function catalogEntry(entryId) {
        const entry = getCatalogEntry(entryId)
        if (!entry) throw apiError(404, 'entry_not_found', 'Lock entry not found')
        return entry
    }

    async function command(kind, actor, key, input, work) {
        const operationId = digest([actor.uid, key])
        const requestDigest = digest([kind, input])
        const now = clock()
        return db.runTransaction(async tx => {
            const operationRef = operationsRef.doc(operationId)
            const existing = await tx.get(operationRef)
            if (existing.exists) {
                const previous = existing.data()
                if (previous.requestDigest !== requestDigest) {
                    throw apiError(409, 'idempotency_conflict', 'Idempotency key already used')
                }
                return previous.response
            }
            const response = await work(tx, now)
            tx.set(operationRef, {
                kind,
                actorId: actor.uid,
                requestDigest,
                response,
                completedAt: now,
                expiresAt: new Date(now.getTime() + operationTtlMs)
            })
            return response
        })
    }

    async function readEntryVotes(tx, entryId) {
        const snapshot = await tx.get(votesRef.where('entryId', '==', entryId))
        return snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}))
    }

    function writeProjections(tx, entryId, votes, previous, action, now) {
        const {summary, state} = buildEntryProjections(entryId, votes, previous, action, now)
        tx.set(entriesRef.doc(entryId), summary)
        tx.set(statesRef.doc(entryId), state)
        return summary
    }

    function activeAction(previous) {
        return previous.currentActionId
            ? {id: previous.currentActionId, status: previous.currentActionStatus} : null
    }

    async function createVote(actor, key, input) {
        const id = voteIdFor(input.entryId, actor.uid)
        return command('vote.create', actor, key, input, async (tx, now) => {
            catalogEntry(input.entryId)
            const voteRef = votesRef.doc(id)
            const [existing, entrySnapshot, profileSnapshot, votes] = await Promise.all([
                tx.get(voteRef), tx.get(entriesRef.doc(input.entryId)),
                tx.get(profilesRef.doc(actor.uid)),
                readEntryVotes(tx, input.entryId)
            ])
            if (existing.exists) {
                throw apiError(409, 'duplicate_vote', 'Vote already exists',
                    {current: asVote(existing.data())})
            }
            const previous = entrySnapshot.data() ?? {}
            if (previous.lastDecisionStatus === 'Settled' && !previous.reopened) {
                throw apiError(409, 'entry_settled', 'New votes are closed for this lock')
            }
            const vote = {
                id,
                entryId: input.entryId,
                userId: actor.uid,
                displayName: profileDisplayName(profileSnapshot),
                votedBelt: input.votedBelt,
                comment: input.comment ?? null,
                mediaUrl: input.mediaUrl ?? null,
                source: 'site',
                sourceId: null,
                createdAt: now,
                updatedAt: now,
                revision: 1
            }
            const summary = writeProjections(tx, input.entryId, [...votes, vote], previous,
                activeAction(previous), now)
            tx.create(voteRef, vote)
            return {vote: asVote(vote), entryRevision: summary.revision}
        })
    }

    async function editVote(actor, key, voteId, input, isAdmin) {
        return command('vote.edit', actor, key, {voteId, input}, async (tx, now) => {
            const voteRef = votesRef.doc(voteId)
            const existing = await tx.get(voteRef)
            if (!existing.exists) throw apiError(404, 'vote_not_found', 'Vote not found')
            const old = existing.data()
            if (old.userId !== actor.uid && !isAdmin) throw apiError(403, 'forbidden', 'Forbidden')
            requireRevision(old, input.expectedRevision, asVote(old))
            const [entrySnapshot, votes, profileSnapshot] = await Promise.all([
                tx.get(entriesRef.doc(old.entryId)), readEntryVotes(tx, old.entryId),
                old.userId === actor.uid ? tx.get(profilesRef.doc(actor.uid)) : null
            ])
            const previous = entrySnapshot.data() ?? {}
            const vote = {
                ...old,
                displayName: profileSnapshot ? profileDisplayName(profileSnapshot) : old.displayName,
                votedBelt: input.votedBelt,
                comment: input.comment ?? null,
                mediaUrl: input.mediaUrl ?? null,
                updatedAt: now,
                revision: old.revision + 1
            }
            const updatedVotes = votes.map(item => item.id === voteId ? vote : item)
            const summary = writeProjections(tx, old.entryId, updatedVotes, previous,
                activeAction(previous), now)
            tx.set(voteRef, vote)
            return {vote: asVote(vote), entryRevision: summary.revision}
        })
    }

    async function moveVote(actor, key, voteId, input) {
        return command('vote.move', actor, key, {voteId, input}, async (tx, now) => {
            const sourceRef = votesRef.doc(voteId)
            const existing = await tx.get(sourceRef)
            if (!existing.exists) throw apiError(404, 'vote_not_found', 'Vote not found')
            const old = existing.data()
            requireRevision(old, input.expectedRevision, asVote(old))
            if (old.entryId === input.entryId) {
                throw apiError(400, 'same_entry', 'Vote is already on this lock')
            }
            catalogEntry(input.entryId)

            const destinationRef = votesRef.doc(voteIdFor(input.entryId, old.userId))
            const [destination, sourceEntry, destinationEntry, sourceVotes, destinationVotes] =
                await Promise.all([
                    tx.get(destinationRef), tx.get(entriesRef.doc(old.entryId)),
                    tx.get(entriesRef.doc(input.entryId)), readEntryVotes(tx, old.entryId),
                    readEntryVotes(tx, input.entryId)
                ])
            if (destination.exists) {
                throw apiError(409, 'duplicate_vote', 'This member already voted on the target lock',
                    {current: asVote(destination.data())})
            }
            const sourcePrevious = sourceEntry.data() ?? {}
            const destinationPrevious = destinationEntry.data() ?? {}
            if (destinationPrevious.lastDecisionStatus === 'Settled' && !destinationPrevious.reopened) {
                throw apiError(409, 'entry_settled', 'New votes are closed for this lock')
            }

            const vote = {
                ...old,
                id: destinationRef.id,
                entryId: input.entryId,
                updatedAt: now,
                revision: 1
            }
            const sourceSummary = writeProjections(tx, old.entryId,
                sourceVotes.filter(item => item.id !== voteId), sourcePrevious,
                activeAction(sourcePrevious), now)
            const destinationSummary = writeProjections(tx, input.entryId,
                [...destinationVotes, vote], destinationPrevious,
                activeAction(destinationPrevious), now)
            tx.delete(sourceRef)
            tx.create(destinationRef, vote)
            return {
                vote: asVote(vote), sourceEntryRevision: sourceSummary.revision,
                entryRevision: destinationSummary.revision
            }
        })
    }

    async function deleteVote(actor, key, voteId, expectedRevision, isAdmin) {
        return command('vote.delete', actor, key, {voteId, expectedRevision}, async (tx, now) => {
            const voteRef = votesRef.doc(voteId)
            const existing = await tx.get(voteRef)
            if (!existing.exists) throw apiError(404, 'vote_not_found', 'Vote not found')
            const old = existing.data()
            if (old.userId !== actor.uid && !isAdmin) throw apiError(403, 'forbidden', 'Forbidden')
            requireRevision(old, expectedRevision, asVote(old))
            const [entrySnapshot, votes] = await Promise.all([
                tx.get(entriesRef.doc(old.entryId)), readEntryVotes(tx, old.entryId)
            ])
            const previous = entrySnapshot.data() ?? {}
            const summary = writeProjections(tx, old.entryId,
                votes.filter(item => item.id !== voteId), previous, activeAction(previous), now)
            tx.delete(voteRef)
            return {id: voteId, entryRevision: summary.revision}
        })
    }

    function validateDecision(entryId, input) {
        if (input.action === 'Sameline') {
            if (input.samelineTargetId === entryId) {
                throw apiError(400, 'invalid_sameline_target', 'A lock cannot be samelined with itself')
            }
            catalogEntry(input.samelineTargetId)
        }
    }

    function changedEntryStatus(previous, oldStatus, newStatus, now) {
        if (newStatus === 'Re-opened') return {...previous, reopened: true}
        if (newStatus === 'Settled' && oldStatus !== 'Settled') {
            return {...previous, reopened: false, decisionMilestoneAt: now,
                lastDecisionStatus: 'Settled'}
        }
        return previous
    }

    async function createAction(actor, key, input) {
        return command('action.create', actor, key, input, async (tx, now) => {
            catalogEntry(input.entryId)
            validateDecision(input.entryId, input)
            const [entrySnapshot, votes] = await Promise.all([
                tx.get(entriesRef.doc(input.entryId)), readEntryVotes(tx, input.entryId)
            ])
            const previous = entrySnapshot.data() ?? {}
            if (previous.currentActionId) {
                throw apiError(409, 'active_action_exists', 'This lock already has an editable action')
            }
            const id = randomUUID()
            const action = {
                id,
                entryId: input.entryId,
                actorId: actor.uid,
                ...cleanActionInput(input),
                createdAt: now,
                updatedAt: now,
                lastPublishedAt: null,
                publicationId: null,
                revision: 1
            }
            const nextEntry = changedEntryStatus(previous, null, action.status, now)
            const summary = writeProjections(tx, input.entryId, votes, nextEntry, action, now)
            tx.create(actionsRef.doc(id), action)
            return {action: asAction(action), entryRevision: summary.revision}
        })
    }

    async function editAction(actor, key, actionId, input) {
        return command('action.edit', actor, key, {actionId, input}, async (tx, now) => {
            const actionRef = actionsRef.doc(actionId)
            const existing = await tx.get(actionRef)
            if (!existing.exists) throw apiError(404, 'action_not_found', 'Action not found')
            const old = existing.data()
            if (old.status === 'Published') {
                throw apiError(409, 'published_action_immutable', 'Published actions cannot be edited')
            }
            requireRevision(old, input.expectedRevision, asAction(old))
            validateDecision(old.entryId, input)
            const [entrySnapshot, votes] = await Promise.all([
                tx.get(entriesRef.doc(old.entryId)), readEntryVotes(tx, old.entryId)
            ])
            const previous = entrySnapshot.data() ?? {}
            if (previous.currentActionId !== actionId) {
                throw apiError(409, 'action_not_current', 'Action is not current')
            }
            const action = {
                ...old,
                ...cleanActionInput(input),
                updatedAt: now,
                revision: old.revision + 1
            }
            const nextEntry = changedEntryStatus(previous, old.status, action.status, now)
            const summary = writeProjections(tx, old.entryId, votes, nextEntry, action, now)
            tx.set(actionRef, action)
            return {action: asAction(action), entryRevision: summary.revision}
        })
    }

    async function deleteAction(actor, key, actionId, expectedRevision) {
        return command('action.delete', actor, key, {actionId, expectedRevision}, async (tx, now) => {
            const actionRef = actionsRef.doc(actionId)
            const existing = await tx.get(actionRef)
            if (!existing.exists) throw apiError(404, 'action_not_found', 'Action not found')
            const old = existing.data()
            if (old.status === 'Published') {
                throw apiError(409, 'published_action_immutable', 'Published actions cannot be deleted')
            }
            requireRevision(old, expectedRevision, asAction(old))
            const [entrySnapshot, votes] = await Promise.all([
                tx.get(entriesRef.doc(old.entryId)), readEntryVotes(tx, old.entryId)
            ])
            const previous = entrySnapshot.data() ?? {}
            if (previous.currentActionId !== actionId) {
                throw apiError(409, 'action_not_current', 'Action is not current')
            }
            const summary = writeProjections(tx, old.entryId, votes, previous, null, now)
            tx.delete(actionRef)
            return {id: actionId, entryRevision: summary.revision}
        })
    }

    function publicationSnapshot(action) {
        const entry = catalogEntry(action.entryId)
        const target = action.samelineTargetId
            ? catalogEntry(action.samelineTargetId) : null
        return {
            actionId: action.id,
            entryId: action.entryId,
            entryName: entry.name,
            previousBelt: entry.belt,
            action: action.action,
            updatedBelt: action.updatedBelt,
            samelineTargetId: action.samelineTargetId,
            samelineTargetName: target?.name ?? null,
            note: action.note
        }
    }

    async function publish(actor, key, request, kind) {
        return command(`publication.${kind}`, actor, key, request, async (tx, now) => {
            if (kind === 'single') {
                catalogEntry(request.entryId)
                validateDecision(request.entryId, request)
            }
            const specs = kind === 'batch' ? request.actions : [{
                actionId: request.actionId, expectedRevision: request.expectedRevision
            }]
            if (new Set(specs.map(spec => spec.actionId)).size !== specs.length) {
                throw apiError(400, 'duplicate_action', 'An action appears more than once')
            }
            const actionSnapshots = await Promise.all(specs.map(spec => spec.actionId
                ? tx.get(actionsRef.doc(spec.actionId)) : Promise.resolve(null)))
            const oldActions = actionSnapshots.map((snapshot, index) => {
                if (kind === 'single' && !specs[index].actionId) return null
                if (!snapshot?.exists) throw apiError(404, 'action_not_found', 'Action not found')
                const action = snapshot.data()
                requireRevision(action, specs[index].expectedRevision, asAction(action))
                if (action.status === 'Published') {
                    throw apiError(409, 'published_action_immutable', 'Action already published')
                }
                return action
            })
            if (kind === 'batch' && oldActions.some(action =>
                action.status !== 'Staged' || action.omitChangelog)) {
                throw apiError(409, 'action_not_publishable', 'Only included staged actions can publish')
            }
            if (kind === 'single' && oldActions[0] && oldActions[0].entryId !== request.entryId) {
                throw apiError(400, 'entry_mismatch', 'Action belongs to another lock')
            }
            const entryIds = kind === 'single' ? [request.entryId] : oldActions.map(action => action.entryId)
            if (new Set(entryIds).size !== entryIds.length) {
                throw apiError(409, 'duplicate_entry', 'Only one action per lock can publish')
            }
            const entryReads = await Promise.all(entryIds.map(async entryId => ({
                entryId,
                entrySnapshot: await tx.get(entriesRef.doc(entryId)),
                votes: await readEntryVotes(tx, entryId)
            })))
            const publicationId = randomUUID()
            const actions = oldActions.map(old => {
                if (kind === 'batch') return old
                return {
                    ...(old ?? {
                        id: randomUUID(), entryId: request.entryId, actorId: actor.uid,
                        createdAt: now, revision: 0
                    }),
                    ...cleanActionInput({...request, status: 'Staged'}),
                    updatedAt: now
                }
            })
            for (let index = 0; index < actions.length; index++) {
                const action = actions[index]
                const {entryId, entrySnapshot, votes} = entryReads[index]
                const previous = entrySnapshot.data() ?? {}
                if (previous.currentActionId && previous.currentActionId !== action.id) {
                    throw apiError(409, 'active_action_exists', 'Another editable action exists')
                }
                const published = {
                    ...action,
                    status: 'Published',
                    publicationId,
                    lastPublishedAt: now,
                    updatedAt: now,
                    revision: action.revision + 1
                }
                actions[index] = published
                writeProjections(tx, entryId, votes, {
                    ...previous,
                    decisionMilestoneAt: now,
                    lastDecisionStatus: 'Published',
                    reopened: false
                }, null, now)
                tx.set(actionsRef.doc(published.id), published)
            }
            const publication = {
                id: publicationId,
                kind,
                actorId: actor.uid,
                lastPublishedAt: now,
                actions: actions.map(publicationSnapshot),
                catalogFingerprint: null
            }
            tx.create(publicationsRef.doc(publicationId), publication)
            return {publication: dateFields(publication, ['lastPublishedAt'])}
        })
    }

    function decodeCursor(cursor) {
        if (!cursor) return null
        try {
            const value = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'))
            if (typeof value.id !== 'string' || !/^[^/]{1,128}$/.test(value.id) ||
                !Number.isInteger(value.revision) || value.revision < 0) {
                throw new Error('Invalid cursor')
            }
            return value
        } catch {
            throw apiError(400, 'invalid_cursor', 'Invalid cursor')
        }
    }

    function encodeCursor(id, revision) {
        return Buffer.from(JSON.stringify({id, revision})).toString('base64url')
    }

    async function getEntryVotes(entryId, {limit = 25, cursor = null} = {}) {
        catalogEntry(entryId)
        const entrySnapshot = await entriesRef.doc(entryId).get()
        const entry = entrySnapshot.data() ?? {}
        const parsedCursor = decodeCursor(cursor)
        if (parsedCursor && parsedCursor.revision !== (entry.revision ?? 0)) {
            throw apiError(409, 'entry_changed', 'Votes changed while paging')
        }
        let query = votesRef.where('entryId', '==', entryId)
            .orderBy('updatedAt', 'desc').limit(limit + 1)
        if (parsedCursor) {
            const after = await votesRef.doc(parsedCursor.id).get()
            if (!after.exists || after.data().entryId !== entryId) {
                throw apiError(400, 'invalid_cursor', 'Invalid cursor')
            }
            query = query.startAfter(after)
        }
        const snapshot = await query.get()
        const docs = snapshot.docs.slice(0, limit)
        return {
            entryId,
            entryRevision: entry.revision ?? 0,
            decisionMilestoneAt: iso(entry.decisionMilestoneAt),
            reopened: entry.reopened ?? false,
            votes: docs.map(doc => ({
                ...asVote({id: doc.id, ...doc.data()}),
                isCurrent: isCurrentVote(doc.data(), entry.decisionMilestoneAt, entry.reopened)
            })),
            nextCursor: snapshot.docs.length > limit
                ? encodeCursor(docs.at(-1).id, entry.revision ?? 0) : null
        }
    }

    async function getCurrentAction(entryId) {
        catalogEntry(entryId)
        const entrySnapshot = await entriesRef.doc(entryId).get()
        const actionId = entrySnapshot.data()?.currentActionId
        if (!actionId) return null
        const actionSnapshot = await actionsRef.doc(actionId).get()
        return actionSnapshot.exists ? asAction(actionSnapshot.data()) : null
    }

    async function getStagedActions({limit = 25} = {}) {
        const snapshot = await actionsRef.where('status', '==', 'Staged')
            .where('omitChangelog', '==', false)
            .orderBy('updatedAt', 'desc').limit(limit).get()
        return snapshot.docs.map(doc => {
            const action = doc.data()
            const entry = catalogEntry(action.entryId)
            const visible = asAction(action)
            delete visible.adminNote
            return {...visible, entryName: entry.name}
        })
    }

    async function getPublications({limit = 25, cursor = null} = {}) {
        const parsedCursor = decodeCursor(cursor)
        let query = publicationsRef.orderBy('lastPublishedAt', 'desc').limit(limit + 1)
        if (parsedCursor) {
            const after = await publicationsRef.doc(parsedCursor.id).get()
            if (!after.exists) throw apiError(400, 'invalid_cursor', 'Invalid cursor')
            query = query.startAfter(after)
        }
        const snapshot = await query.get()
        const docs = snapshot.docs.slice(0, limit)
        return {
            publications: docs.map(doc => {
                const publication = doc.data()
                return {
                    id: doc.id,
                    lastPublishedAt: iso(publication.lastPublishedAt),
                    kind: publication.kind,
                    actionCount: publication.actions.length
                }
            }),
            nextCursor: snapshot.docs.length > limit ? encodeCursor(docs.at(-1).id, 0) : null
        }
    }

    async function getPublication(publicationId) {
        const snapshot = await publicationsRef.doc(publicationId).get()
        if (!snapshot.exists) throw apiError(404, 'publication_not_found', 'Publication not found')
        return dateFields(snapshot.data(), ['lastPublishedAt'])
    }

    return {
        createVote,
        editVote,
        moveVote,
        deleteVote,
        createAction,
        editAction,
        deleteAction,
        publishBatch: (actor, key, input) => publish(actor, key, input, 'batch'),
        publishSingle: (actor, key, input) => publish(actor, key, input, 'single'),
        getEntryVotes,
        getCurrentAction,
        getStagedActions,
        getPublications,
        getPublication
    }
}
