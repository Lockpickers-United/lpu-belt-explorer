import React, {useCallback, useContext, useMemo, useState} from 'react'
import DataContext from './DataContext.jsx'
import FilterContext from './FilterContext.jsx'

const AppContext = React.createContext({})

export function AppProvider({children}) {
    const {allEntries} = useContext(DataContext)
    const {filters, removeFilter} = useContext(FilterContext)

    const [tab, setTab] = useState(() => {
        if (filters.id) {
            const entry = allEntries.find(({id}) => filters.id === id)
            if (entry) {
                return entry.belt.replace(/\d/g, '')
            }
        } else if (filters.search?.length > 0) {
            return 'search'
        }
        return 'white'
    })
    const [expanded, setExpanded] = useState(filters.id)

    const handleSetExpanded = useCallback(newValue => {
        if (filters.id && newValue !== filters.id) {
            setTimeout(() => removeFilter('id'), 0)
        }
        setExpanded(newValue)
    }, [filters.id, removeFilter])

    const handleSetTab = useCallback(tab => {
        setTab(tab)
        if (expanded !== 'beltreqs') {
            handleSetExpanded(false)
        }
    }, [expanded, handleSetExpanded])

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
