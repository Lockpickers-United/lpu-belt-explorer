import React, {useCallback, useContext, useMemo} from 'react'
import entryName from '../entries/entryName'
import ScorecardDataContext from './ScorecardDataProvider.jsx'
import FilterContext from '../context/FilterContext'

const ScorecardListContext = React.createContext({})

export function ScorecardListProvider({children}) {
    const {getEntryFromId} = useContext(ScorecardDataContext)
    const {filters, addFilters, removeFilters} = useContext(FilterContext)

    const expanded = filters.id

    const handleSetExpanded = useCallback((newValue) => {
        const entry = getEntryFromId(newValue)
        if (newValue && newValue !== 'beltreqs') {
            const name = entry ? entryName(entry) : ''
            const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
            addFilters([
                {key: 'id', value: newValue},
                {key: 'name', value: safeName},
            ], true)
        } else if (newValue === 'beltreqs') {
            addFilters([
                {key: 'id', value: newValue},
                {key: 'name', value: undefined}
            ], true)
        } else {
            removeFilters(['id', 'name'])
        }
    }, [addFilters, getEntryFromId, removeFilters])

    const handleClearExpanded = useCallback(() => {
        removeFilters(['id', 'name'])
    }, [removeFilters])


    const value = useMemo(() => ({
        expanded,
        setExpanded: handleSetExpanded,
        clearExpanded: handleClearExpanded,
    }), [expanded, handleClearExpanded, handleSetExpanded])

    return (
        <ScorecardListContext.Provider value={value}>
            {children}
        </ScorecardListContext.Provider>
    )
}

export default ScorecardListContext
