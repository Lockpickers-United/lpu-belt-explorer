import React, {useCallback, useContext, useMemo, useState} from 'react'
import FilterContext from './FilterContext'
import {uniqueBelts} from '../data/belts'
import LazyDataContext from './LazyDataContext'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {data} = useContext(LazyDataContext)
    const {filters, addFilter, removeFilters} = useContext(FilterContext)

    const [tab, setTab] = useState(() => {
        const {tab, belt, id, name, search, ...rest} = filters
        if (tab && uniqueBelts.includes(tab)) {
            return tab
        } else if (belt) {
            return uniqueBelts.includes(belt) ? belt : 'search'
        } else if (id) {
            const entry = data.find(e => id === e.id)
            const value = entry ? entry.belt.replace(/\s\d/g, '') : 'White'
            if (value === 'Unranked') {
                addFilter('belt', 'Unranked', true)
                return 'search'
            } else {
                return value
            }
        } else if (search?.length > 0 || Object.keys(rest).length > 0) {
            return 'search'
        }
        return 'White'
    })
    const [expanded, setExpanded] = useState(filters.id)

    const handleSetExpanded = useCallback(newValue => {
        if ((filters.id || filters.name) && newValue !== filters.id) {
            setTimeout(() => removeFilters(['id', 'name']), 0)
        }
        setExpanded(newValue)
    }, [filters, removeFilters])

    const handleSetTab = useCallback(tab => {
        setTab(tab)
        setTimeout(() => setDisplayAll(false), 0)

        if (expanded !== 'beltreqs') {
            handleSetExpanded(false)
        }

        if (filters.id || filters.name || filters.tab) {
            setTimeout(() => removeFilters(['id', 'name', 'tab']), 0)
        }
    }, [expanded, filters, handleSetExpanded, removeFilters])

    const [displayAll, setDisplayAll] = useState(false)

    const value = useMemo(() => ({
        tab,
        setTab: handleSetTab,
        expanded,
        setExpanded: handleSetExpanded,
        displayAll: displayAll && tab === 'search',
        setDisplayAll
    }), [displayAll, expanded, handleSetExpanded, handleSetTab, tab])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
