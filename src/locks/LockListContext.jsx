import React, {useCallback, useContext, useMemo, useState} from 'react'
import DataContext from './DataContext'
import FilterContext from './FilterContext'

const LockListContext = React.createContext({})

export function LockListProvider({children}) {
    const {getEntryFromId, getNameFromId} = useContext(DataContext)
    const {filters, addFilters, removeFilters} = useContext(FilterContext)

    const expanded = filters.id

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
    }, [addFilters, filters.tab, getEntryFromId, getNameFromId, removeFilters])

    const handleClearExpanded = useCallback(() => {
        removeFilters(['id', 'name'])
    }, [removeFilters])

    const handleSetTab = useCallback(tab => {
        addFilters([
            {key: 'tab', value: tab},
            {key: 'id', value: expanded === 'beltreqs' ? 'beltreqs' : undefined},
            {key: 'name', value: undefined}
        ], true)

        setTimeout(() => setDisplayAll(false), 0)
    }, [addFilters, expanded])

    const [displayAll, setDisplayAll] = useState(false)

    const [compact, setCompact] = useState(false)

    const value = useMemo(() => ({
        compact,
        tab: filters.tab,
        setTab: handleSetTab,
        expanded,
        setExpanded: handleSetExpanded,
        clearExpanded: handleClearExpanded,
        displayAll: displayAll && filters.tab === 'search',
        setDisplayAll,
        setCompact,
    }), [compact, displayAll, expanded, filters.tab, handleClearExpanded, handleSetExpanded, handleSetTab])

    return (
        <LockListContext.Provider value={value}>
            {children}
        </LockListContext.Provider>
    )
}

export default LockListContext
