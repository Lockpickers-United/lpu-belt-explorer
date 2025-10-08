import React, {useCallback, useMemo, useState} from 'react'
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

    const clearFilters = useCallback(() => {
        const {tab, sort} = filters
        setFilters({tab, sort})
        setAdvancedGroups([])
    }, [filters, setFilters])

    const nonFilters = useMemo(()=> [
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
    ],[])

    const filterCount = useMemo(() => {
        const keys = Array.from(searchParams.keys())
        return keys.filter(key => !nonFilters.includes(key)).length
    }, [nonFilters, searchParams])

    const isSearch = !!filters?.search
    const isFiltered = (!!filters?.search || !!filters?.sort || filterCount > 0)

    // Convert current filters (from URL query string) into Advanced Filter objects
    const advancedFilterGroups = useCallback(() => {
        // If we have in-memory groups, prefer them (to keep partially defined groups visible)
        if (advancedGroups !== undefined) return advancedGroups

        const groups = []
        Object.keys(filters || {})
            .filter(key => !nonFilters.includes(key))
            .forEach(key => {
                const raw = filters[key]
                const addGroupFromString = (str) => {
                    if (typeof str !== 'string') return
                    const negative = str.startsWith('!')
                    const core = negative ? str.slice(1) : str
                    const hasOr = core.includes('||')
                    const hasAnd = !hasOr && core.includes('@@')
                    const delimiter = hasOr ? '||' : hasAnd ? '@@' : null
                    const values = delimiter ? core.split(delimiter).filter(Boolean) : [core].filter(Boolean)
                    const operator = hasOr ? 'OR' : 'AND'
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
    }, [advancedGroups, filters, nonFilters])

    // Accept an array of Advanced Filter objects and set URL filters accordingly
    const setAdvancedFilterGroups = useCallback((groups = []) => {
        // Ensure each group has a stable unique _id for React keys/state isolation
        const withIds = groups.map(g => {
            if (!g) return g
            return g._id ? g : {...g, _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}
        })
        // Save locally (preserves partially defined groups)
        setAdvancedGroups(withIds)

        const sp = new URLSearchParams()
        // Preserve existing non-filter params
        Object.entries(filters || {}).forEach(([key, val]) => {
            if (nonFilters.includes(key)) {
                if (Array.isArray(val)) {
                    val.forEach(v => { if (v !== undefined && v !== null && String(v).length) sp.append(key, v) })
                } else if (val !== undefined && val !== null && String(val).length) {
                    sp.set(key, val)
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
        setShowAdvancedSearch
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
        setShowAdvancedSearch
    ])

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}


export default FilterContext
