import React, {useCallback, useContext, useMemo} from 'react'
import DataContext from '../../context/DataContext.jsx'
import FilterContext from '../../context/FilterContext'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../../filters/filterEntriesAdvanced'
import searchEntriesForText from '../../filters/searchEntriesForText'
import {getLockSortComparator} from '../../locks/lockSortComparators'
import DBContext from '../../app/DBContext.jsx'

export function RequestAdminDataProvider({children}) {
    const {profile, beltRequests} = useContext(DBContext)

    const {filters: allFilters, activeFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    console.log('beltRequests', beltRequests)

    const mappedEntries = useMemo(() => {
        return beltRequests
            .map(request => {
                const displayStatus = request.status === 'open'
                    ? 'Open'
                    : request.status === 'checked-out'
                        ? 'Checked out'
                        : initialCap(request.status)
                const filterStatus = displayStatus === 'Checked out'
                    ? ['Open', 'Checked out']
                    : displayStatus
                return {
                    ...request,
                    displayStatus,
                    filterStatus,
                    fuzzy: removeAccents(
                        [request.username, request.lastUpdateBy]
                            .join(',')
                    )
                }
            })
    }, [beltRequests])

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, mappedEntries)
    }, [mappedEntries, search])

    const visibleEntries = useMemo(() => {
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: activeFilterGroups(),
            entries: mappedEntries
        })
        const searched = searchEntriesForText(search, [...filtered])
        return sort
            ? searched.sort(getLockSortComparator(sort))
            : searched.sort(getLockSortComparator('timeAdded'))
    }, [activeFilterGroups, mappedEntries, search, sort])

    const getEntryFromId = useCallback(id => {
        return mappedEntries.find(e => e.id === id)
    }, [mappedEntries])

    const value = useMemo(() => ({
        mappedEntries,
        visibleEntries,
        searchedEntries,
        getEntryFromId,
        expandAll,
        profile,
    }), [mappedEntries, visibleEntries, searchedEntries, getEntryFromId, expandAll, profile])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

function initialCap(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}
export default DataContext
