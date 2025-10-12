// Apply advanced filter groups to a list of entries.
// Each group: { fieldName, matchType: 'Is'|'Is Not', operator: 'OR'|'AND', values: [] }
// Semantics:
//  - Within a group: OR = any value matches; AND = all values match.
//  - matchType 'Is Not' negates the group's result.
//  - Across groups: all groups must pass (AND between groups).
// Supports partial application via optional groupIndex and valueIndex:
//  - If groupIndex is a finite number >= 0, only groups up to and including that index are applied.
//  - If valueIndex is a finite number >= 0, only values up to and including that index are applied on the last included group.

export default ({advancedFilterGroups, entries, groupIndex, valueIndex}) => {
    if (!entries || entries.length === 0) return []
    const groups = Array.isArray(advancedFilterGroups) ? advancedFilterGroups : []
    if (groups.length === 0 || groupIndex < 0) return entries

    const normalizeGroup = (g) => {
        if (!g || !g.fieldName) return null
        const fieldName = g.fieldName
        const values = Array.isArray(g.values) ? g.values.filter(v => v !== undefined && v !== null && String(v).length) : []
        if (values.length === 0) return null
        const operator = (g.operator || 'AND').toUpperCase() === 'OR' ? 'OR' : 'AND'
        const negative = (g.matchType || 'Is').toLowerCase() === 'is not'
        return {fieldName, values, operator, negative}
    }

    let usableGroups = groups.map(normalizeGroup).filter(Boolean)
    if (usableGroups.length === 0) return entries

    // Apply partial slicing for groupIndex
    if (Number.isFinite(groupIndex) && groupIndex >= 0) {
        usableGroups = usableGroups.slice(0, Math.min(groupIndex + 1, usableGroups.length))
    }

    // Apply partial slicing for valueIndex on the last included group
    if (usableGroups.length > 0 && Number.isFinite(valueIndex) && valueIndex >= 0) {
        const lastIdx = usableGroups.length - 1
        const g = usableGroups[lastIdx]
        if (Array.isArray(g.values) && g.values.length > 0) {
            g.values = g.values.slice(0, Math.min(valueIndex + 1, g.values.length))
        }
    }

    return entries.filter(datum => {
        return usableGroups.every(({fieldName, values, operator, negative}) => {
            const datumVal = datum[fieldName]
            const matcher = (val) => Array.isArray(datumVal) ? datumVal.includes(val) : datumVal === val
            const anyMatch = values.some(v => matcher(v))
            const allMatch = values.every(v => matcher(v))
            const groupMatch = operator === 'OR' ? anyMatch : allMatch
            return negative ? !groupMatch : groupMatch
        })
    })
}

