import React, {useCallback, useContext, useMemo, useState} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import DataContext from './DataContext'
import FilterContext from './FilterContext'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {getEntryFromId, getNameFromId} = useContext(DataContext)
    const {filters, addFilters, removeFilters} = useContext(FilterContext)

    const [expanded, setExpanded] = useState(filters.id)

    const handleSetExpanded = useCallback((newValue, forceTab) => {
        const entry = getEntryFromId(newValue)
        const name = getNameFromId(newValue)
        if (newValue && newValue !== 'beltreqs') {
            const newTab = filters.tab === 'search' && !forceTab ? 'search' : entry.belt.replace(/\s\d/g, '')
            addFilters([
                {key: 'id', value: newValue},
                {key: 'name', value: name},
                {key: 'tab', value: newTab}
            ], true)
        } else if (newValue === 'beltreqs') {
            addFilters([
                {key: 'id', value: newValue},
                {key: 'name', value: undefined}
            ], true)
        } else {
            removeFilters(['id', 'name'])
        }

        setExpanded(newValue)
    }, [addFilters, filters.tab, getEntryFromId, getNameFromId, removeFilters])

    const handleClearExpanded = useCallback(() => {
        setExpanded(undefined)
    }, [])

    const handleSetTab = useCallback(tab => {
        addFilters([
            {key: 'tab', value: tab},
            {key: 'id', value: expanded === 'beltreqs' ? 'beltreqs' : undefined},
            {key: 'name', value: undefined}
        ], true)

        if (expanded !== 'beltreqs') {
            setExpanded(false)
        }

        setTimeout(() => setDisplayAll(false), 0)
    }, [addFilters, expanded])

    const [displayAll, setDisplayAll] = useState(false)

    const [beta, setBeta] = useState(false)
    useHotkeys('ctrl+shift+m', () => setBeta(!beta))

    const [compact, setCompact] = useState(false)

    const value = useMemo(() => ({
        beta,
        compact,
        tab: filters.tab,
        setTab: handleSetTab,
        expanded,
        setExpandedDirect: setExpanded,
        setExpanded: handleSetExpanded,
        clearExpanded: handleClearExpanded,
        displayAll: displayAll && filters.tab === 'search',
        setDisplayAll,
        setCompact,
    }), [beta, compact, displayAll, expanded, filters.tab, handleClearExpanded, handleSetExpanded, handleSetTab])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
