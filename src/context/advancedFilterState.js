import {
    hasConcreteAdvancedValues,
    hasNonEmptyValue
} from './filterUrlState.js'

function cloneGroup(group, id) {
    return {
        ...group,
        _id: id,
        values: Array.isArray(group?.values) ? [...group.values] : []
    }
}

function createRowId(group, previousRows, createId) {
    const previous = previousRows.find(row => (
        group?.fieldName
        && row?.fieldName === group.fieldName
        && row?._id
    ))
    return group?._id || previous?._id || createId()
}

export function reconcileAdvancedFilterRows({
    activeGroups = [],
    draftRows = [],
    previousRows = [],
    createId
}) {
    const nextId = typeof createId === 'function'
        ? createId
        : () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const occupiedFields = new Set()
    const consumedDraftRows = new Set()
    const rows = []

    activeGroups.forEach(group => {
        if (!hasConcreteAdvancedValues(group) || occupiedFields.has(group.fieldName)) return
        const draftRow = draftRows.find((draft, index) => {
            if (consumedDraftRows.has(index) || draft?.fieldName !== group.fieldName) return false
            const draftValues = Array.isArray(draft.values)
                ? draft.values.filter(hasNonEmptyValue)
                : []
            const operatorMatches = group.values.length < 2
                || draft.operator === group.operator
            return hasConcreteAdvancedValues(draft)
                && draft.matchType === group.matchType
                && operatorMatches
                && draftValues.length === group.values.length
                && draftValues.every((value, valueIndex) => (
                    String(value) === String(group.values[valueIndex])
                ))
        })
        if (draftRow) consumedDraftRows.add(draftRows.indexOf(draftRow))
        occupiedFields.add(group.fieldName)
        rows.push(cloneGroup({
            ...group,
            operator: draftRow?.operator || group.operator,
            values: draftRow?.values || group.values
        }, createRowId(draftRow || group, previousRows, nextId)))
    })

    draftRows.forEach((group, index) => {
        if (consumedDraftRows.has(index)) return
        if (!group || hasConcreteAdvancedValues(group)) return
        if (group.fieldName && occupiedFields.has(group.fieldName)) return
        if (group.fieldName) occupiedFields.add(group.fieldName)
        rows.push(cloneGroup(group, createRowId(group, previousRows, nextId)))
    })

    return rows
}

export function changeAdvancedFilterRow({rows = [], rowId, changes = {}}) {
    const rowIndex = rows.findIndex(row => row?._id === rowId)
    if (rowIndex < 0) return rows

    const current = rows[rowIndex]
    const fieldChanged = changes.fieldName !== undefined
        && changes.fieldName !== current.fieldName
    const next = {
        ...current,
        ...changes,
        _id: current._id
    }

    if (fieldChanged && changes.values === undefined) next.values = []
    if (Array.isArray(next.values)) next.values = [...next.values]

    const duplicateField = next.fieldName && rows.some((row, index) => (
        index !== rowIndex && row?.fieldName === next.fieldName
    ))
    if (duplicateField) return rows

    return rows.map((row, index) => index === rowIndex ? next : row)
}

export function removeAdvancedFilterRow({rows = [], rowId}) {
    return rows.filter(row => row?._id !== rowId)
}

export function addAdvancedFilterGroup({
    rows = [],
    fieldName,
    valueToAdd,
    operator,
    matchType,
    createId
}) {
    if (!fieldName || !hasNonEmptyValue(valueToAdd)) return rows

    const existingIndex = rows.findIndex(row => row?.fieldName === fieldName)
    if (existingIndex >= 0) {
        const existing = rows[existingIndex]
        const values = Array.isArray(existing.values) ? existing.values : []
        if (values.includes(valueToAdd)) return rows

        const nextOperator = operator?.toUpperCase()
        const nextValues = nextOperator === 'OR' || nextOperator === 'AND'
            ? [...values, valueToAdd]
            : [valueToAdd]
        const nextMatchType = matchType
            ? (matchType.toUpperCase() === 'IS NOT' ? 'Is Not' : 'Is')
            : existing.matchType || 'Is'
        const next = {
            ...existing,
            operator: nextOperator === 'AND' ? 'AND' : 'OR',
            matchType: nextMatchType,
            values: nextValues
        }

        return rows.map((row, index) => index === existingIndex ? next : row)
    }

    const nextId = typeof createId === 'function'
        ? createId
        : () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    return [...rows, {
        _id: nextId(),
        fieldName,
        matchType: matchType?.toUpperCase() === 'IS NOT' ? 'Is Not' : 'Is',
        operator: operator?.toUpperCase() === 'AND' ? 'AND' : 'OR',
        values: [valueToAdd]
    }]
}

export function splitAdvancedFilterRows(rows = []) {
    return rows.reduce((result, row) => {
        if (!row) return result
        if (hasConcreteAdvancedValues(row)) {
            result.activeGroups.push({
                ...cloneGroup(row, row._id),
                values: row.values.filter(hasNonEmptyValue)
            })
            if (row.values.some(value => !hasNonEmptyValue(value))) {
                result.draftRows.push(cloneGroup(row, row._id))
            }
        } else {
            result.draftRows.push(cloneGroup(row, row._id))
        }
        return result
    }, {activeGroups: [], draftRows: []})
}
