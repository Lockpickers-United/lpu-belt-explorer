import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useSearchParams} from 'react-router-dom'

const FilterContext = React.createContext({})

export function FilterProvider({children, filterFields = []}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const filters = useMemo(() => {
        const keys = Array.from(searchParams.keys())
        return keys.reduce((acc, key) => {
            const value = searchParams.getAll(key)
            acc[key] = value.length === 1 ? value[0] : value
            return acc
        }, {})
    }, [searchParams])

    const setFilters = useCallback(newFilters => {
        Object.keys(newFilters)
            .forEach(key => {
                if (!newFilters[key]) {
                    delete newFilters[key]
                }
            })
        setSearchParams(newFilters, {replace: true})
    }, [setSearchParams])

    const addFilters = useCallback((keyValues, replace) => {
        keyValues.forEach(({key, value}) => {
            if (!value && replace) {
                searchParams.delete(key)
            } else if (value) {
                if (replace) {
                    if (Array.isArray(value)) {
                        searchParams.delete(key)
                        value.forEach(v => searchParams.append(key, v))
                    } else {
                        searchParams.set(key, value)
                    }
                } else {
                    if (searchParams.has(key)) {
                        searchParams.append(key, value)
                    } else {
                        searchParams.set(key, value)
                    }
                }
            } else if (!value) {
                searchParams.delete(key)
            }
        })
        setSearchParams(searchParams, {replace: true})
    }, [searchParams, setSearchParams])

    const addFilter = useCallback((keyToAdd, valueToAdd, replace) => {
        return addFilters([{key: keyToAdd, value: valueToAdd}], replace)
    }, [addFilters])

    const removeFilters = useCallback(keysToDelete => {
        keysToDelete.forEach(key => searchParams.delete(key))
        setSearchParams(searchParams, {replace: true})
    }, [searchParams, setSearchParams])

    const removeFilter = useCallback((keyToDelete, valueToDelete) => {
        const currentValue = searchParams.getAll(keyToDelete)

        searchParams.delete(keyToDelete)
        if (Array.isArray(currentValue) && currentValue.length > 1) {
            const newValue = currentValue.filter(value => value !== valueToDelete)
            newValue.forEach(v => searchParams.append(keyToDelete, v))
        }
        setSearchParams(searchParams, {replace: true})
    }, [searchParams, setSearchParams])

    // Local state to preserve partially defined advanced filter groups (not yet in URL)
    const [advancedGroups, setAdvancedGroups] = useState(undefined)
    // When we push changes locally that result in no URL advanced filters (e.g., user cleared values
    // or changed the field), avoid resetting the UI back to a blank group. This ref lets the
    // URL->state sync know to skip clearing once when parsed filters are empty due to a local update.
    const skipEmptySyncRef = useRef(false)

    const clearFilters = useCallback(() => {
        const {tab, sort} = filters
        setFilters({tab, sort})
        setAdvancedGroups([])
    }, [filters, setFilters])

    const nonFilters = useMemo(() => [
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
        'scorecardId'
    ], [])

    const filterCount = useMemo(() => {
        const keys = Array.from(searchParams.keys())
        return keys.filter(key => !nonFilters.includes(key)).length
    }, [nonFilters, searchParams])

    const isSearch = !!filters?.search
    const isFiltered = (!!filters?.search || !!filters?.sort || filterCount > 0)

    // Helper: parse URL-style filters into Advanced Filter groups (no _id)
    const parseFiltersToGroups = useCallback((srcFilters, skipKeys) => {
        const groups = []
        Object.keys(srcFilters || {})
            .filter(key => !skipKeys.includes(key))
            .forEach(key => {
                const raw = srcFilters[key]
                const addGroupFromString = (str) => {
                    if (typeof str !== 'string') return
                    const negative = str.startsWith('!')
                    const core = negative ? str.slice(1) : str
                    const hasOr = core.includes('||')
                    const hasAnd = !hasOr && core.includes('@@')
                    const delimiter = hasOr ? '||' : hasAnd ? '@@' : null
                    const values = delimiter ? core.split(delimiter).filter(Boolean) : [core].filter(Boolean)
                    const operator = hasAnd ? 'AND' : 'OR'
                    groups.push({fieldName: key, matchType: negative ? 'Is Not' : 'Is', operator, values})
                }
                if (Array.isArray(raw)) {
                    const hasPipes = raw.some(v => typeof v === 'string' && (v.includes('||') || v.includes('@@')))
                    const allNeg = raw.every(v => typeof v === 'string' && v.startsWith('!'))
                    const noneNeg = raw.every(v => typeof v === 'string' && !v.startsWith('!'))
                    if (!hasPipes && (allNeg || noneNeg)) {
                        const negative = allNeg
                        const values = raw.map(v => (negative ? v.slice(1) : v)).filter(Boolean)
                        groups.push({fieldName: key, matchType: negative ? 'Is Not' : 'Is', operator: 'AND', values})
                    } else {
                        raw.forEach(addGroupFromString)
                    }
                } else {
                    addGroupFromString(raw)
                }
            })
        return groups
    }, [])

    // Convert current filters (from URL query string) into Advanced Filter objects
    const advancedFilterGroups = useCallback(() => {
        // If we have in-memory groups, prefer them (to keep partially defined groups visible)
        if (advancedGroups !== undefined) return advancedGroups
        return parseFiltersToGroups(filters, nonFilters)
    }, [advancedGroups, filters, nonFilters, parseFiltersToGroups])

    // Accept an array of Advanced Filter objects and set URL filters accordingly
    const setAdvancedFilterGroups = useCallback((groups = []) => {
        // Ensure each group has a stable unique _id for React keys/state isolation
        const withIds = groups.map(g => {
            if (!g) return g
            return g._id ? g : {...g, _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}
        })
        // Save locally (preserves partially defined groups)
        setAdvancedGroups(withIds)
        // Mark that this update originated locally so the sync effect doesn't clear
        // in-memory groups if the resulting URL has no advanced filters.
        skipEmptySyncRef.current = true

        const sp = new URLSearchParams()
        // Preserve existing non-filter params
        Object.entries(filters || {}).forEach(([key, val]) => {
            if (nonFilters.includes(key)) {
                if (Array.isArray(val)) {
                    val.forEach(v => {
                        if (v !== undefined && v !== null && String(v).length) sp.append(key, v)
                    })
                } else if (val !== undefined && val !== null && String(val).length) {
                    sp.set(key, String(val))
                }
            }
        })
        // Apply provided groups to URL only when they have concrete values
        withIds.forEach(g => {
            if (!g || !g.fieldName) return
            const vals = Array.isArray(g.values) ? g.values.filter(v => v !== undefined && v !== null && String(v).length) : []
            const negative = (g.matchType || '').toLowerCase() === 'is not'
            const op = (g.operator || 'AND').toUpperCase()
            if (op === 'OR') {
                if (vals.length) {
                    const joined = (negative ? '!' : '') + vals.join('||')
                    sp.set(g.fieldName, joined)
                }
            } else {
                if (vals.length) {
                    const joined = (negative ? '!' : '') + vals.join('@@')
                    sp.set(g.fieldName, joined)
                }
            }
        })
        setSearchParams(sp, {replace: true})
    }, [filters, nonFilters, setSearchParams])

    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
    const [hideAdvancedSearch, setHideAdvancedSearch] = useState(false)

    const addAdvancedFilterGroup = useCallback(({fieldName, valueToAdd, operator, matchType}) => {
        if (!fieldName || !valueToAdd) return
        setShowAdvancedSearch(true)
        const groups = [...advancedFilterGroups().filter(group => group.fieldName.length > 0)]

        const existingIndex = groups.findIndex(g => g.fieldName === fieldName && Array.isArray(g.values) && g.values.length > 0)
        if (existingIndex >= 0) {
            const existing = groups[existingIndex]
            if (existing.values.includes(valueToAdd)) return
            if (operator?.toUpperCase() === 'OR') {
                existing.operator = 'OR'
                groups[existingIndex] = {
                    ...existing,
                    values: [...existing.values, valueToAdd]
                }
            } else if (operator?.toUpperCase() === 'AND') {
                existing.operator = 'AND'
                groups[existingIndex] = {
                    ...existing,
                    values: [...existing.values, valueToAdd]
                }
            } else {
                groups[existingIndex] = {
                    ...existing,
                    values: [valueToAdd]
                }
            }
            setAdvancedFilterGroups(groups)
            return
        }

        const newGroup = {
            _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fieldName,
            matchType: matchType?.toUpperCase() === 'IS NOT' ? 'Is Not' : 'Is',
            operator: 'OR',
            values: [valueToAdd]
        }
        setAdvancedFilterGroups([...groups, newGroup])
    }, [advancedFilterGroups, setAdvancedFilterGroups, setShowAdvancedSearch])

    const clearAdvancedFilterGroups = useCallback(() => {

        setHideAdvancedSearch(true)
        setTimeout(() => {
            setShowAdvancedSearch(false)
            // We want the upcoming URL clear to be treated as external (authoritative),
            // so do not skip the empty sync.
            skipEmptySyncRef.current = false
        }, 0)
        setTimeout(() => {
            setAdvancedGroups([])
            clearFilters()
        }, 350)
        setTimeout(() => {
            setHideAdvancedSearch(false)
        }, 1000)

    }, [clearFilters])

    // Keep advancedGroups in sync with URL filters so AdvancedFilters reflects external changes
    // Preserve the original group order by updating in place where possible.
    useEffect(() => {
        const parsed = parseFiltersToGroups(filters, nonFilters)

        // If URL has no advanced filters, reset in-memory groups so UI clears —
        // except when the emptiness is a result of a local update (e.g., user changed
        // the field or removed the last value). In that case, preserve current in-memory groups.
        if (!parsed || parsed.length === 0) {
            if (skipEmptySyncRef.current) {
                // consume the skip and keep current groups as-is
                skipEmptySyncRef.current = false
                return
            }
            setAdvancedGroups([])
            return
        }

        setAdvancedGroups(prev => {
            // If there was no prior state, initialize from parsed (assign _id's)
            if (!prev || prev.length === 0) {
                return parsed.map(g => g._id ? g : ({
                    ...g,
                    _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
                }))
            }

            // Build a queue of parsed groups by fieldName so we can consume them in order
            const parsedByField = parsed.reduce((acc, g) => {
                const key = g.fieldName
                acc[key] = acc[key] || []
                acc[key].push(g)
                return acc
            }, {})

            const next = prev.map(existing => {
                // If the existing group has a fieldName, try to update it with parsed values
                if (existing && existing.fieldName && parsedByField[existing.fieldName] && parsedByField[existing.fieldName].length > 0) {
                    const incoming = parsedByField[existing.fieldName].shift()
                    // Update existing group in place, preserving _id and position
                    return {
                        ...existing,
                        matchType: incoming.matchType || existing.matchType || 'Is',
                        operator: incoming.operator || existing.operator || 'AND',
                        values: Array.isArray(incoming.values) ? incoming.values : (Array.isArray(existing.values) ? existing.values : [])
                    }
                }
                // Otherwise, keep existing as-is (including empty or in-progress groups)
                return existing
            })

            // Append any remaining parsed groups (new fields not present in prev)
            Object.values(parsedByField).forEach(list => {
                list.forEach(incoming => {
                    next.push({
                        ...incoming,
                        _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
                    })
                })
            })

            return next
        })
    }, [filters, nonFilters, parseFiltersToGroups])

    const value = useMemo(() => ({
        filters,
        filterCount,
        addFilter,
        addFilters,
        removeFilter,
        removeFilters,
        setFilters,
        clearFilters,
        filterFields,
        filterFieldsByFieldName: filterFields.reduce((acc, value) => ({
            ...acc,
            [value.fieldName]: value
        }), {id: {label: 'ID'}}),
        isSearch, isFiltered,
        nonFilters,
        // Advanced helpers
        advancedFilterGroups,
        setAdvancedFilterGroups,
        showAdvancedSearch,
        setShowAdvancedSearch,
        hideAdvancedSearch,
        setHideAdvancedSearch,
        addAdvancedFilterGroup,
        clearAdvancedFilterGroups
    }), [
        addFilter,
        addFilters,
        clearFilters,
        filterCount,
        filters,
        removeFilter,
        removeFilters,
        setFilters,
        filterFields,
        isSearch, isFiltered,
        nonFilters,
        advancedFilterGroups,
        setAdvancedFilterGroups,
        showAdvancedSearch,
        setShowAdvancedSearch,
        hideAdvancedSearch,
        setHideAdvancedSearch,
        addAdvancedFilterGroup,
        clearAdvancedFilterGroups
    ])

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}


export default FilterContext
