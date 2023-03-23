import React, {useCallback, useEffect, useMemo, useState} from 'react'
import queryString from 'query-string'

const FilterContext = React.createContext({})

export function FilterProvider({children}) {
    const [filters, setFilters] = useState(() => {
        const query = queryString.parse(location.search)
        return {
            search: '',
            ...query
        }
    })

    const addFilter = useCallback((keyToAdd, valueToAdd, replace) => {
        const oldValue = filters[keyToAdd]

        let newValue
        if (replace) {
            newValue = valueToAdd
        } else {
            if (Array.isArray(oldValue)) {
                if (!oldValue.includes(valueToAdd)) {
                    newValue = [...oldValue, valueToAdd]
                } else {
                    newValue = oldValue
                }
            } else if (oldValue && oldValue !== valueToAdd) {
                newValue = [oldValue, valueToAdd]
            } else {
                newValue = valueToAdd
            }
        }

        const {id, ...keepFilters} = filters
        setFilters({...keepFilters, [keyToAdd]: newValue})
    }, [filters])

    const removeFilters = useCallback(keysToDelete => {
        const newFilters = keysToDelete.reduce((acc, keyToDelete) => {
            const {[keyToDelete]: _, ...newValue} = acc
            return newValue
        }, filters)
        setFilters(newFilters)
    }, [filters])

    const removeFilter = useCallback((keyToDelete, valueToDelete) => {
        const currentValue = filters[keyToDelete]

        if (Array.isArray(currentValue) && currentValue.length > 1) {
            const newValue = currentValue.filter(value => value !== valueToDelete)
            setFilters({...filters, [keyToDelete]: newValue})
        } else {
            const {[keyToDelete]: _, ...newValue} = filters
            setFilters(newValue)
        }
    }, [filters])

    const clearFilters = useCallback(searchToo => {
        const newValue = searchToo ? {} : {search: filters.search}
        setFilters(newValue)
    }, [filters])

    useEffect(() => {
        const validFilters = Object.keys(filters)
            .reduce((acc, key) => {
                if (filters[key]) {
                    acc[key] = filters[key]
                }
                return acc
            }, {})
        const query = queryString.stringify(validFilters)
        const newUrl = new URL(window.location.href)
        newUrl.search = query
        history.replaceState({path: newUrl.href}, '', newUrl.href)
    }, [filters])

    const filterCount = useMemo(() => {
        const {id, search, tab, name, sort, ...rest} = filters
        return Object.keys(rest).length
    }, [filters])

    const value = useMemo(() => ({
        filters,
        filterCount,
        addFilter,
        removeFilter,
        removeFilters,
        clearFilters
    }), [addFilter, clearFilters, filterCount, filters, removeFilter, removeFilters])

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

export default FilterContext
