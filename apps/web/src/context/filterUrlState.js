export const DEFAULT_NON_FILTER_KEYS = [
    'id',
    'name',
    'search',
    'tab',
    'sort',
    'image',
    'locks',
    'debug',
    'preview',
    'single',
    'expandAll',
    'dataset',
    'scorecardId',
    'cId',
    'dsId',
    'addNew',
    'tableSort',
    'tableSortDir',
]

export function buildFiltersFromSearchParams(searchParams) {
    const keys = Array.from(searchParams.keys())
    return keys.reduce((acc, key) => {
        const value = searchParams.getAll(key)
        acc[key] = value.length === 1 ? value[0] : value
        return acc
    }, {})
}

export function cleanFiltersObject(filters = {}) {
    return Object.entries(filters)
        .reduce((acc, [key, value]) => {
            if (Array.isArray(value)) {
                const values = value.filter(hasNonEmptyValue)
                if (values.length) acc[key] = values
            } else if (hasNonEmptyValue(value)) {
                acc[key] = value
            }
            return acc
        }, {})
}

export function countActiveFilterParams(searchParams, policy = DEFAULT_NON_FILTER_KEYS) {
    const allowedFilterKeys = getAllowedFilterKeys(policy)
    const skippedKeys = Array.isArray(policy) ? policy : DEFAULT_NON_FILTER_KEYS
    const keys = Array.from(new Set(searchParams.keys()))

    return keys.filter(key => {
        if (allowedFilterKeys ? !allowedFilterKeys.has(key) : skippedKeys.includes(key)) return false
        return searchParams.getAll(key).some(hasNonEmptyValue)
    }).length
}

export function parseFiltersToGroups(srcFilters = {}, policy = DEFAULT_NON_FILTER_KEYS) {
    const allowedFilterKeys = getAllowedFilterKeys(policy)
    const skippedKeys = Array.isArray(policy) ? policy : DEFAULT_NON_FILTER_KEYS

    return Object.keys(srcFilters)
        .filter(key => allowedFilterKeys ? allowedFilterKeys.has(key) : !skippedKeys.includes(key))
        .reduce((groups, key) => {
            const rawValues = Array.isArray(srcFilters[key])
                ? srcFilters[key]
                : [srcFilters[key]]
            const parsedGroups = rawValues
                .map(rawValue => parseFilterValue(key, rawValue))
                .filter(Boolean)

            if (parsedGroups.length === 0) return groups
            if (parsedGroups.length === 1) return [...groups, parsedGroups[0]]

            const first = parsedGroups[0]
            const compatibleScalars = parsedGroups.every(group => (
                group.matchType === first.matchType
                && group.values.length === 1
            ))
            if (!compatibleScalars) return [...groups, parsedGroups.at(-1)]

            return [...groups, {
                fieldName: key,
                matchType: first.matchType,
                operator: 'AND',
                values: Array.from(new Set(parsedGroups.flatMap(group => group.values)))
            }]
        }, [])
}

export function serializeAdvancedFilterGroups({
    groups = [],
    searchParams,
    allowedFilterKeys,
    filters = {},
    nonFilterKeys = DEFAULT_NON_FILTER_KEYS
}) {
    const managedFilterKeys = allowedFilterKeys !== undefined
        ? new Set(allowedFilterKeys)
        : null
    const sp = searchParams
        ? new URLSearchParams(searchParams)
        : buildLegacyPreservedSearchParams(filters, nonFilterKeys)

    managedFilterKeys?.forEach(key => sp.delete(key))

    const canonicalGroups = new Map()
    groups
        .filter(hasConcreteAdvancedValues)
        .filter(group => !managedFilterKeys || managedFilterKeys.has(group.fieldName))
        .forEach(group => canonicalGroups.set(group.fieldName, group))

    canonicalGroups.forEach(group => {
        const vals = group.values
            .filter(hasNonEmptyValue)
            .map(escapeFilterToken)
        const negative = (group.matchType || '').toLowerCase() === 'is not'
        const op = (group.operator || 'AND').toUpperCase()
        const delimiter = op === 'OR' ? '||' : '@@'
        const joined = `${negative ? '!' : ''}${vals.join(delimiter)}`
        sp.set(group.fieldName, joined)
    })

    return sp
}

export function hasConcreteAdvancedValues(group) {
    const values = Array.isArray(group?.values)
        ? group.values.filter(hasNonEmptyValue)
        : []
    return !!group?.fieldName && values.length > 0
}

export function hasDraftAdvancedState(group) {
    return !!group?.fieldName
        || (Array.isArray(group?.values) && group.values.some(hasNonEmptyValue))
}

export function hasNonEmptyValue(value) {
    return value !== undefined && value !== null && String(value).length > 0
}

function buildLegacyPreservedSearchParams(filters, nonFilterKeys) {
    const sp = new URLSearchParams()
    Object.entries(filters || {}).forEach(([key, value]) => {
        if (!nonFilterKeys.includes(key)) return
        if (Array.isArray(value)) {
            value.filter(hasNonEmptyValue).forEach(item => sp.append(key, String(item)))
        } else if (hasNonEmptyValue(value)) {
            sp.set(key, String(value))
        }
    })
    return sp
}

function getAllowedFilterKeys(policy) {
    if (!policy || Array.isArray(policy) || !Array.isArray(policy.allowedFilterKeys)) return null
    return new Set(policy.allowedFilterKeys)
}

function parseFilterValue(fieldName, rawValue) {
    if (typeof rawValue !== 'string') return null

    const negative = startsWithUnescapedBang(rawValue)
    const core = negative ? rawValue.slice(1) : rawValue
    const hasOr = includesUnescaped(core, '||')
    const hasAnd = !hasOr && includesUnescaped(core, '@@')
    const delimiter = hasOr ? '||' : hasAnd ? '@@' : null
    const values = delimiter
        ? splitEscaped(core, delimiter).map(unescapeFilterToken).filter(hasNonEmptyValue)
        : [unescapeFilterToken(core)].filter(hasNonEmptyValue)

    if (values.length === 0) return null
    return {
        fieldName,
        matchType: negative ? 'Is Not' : 'Is',
        operator: hasAnd ? 'AND' : 'OR',
        values
    }
}

function escapeFilterToken(value) {
    return String(value).replace(/[\\!|@]/g, '\\$&')
}

function unescapeFilterToken(value) {
    let result = ''
    const str = String(value)
    for (let index = 0; index < str.length; index += 1) {
        const char = str[index]
        const next = str[index + 1]
        if (char === '\\' && next && /[\\!|@]/.test(next)) {
            result += next
            index += 1
        } else {
            result += char
        }
    }
    return result
}

function splitEscaped(value, delimiter) {
    const parts = []
    let current = ''
    for (let index = 0; index < value.length; index += 1) {
        if (value.startsWith(delimiter, index) && !isEscaped(value, index)) {
            parts.push(current)
            current = ''
            index += delimiter.length - 1
        } else {
            current += value[index]
        }
    }
    parts.push(current)
    return parts
}

function includesUnescaped(value, delimiter) {
    for (let index = 0; index < value.length; index += 1) {
        if (value.startsWith(delimiter, index) && !isEscaped(value, index)) return true
    }
    return false
}

function startsWithUnescapedBang(value) {
    return typeof value === 'string' && value.startsWith('!')
}

function isEscaped(value, index) {
    let backslashCount = 0
    for (let i = index - 1; i >= 0 && value[i] === '\\'; i -= 1) {
        backslashCount += 1
    }
    return backslashCount % 2 === 1
}
