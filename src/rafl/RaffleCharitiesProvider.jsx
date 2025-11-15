import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'
import RaffleContext from './RaffleContext.jsx'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'

export function RaffleCharitiesProvider({children}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort} = allFilters
    const {allCharities} = useContext(RaffleContext)

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

    const searchedCharities = useMemo(() => {
        return searchEntriesForText(allCharities)
    }, [allCharities, searchEntriesForText])


    const visibleEntries = useMemo(() => {
        // Filter the data
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: allCharities
        }).sort((a, b) => {
            return a.sortPotNumber - b.sortPotNumber
        })
        const searched = searchEntriesForText([...filtered])

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'potName') {
                    return a.title.localeCompare(b.title)
                } else if (sort === 'contributedBy') {
                    return a.contributedBy[0].localeCompare(b.contributedBy[0])
                } else {
                    return a.potNumber < b.potNumber
                }
            })
            : searched
    }, [advancedFilterGroups, allCharities, searchEntriesForText, sort])

    const value = useMemo(() => ({
        allCharities,
        visibleEntries,
        searchedCharities
    }), [allCharities, visibleEntries, searchedCharities])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default RaffleCharitiesProvider
