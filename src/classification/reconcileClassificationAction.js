export default function reconcileClassificationAction(action, catalogById) {
    const source = catalogById.get(action.entryId)
    const target = action.samelineTargetId ? catalogById.get(action.samelineTargetId) : null

    if (action.action === 'Belt Change') {
        if (!action.updatedBelt || !source) return {status: 'Needs review', detail: 'Missing belt or catalog lock'}
        return source.belt === action.updatedBelt
            ? {status: 'Matches catalog', detail: `Current belt: ${source.belt}`}
            : {status: 'Awaiting import', detail: `Current belt: ${source.belt}; intended: ${action.updatedBelt}`}
    }
    if (action.action === 'Delete') {
        return source
            ? {status: 'Awaiting import', detail: `Lock is still present at ${source.belt}`}
            : {status: 'Matches catalog', detail: 'Lock is absent'}
    }
    if (action.action === 'Sameline') {
        if (!action.samelineTargetId || !target) {
            return {status: 'Needs review', detail: 'Sameline target is missing from the catalog'}
        }
        return source
            ? {status: 'Awaiting import', detail: `Source remains; retained target is ${target.belt}`}
            : {status: 'Matches catalog', detail: `Source is absent; retained target is ${target.belt}`}
    }
    if (action.action === 'Other') {
        return {status: 'Needs review', detail: 'Other change'}
    }
    return {status: 'Needs review', detail: 'Unknown action type'}
}
