import React, {useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'
import RaffleContext from './RaffleContext.jsx'
import filterEntries from '../filters/filterEntries.js'

export function RaffleCharitiesProvider({children}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, ...filters} = allFilters
    const {allCharities} = useContext(RaffleContext)

    const visibleEntries = useMemo(() => {
        // Filter the data
        const filtered = filterEntries(filters, allCharities)

        // If there is a search term, fuzzy match that
        const searched = search
            ? fuzzysort.go(removeAccents(search), filtered, {keys: fuzzySortKeys, threshold: -25000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
            : filtered

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
    }, [allCharities, filters, search, sort])

    const value = useMemo(() => ({
        allCharities,
        visibleEntries
    }), [allCharities, visibleEntries])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default RaffleCharitiesProvider
