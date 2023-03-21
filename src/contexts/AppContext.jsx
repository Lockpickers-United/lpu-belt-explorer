import React, {useCallback, useContext, useMemo, useState} from 'react'
import DataContext from './DataContext'
import FilterContext from './FilterContext'
import {uniqueBelts} from '../data/belts'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {allEntries} = useContext(DataContext)
    const {filters, removeFilters} = useContext(FilterContext)

    const [tab, setTab] = useState(() => {
        const {tab, belt, id, search, ...rest} = filters
        let entry
        if (id) entry = allEntries.find(e => id === e.id)
        if (tab && uniqueBelts.includes(tab)) {
            return filters.tab
        } else if (belt && uniqueBelts.includes(belt)) {
            return belt
        } else if (id && entry) {
            return entry.belt.replace(/\s\d/g, '')
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

        if (expanded !== 'beltreqs') {
            handleSetExpanded(false)
        }

        if (filters.id || filters.name || filters.tab) {
            setTimeout(() => removeFilters(['id', 'name', 'tab']), 0)
        }
    }, [expanded, filters, handleSetExpanded, removeFilters])

    const value = useMemo(() => ({
        tab,
        setTab: handleSetTab,
        expanded,
        setExpanded: handleSetExpanded
    }), [expanded, handleSetExpanded, handleSetTab, tab])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
