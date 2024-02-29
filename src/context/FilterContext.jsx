import React, {useCallback, useMemo} from 'react'
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
        setSearchParams(newFilters)
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
        setSearchParams(searchParams)
    }, [searchParams, setSearchParams])

    const addFilter = useCallback((keyToAdd, valueToAdd, replace) => {
        return addFilters([{key: keyToAdd, value: valueToAdd}], replace)
    }, [addFilters])

    const removeFilters = useCallback(keysToDelete => {
        keysToDelete.forEach(key => searchParams.delete(key))
        setSearchParams(searchParams)
    }, [searchParams, setSearchParams])

    const removeFilter = useCallback((keyToDelete, valueToDelete) => {
        const currentValue = searchParams.getAll(keyToDelete)

        searchParams.delete(keyToDelete)
        if (Array.isArray(currentValue) && currentValue.length > 1) {
            const newValue = currentValue.filter(value => value !== valueToDelete)
            newValue.forEach(v => searchParams.append(keyToDelete, v))
        }
        setSearchParams(searchParams)
    }, [searchParams, setSearchParams])

    const clearFilters = useCallback(() => {
        const {tab, sort} = filters
        setFilters({tab, sort})
    }, [filters, setFilters])

    const filterCount = useMemo(() => {
        const keys = Array.from(searchParams.keys())
        return keys.filter(key => !nonFilters.includes(key)).length
    }, [searchParams])

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
        }), {id: {label: 'ID'}})
    }), [
        addFilter,
        addFilters,
        clearFilters,
        filterCount,
        filters,
        removeFilter,
        removeFilters,
        setFilters,
        filterFields
    ])

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

const nonFilters = [
    'id',
    'name',
    'search',
    'tab',
    'sort',
    'image'
]

export default FilterContext
