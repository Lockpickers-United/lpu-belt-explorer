import React, {useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'
import RaffleContext from './RaffleContext.jsx'

export function RaffleCharitiesProvider({children, allEntries}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, ...filters} = allFilters
    const {charitySummaryStats} = useContext(RaffleContext)

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => ({
                ...entry,
                fuzzy: removeAccents([
                    entry.name
                ].join(',')),
                donors: charitySummaryStats && charitySummaryStats[entry.name] ? charitySummaryStats[entry.name].donors : 0,
                donations: charitySummaryStats && charitySummaryStats[entry.name] ? charitySummaryStats[entry.name].donations : 0,
            }))
    }, [allEntries, charitySummaryStats])

    const visibleEntries = useMemo(() => {
        // Filters as an array
        const filterArray = Object.keys(filters)
            .map(key => {
                const value = filters[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()

        // Filter the data
        const filtered = mappedEntries
            .filter(datum => {
                return filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })
            .sort((a, b) => { return a.fuzzy.localeCompare(b.fuzzy)})

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
    }, [filters, mappedEntries, search, sort])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries
    }), [allEntries, visibleEntries])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default RaffleCharitiesProvider
