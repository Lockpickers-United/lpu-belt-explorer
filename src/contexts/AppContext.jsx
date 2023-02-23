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

    const handleSetTab = useCallback(tab => {
        setTab(tab)
        if (filters.id) {
            setTimeout(() => removeFilter('id'), 100)
        }
    }, [filters.id, removeFilter])

    const value = useMemo(() => ({
        tab,
        setTab: handleSetTab
    }), [handleSetTab, tab])

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export default AppContext
