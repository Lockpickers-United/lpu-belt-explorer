import React, {useCallback, useContext, useMemo, useState} from 'react'
import {useParams} from 'react-router-dom'
import entryName from '../entries/entryName'
import DataContext from './LockDataProvider'
import FilterContext from '../context/FilterContext'

const LockListContext = React.createContext({})

export function LockListProvider({children}) {
    const {userId} = useParams()
    const {allEntries, getEntryFromId} = useContext(DataContext)
    const {filters, addFilter, addFilters, removeFilters} = useContext(FilterContext)

    const expanded = filters.id

    const handleSetExpanded = useCallback((newValue, forceTab) => {
        const entry = getEntryFromId(newValue)
        const name = entryName(entry)
        const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
        if (newValue && newValue !== 'beltreqs') {
            const newTab = filters.tab === 'search' && !forceTab ? 'search' : entry.belt.replace(/\s\d/g, '')
            addFilters([
                {key: 'id', value: newValue},
                {key: 'name', value: safeName},
                {key: 'tab', value: userId ? undefined : newTab}
            ], true)
        } else if (newValue === 'beltreqs') {
            addFilters([
                {key: 'id', value: newValue},
                {key: 'name', value: undefined}
            ], true)
        } else {
            removeFilters(['id', 'name'])
        }
    }, [addFilters, filters.tab, getEntryFromId, removeFilters, userId])

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

    const tab = useMemo(() => {
        if (!filters.tab && !userId) {
            const {id} = filters
            if (id && !filters.tab) {
                const entry = allEntries.find(e => id === e.id)
                if (entry) {
                    const value = entry.belt.replace(/\s\d/g, '')
                    addFilter('tab', value)
                    return value
                }
            }
            return 'White'
        }

        return filters.tab
    }, [addFilter, allEntries, filters, userId])

    const value = useMemo(() => ({
        compact,
        tab,
        setTab: handleSetTab,
        expanded,
        setExpanded: handleSetExpanded,
        clearExpanded: handleClearExpanded,
        displayAll: displayAll && filters.tab === 'search',
        setDisplayAll,
        setCompact
    }), [compact, displayAll, expanded, filters.tab, handleClearExpanded, handleSetExpanded, handleSetTab, tab])

    return (
        <LockListContext.Provider value={value}>
            {children}
        </LockListContext.Provider>
    )
}

export default LockListContext
