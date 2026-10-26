const collectionTypes = ['own', 'picked', 'recorded', 'recordedLocks', 'wishlist']

function validId(value) {
    return typeof value === 'string' && value.trim() === value && value.length > 0
}

function prepareUpdates(updates) {
    if (!updates || !Array.isArray(updates.changes) || !Array.isArray(updates.deletions)) {
        throw new Error('updates must contain changes and deletions arrays')
    }

    const changes = new Map()
    const deletions = new Set()

    for (const change of updates.changes) {
        if (typeof change?.approved !== 'boolean') throw new Error('Each change needs a boolean approved value')
        if (!change.approved) continue
        if (!validId(change.from) || !validId(change.to) || change.from === change.to) {
            throw new Error('Approved Sameline changes need distinct, nonempty from and to IDs')
        }
        if (changes.has(change.from)) throw new Error(`Duplicate Sameline source ID: ${change.from}`)
        changes.set(change.from, change.to)
    }

    for (const deletion of updates.deletions) {
        if (typeof deletion?.approved !== 'boolean') throw new Error('Each deletion needs a boolean approved value')
        if (!deletion.approved) continue
        if (!validId(deletion.id)) throw new Error('Approved deletions need a nonempty ID')
        if (deletions.has(deletion.id)) throw new Error(`Duplicate deletion ID: ${deletion.id}`)
        deletions.add(deletion.id)
    }

    for (const [from, to] of changes) {
        if (deletions.has(from) || deletions.has(to) || changes.has(to)) {
            throw new Error(`Conflicting Sameline or Delete actions involving ${from} and ${to}`)
        }
    }

    return {changes, deletions, targetIds: [...changes.keys(), ...deletions]}
}

function updateCollection(ids, plan) {
    if (!Array.isArray(ids) || ids.some(id => !validId(id))) {
        throw new Error('Collection field must be an array of nonempty IDs')
    }
    if (!ids.some(id => plan.changes.has(id) || plan.deletions.has(id))) return null

    const destinations = new Set(plan.changes.values())
    const seenDestinations = new Set()
    const updated = []
    for (const id of ids) {
        if (plan.deletions.has(id)) continue
        const result = plan.changes.get(id) ?? id
        if (destinations.has(result)) {
            if (seenDestinations.has(result)) continue
            seenDestinations.add(result)
        }
        updated.push(result)
    }

    return updated.length === ids.length && updated.every((id, index) => id === ids[index])
        ? null
        : updated
}

function collectionPatch(data, plan) {
    const patch = {}
    for (const type of collectionTypes) {
        if (data[type] === undefined) continue
        const updated = updateCollection(data[type], plan)
        if (updated) patch[type] = updated
    }
    return patch
}

export {collectionPatch, collectionTypes, prepareUpdates, updateCollection}
