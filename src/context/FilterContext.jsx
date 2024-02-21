import React, {useCallback, useMemo} from 'react'
import {useSearchParams} from 'react-router-dom'

const FilterContext = React.createContext({})

export function FilterProvider({children, filterFields}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const filters = useMemo(() => {
        return Object.fromEntries(searchParams.entries())
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
            if (replace || !value) {
                searchParams.delete(key)
            }
            if (value) {
                searchParams.set(key, value)
            }
        })
        setSearchParams(searchParams)
    }, [searchParams, setSearchParams])

    const addFilter = useCallback((keyToAdd, valueToAdd, replace) => {
        return addFilters([{key: keyToAdd, value: valueToAdd}], replace)
    }, [addFilters])

    const removeFilters = useCallback(keysToDelete => {
        const newFilters = keysToDelete.reduce((acc, keyToDelete) => {
            const {[keyToDelete]: _, ...newValue} = acc
            return newValue
        }, filters)
        setFilters(newFilters)
    }, [filters, setFilters])

    const removeFilter = useCallback((keyToDelete, valueToDelete) => {
        const currentValue = filters[keyToDelete]

        if (Array.isArray(currentValue) && currentValue.length > 1) {
            const newValue = currentValue.filter(value => value !== valueToDelete)
            setFilters({...filters, [keyToDelete]: newValue})
        } else {
            const {[keyToDelete]: _, ...newValue} = filters
            setFilters(newValue)
        }
    }, [filters, setFilters])

    const clearFilters = useCallback(() => {
        const {tab} = filters
        setFilters({tab})
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
