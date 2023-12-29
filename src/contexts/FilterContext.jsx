import React, {useCallback, useMemo} from 'react'
import queryString from 'query-string'
import {useLocation, useSearchParams} from 'react-router-dom'
import {uniqueBelts} from '../data/belts'
import data from '../data/data.json'

const FilterContext = React.createContext({})

export function FilterProvider({children}) {
    const location = useLocation()
    const [, setSearchParams] = useSearchParams()
    const filters = useMemo(() => {
        const {id, name, tab, search = '', ...initialFilters} = queryString.parse(location.search)
        initialFilters.search = search

        if (id) {
            const entry = data.find(e => id === e.id)
            if (entry) {
                initialFilters.id = id
                initialFilters.name = name
                initialFilters.tab = tab === 'search' ? 'search' : entry.belt.replace(/\s\d/g, '')
            } else if (name && !initialFilters.search) {
                initialFilters.search = name.replace(/_/g, ' ')
            } else if (id === 'beltreqs') {
                initialFilters.id = id
            }
        }

        if (tab && (uniqueBelts.includes(tab) || tab === 'search') && !initialFilters.tab) {
            initialFilters.tab = tab
        } else if (!initialFilters.tab) {
            initialFilters.tab = 'White'
        }

        return initialFilters
    }, [location.search])

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
        const newFilters = {...filters}

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
    }, [filters, setFilters])

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
        const {tab, id, name} = filters
        setFilters({tab, id, name})
    }, [filters, setFilters])

    const filterCount = useMemo(() => {
        const {id, search, tab, name, sort, image, ...rest} = filters
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
    }), [addFilter, addFilters, clearFilters, filterCount, filters, removeFilter, removeFilters, setFilters])

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    )
}

export default FilterContext
