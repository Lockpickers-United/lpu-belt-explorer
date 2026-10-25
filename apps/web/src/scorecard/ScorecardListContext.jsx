import React, {useCallback, useContext, useMemo} from 'react'
import FilterContext from '../context/FilterContext'

const ScorecardListContext = React.createContext({})

export function ScorecardListProvider({children}) {
    const {filters, addFilters, removeFilters} = useContext(FilterContext)

    const expanded = filters.id

    const handleSetExpanded = useCallback((newValue) => {
        if (newValue) {
            addFilters([{key: 'id', value: newValue}], true)
        } else {
            removeFilters(['id'])
        }
    }, [addFilters, removeFilters])

    const value = useMemo(() => ({
        expanded,
        setExpanded: handleSetExpanded
    }), [expanded, handleSetExpanded])

    return (
        <ScorecardListContext.Provider value={value}>
            {children}
        </ScorecardListContext.Provider>
    )
}

export default ScorecardListContext
