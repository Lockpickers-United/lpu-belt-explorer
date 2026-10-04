import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useLocation, useSearchParams} from 'react-router-dom'
import {
    buildFiltersFromSearchParams,
    cleanFiltersObject,
    countActiveFilterParams,
    DEFAULT_NON_FILTER_KEYS,
    hasNonEmptyValue,
    parseFiltersToGroups,
    serializeAdvancedFilterGroups
} from './filterUrlState.js'
import {
    addAdvancedFilterGroup as addAdvancedFilterGroupToRows,
    reconcileAdvancedFilterRows,
    splitAdvancedFilterRows
} from './advancedFilterState.js'

const FilterContext = React.createContext({})
const EMPTY_FILTER_FIELDS = []
const EMPTY_FILTER_KEYS = []

export function FilterProvider({
    children,
    filterFields = EMPTY_FILTER_FIELDS,
    additionalFilterKeys = EMPTY_FILTER_KEYS
}) {
    const location = useLocation()
    const [searchParams, setSearchParams] = useSearchParams()
    const filters = useMemo(() => {
        return buildFiltersFromSearchParams(searchParams)
    }, [searchParams])

    const nonFilters = useMemo(() => DEFAULT_NON_FILTER_KEYS, [])
    const allowedFilterKeys = useMemo(() => Array.from(new Set([
        ...filterFields.map(field => field.fieldName),
        ...additionalFilterKeys
    ].filter(Boolean))), [additionalFilterKeys, filterFields])
    const filterPolicy = useMemo(() => ({allowedFilterKeys}), [allowedFilterKeys])

    const actualFilters = useMemo(() => allowedFilterKeys.reduce((result, key) => {
        if (filters[key] !== undefined) result[key] = filters[key]
        return result
    }, {}), [allowedFilterKeys, filters])

    const setFilters = useCallback(newFilters => {
        setSearchParams(cleanFiltersObject(newFilters), {replace: true})
    }, [setSearchParams])

    const addFilters = useCallback((keyValues, replace) => {
        setSearchParams(previousSearchParams => {
            const nextSearchParams = new URLSearchParams(previousSearchParams)
            keyValues.forEach(({key, value}) => {
                if (!hasNonEmptyValue(value)) {
                    nextSearchParams.delete(key)
                } else if (replace) {
                    nextSearchParams.delete(key)
                    const values = Array.isArray(value) ? value : [value]
                    values.filter(hasNonEmptyValue)
                        .forEach(item => nextSearchParams.append(key, String(item)))
                } else {
                    const values = Array.isArray(value) ? value : [value]
                    values.filter(hasNonEmptyValue)
                        .forEach(item => nextSearchParams.append(key, String(item)))
                }
            })
            return nextSearchParams
        }, {replace: true})
    }, [setSearchParams])

    const addFilter = useCallback((keyToAdd, valueToAdd, replace) => {
        return addFilters([{key: keyToAdd, value: valueToAdd}], replace)
    }, [addFilters])

    const removeFilters = useCallback(keysToDelete => {
        setSearchParams(previousSearchParams => {
            const nextSearchParams = new URLSearchParams(previousSearchParams)
            keysToDelete.forEach(key => nextSearchParams.delete(key))
            return nextSearchParams
        }, {replace: true})
    }, [setSearchParams])

    const removeFilter = useCallback((keyToDelete, valueToDelete) => {
        setSearchParams(previousSearchParams => {
            const nextSearchParams = new URLSearchParams(previousSearchParams)
            const currentValue = nextSearchParams.getAll(keyToDelete)

            nextSearchParams.delete(keyToDelete)
            if (currentValue.length > 1) {
                currentValue
                    .filter(value => value !== valueToDelete)
                    .forEach(value => nextSearchParams.append(keyToDelete, value))
            }
            return nextSearchParams
        }, {replace: true})
    }, [setSearchParams])

    const [draftRows, setDraftRows] = useState([])
    const rowIdsByFieldRef = useRef(new Map())
    const expectedLocalSearchRef = useRef()
    const previousLocationKeyRef = useRef(location.key)

    const createAdvancedGroupId = useCallback(() => {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    }, [])

    const filterCount = useMemo(() => {
        return countActiveFilterParams(searchParams, filterPolicy)
    }, [filterPolicy, searchParams])

    const isSearch = !!filters?.search
    const isFiltered = (!!filters?.search || !!filters?.sort || filterCount > 0)

    const urlAdvancedFilterGroups = useMemo(() => {
        return parseFiltersToGroups(filters, filterPolicy)
    }, [filterPolicy, filters])

    const advancedRows = useMemo(() => {
        const renderedDraftRows = previousLocationKeyRef.current === location.key
            || expectedLocalSearchRef.current === location.search
            ? draftRows
            : []
        const previousRows = [
            ...urlAdvancedFilterGroups
                .map(group => ({...group, _id: rowIdsByFieldRef.current.get(group.fieldName)}))
                .filter(group => group._id),
            ...renderedDraftRows
        ]
        const rows = reconcileAdvancedFilterRows({
            activeGroups: urlAdvancedFilterGroups,
            draftRows: renderedDraftRows,
            previousRows,
            createId: createAdvancedGroupId
        })
        rows.forEach(row => {
            if (row.fieldName) rowIdsByFieldRef.current.set(row.fieldName, row._id)
        })
        return rows
    }, [createAdvancedGroupId, draftRows, location.key, location.search, urlAdvancedFilterGroups])

    const activeFilterGroups = useCallback(() => {
        return urlAdvancedFilterGroups
    }, [urlAdvancedFilterGroups])

    const activeAdvancedFilterGroups = activeFilterGroups

    const advancedFilterGroups = useCallback(() => {
        return advancedRows
    }, [advancedRows])

    const setAdvancedFilterGroups = useCallback((groups = []) => {
        const suppliedRows = Array.isArray(groups) ? groups.filter(Boolean) : []
        const suppliedState = splitAdvancedFilterRows(suppliedRows)
        const normalizedRows = reconcileAdvancedFilterRows({
            ...suppliedState,
            previousRows: advancedRows,
            createId: createAdvancedGroupId
        })
        const {activeGroups, draftRows: nextDraftRows} = splitAdvancedFilterRows(normalizedRows)
        setDraftRows(nextDraftRows)

        setSearchParams(previousSearchParams => {
            const nextSearchParams = serializeAdvancedFilterGroups({
                groups: activeGroups,
                searchParams: previousSearchParams,
                allowedFilterKeys
            })
            const nextSearch = nextSearchParams.toString()
            expectedLocalSearchRef.current = nextSearch ? `?${nextSearch}` : ''
            return nextSearchParams
        }, {replace: true})
    }, [advancedRows, allowedFilterKeys, createAdvancedGroupId, setSearchParams])

    const clearFilters = useCallback(() => {
        expectedLocalSearchRef.current = undefined
        setDraftRows([])
        setSearchParams(previousSearchParams => {
            const nextSearchParams = new URLSearchParams(previousSearchParams)
            allowedFilterKeys.forEach(key => nextSearchParams.delete(key))
            nextSearchParams.delete('search')
            return nextSearchParams
        }, {replace: true})
    }, [allowedFilterKeys, setSearchParams])

    useEffect(() => {
        if (previousLocationKeyRef.current === location.key) return

        const expectedSearch = expectedLocalSearchRef.current
        previousLocationKeyRef.current = location.key
        expectedLocalSearchRef.current = undefined
        if (expectedSearch !== location.search) setDraftRows([])
    }, [location.key, location.search])

    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
    const [hideAdvancedSearch, setHideAdvancedSearch] = useState(false)
    const clearAnimationTimeoutRef = useRef()

    const addAdvancedFilterGroup = useCallback(({fieldName, valueToAdd, operator, matchType}) => {
        if (!fieldName || !hasNonEmptyValue(valueToAdd)) return
        setShowAdvancedSearch(true)
        const nextRows = addAdvancedFilterGroupToRows({
            rows: advancedRows,
            fieldName,
            valueToAdd,
            operator,
            matchType,
            createId: createAdvancedGroupId
        })
        if (nextRows !== advancedRows) setAdvancedFilterGroups(nextRows)
    }, [advancedRows, createAdvancedGroupId, setAdvancedFilterGroups])

    const clearAdvancedFilterGroups = useCallback(() => {
        clearTimeout(clearAnimationTimeoutRef.current)
        clearFilters()
        setHideAdvancedSearch(true)
        setShowAdvancedSearch(false)
        clearAnimationTimeoutRef.current = setTimeout(() => {
            setHideAdvancedSearch(false)
            clearAnimationTimeoutRef.current = undefined
        }, 350)
    }, [clearFilters])

    useEffect(() => {
        return () => clearTimeout(clearAnimationTimeoutRef.current)
    }, [])

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
        isSearch,
        isFiltered,
        nonFilters,
        allowedFilterKeys,
        actualFilters,
        activeFilterGroups,
        activeAdvancedFilterGroups,
        advancedFilterGroups,
        setAdvancedFilterGroups,
        createAdvancedGroupId,
        showAdvancedSearch,
        setShowAdvancedSearch,
        hideAdvancedSearch,
        setHideAdvancedSearch,
        addAdvancedFilterGroup,
        clearAdvancedFilterGroups
    }), [
        addAdvancedFilterGroup,
        addFilter,
        addFilters,
        activeAdvancedFilterGroups,
        activeFilterGroups,
        actualFilters,
        advancedFilterGroups,
        allowedFilterKeys,
        clearAdvancedFilterGroups,
        clearFilters,
        createAdvancedGroupId,
        filterCount,
        filterFields,
        filters,
        hideAdvancedSearch,
        isFiltered,
        isSearch,
        nonFilters,
        removeFilter,
        removeFilters,
        setAdvancedFilterGroups,
        setFilters,
        showAdvancedSearch
    ])

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

export default FilterContext
