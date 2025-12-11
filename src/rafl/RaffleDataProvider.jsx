import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'
import RaffleContext from './RaffleContext.jsx'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'

export function RaffleDataProvider({children, allEntries = []}) {
    const {summary} = useContext(RaffleContext)
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, preview, expandAll, ..._filters} = allFilters

    const searchCutoff = 0.3

    const searchEntriesForText = useCallback((entries) => {
        const exactMatch = search && entries.find(e => e.id === search)
        if (exactMatch) {
            return [exactMatch]
        }
        return !search
            ? entries
            : fuzzysort.go(removeAccents(search), entries, {keys: fuzzySortKeys, threshold: -23000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
                .filter(entry => entry.score > searchCutoff)
    }, [search, searchCutoff])

    const searchedEntries = useMemo(() => {
            return searchEntriesForText(allEntries)
    }, [allEntries, searchEntriesForText])


    const visibleEntries = useMemo(() => {
        if (!summary || Object.keys(summary).length === 0 || !allEntries) return []

        // Filter the data
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: allEntries
        }).sort((a, b) => {
            return a.sortPotNumber - b.sortPotNumber
        })
        const searched = searchEntriesForText([...filtered])

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'potName') {
                    return a.title.localeCompare(b.title)
                } else if (sort === 'contributedBy') {
                    return a.contributedBy[0].localeCompare(b.contributedBy[0]) || a.title.localeCompare(b.title)
                } else if (sort === 'tickets') {
                    return b.totalTickets - a.totalTickets || a.title.localeCompare(b.title)
                } else if (sort === 'donors') {
                    return b.uniqueDonorCount - a.uniqueDonorCount
                        || b.totalTickets - a.totalTickets
                        || a.title.localeCompare(b.title)
                } else {
                    return parseInt(a[sort]) - parseInt(b[sort]) || a.title.localeCompare(b.title)
                }
            })
            : searched.sort((a, b) => {
                return b.score - a.score
                    || parseInt(a.sortPotNumber) - parseInt(b.sortPotNumber)
                    || a.title.localeCompare(b.title)
            })
    }, [advancedFilterGroups, allEntries, searchEntriesForText, sort, summary])

    const getPotFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const value = useMemo(() => ({
        allEntries,
        searchedEntries,
        visibleEntries,
        getPotFromId,
        expandAll
    }), [allEntries, searchedEntries, visibleEntries, getPotFromId, expandAll])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default RaffleDataProvider
