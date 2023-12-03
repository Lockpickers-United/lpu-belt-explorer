import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import queryString from 'query-string'
import {uniqueBelts} from '../data/belts'
import LazyDataContext from './LazyDataContext'

const FilterContext = React.createContext({})

export function FilterProvider({children}) {
    const {data} = useContext(LazyDataContext)
    const [filters, setFilters] = useState(() => {
        const {id, name, tab, search = '', ...initialFilters} = queryString.parse(location.search)
        initialFilters.search = search

        if (id) {
            const entry = data.find(e => id === e.id)
            if (entry) {
                initialFilters.id = id
                initialFilters.name = name
                initialFilters.tab = entry.belt.replace(/\s\d/g, '')
            } else if (name && !initialFilters.search) {
                initialFilters.search = name.replace(/_/g, ' ')
            }
        }

        if (tab && (uniqueBelts.includes(tab) || tab === 'search') && !initialFilters.tab) {
            initialFilters.tab = tab
        } else if (!initialFilters.tab) {
            initialFilters.tab = 'White'
        }

        return initialFilters
    })

    const addFilters = useCallback((keyValues, replace) => {
        const {id, ...keepFilters} = filters
        const newFilters = {...keepFilters}

        keyValues.forEach(({key: keyToAdd, value: valueToAdd}) => {
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
            newFilters[keyToAdd] = newValue
        })

        setFilters(newFilters)
    }, [filters])

    const addFilter = useCallback((keyToAdd, valueToAdd, replace) => {
        return addFilters([{key: keyToAdd, value: valueToAdd}], replace)
    }, [addFilters])

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

    const clearFilters = useCallback(() => {
        const {tab, id, name} = filters
        setFilters({tab, id, name})
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
        addFilters,
        removeFilter,
        removeFilters,
        setFilters,
        clearFilters
    }), [addFilter, addFilters, clearFilters, filterCount, filters, removeFilter, removeFilters])

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

export default FilterContext