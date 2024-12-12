import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import collectionOptions from '../data/collectionTypes'
import removeAccents from 'remove-accents'
import RaffleContext from './RaffleContext.jsx'

export function RaffleDataProvider({children, allEntries, profile}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, preview, single, ...filters} = allFilters
    const {potSummaryStats} = useContext(RaffleContext)

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => ({
                ...entry,
                fuzzy: removeAccents([
                    entry.title,
                    entry.winner,
                    entry.description,
                    entry.potContents,
                ].join(',')),
                collection: collectionOptions.raffle.map.map(m => profile && profile[m.key] && profile[m.key].includes(entry.id) ? 'In ' + m.label : 'Not in ' + m.label),
                tickets: potSummaryStats && potSummaryStats[entry.id] ? potSummaryStats[entry.id].tickets : 0,
                donors: potSummaryStats && potSummaryStats[entry.id] ? potSummaryStats[entry.id].donors : 0
            }))
    }, [allEntries, potSummaryStats, profile])

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
            .sort((a, b) => { return a.potNumber-b.potNumber})

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
                } else if (sort === 'tickets') {
                    return parseInt(b.tickets) - parseInt(a.tickets)
                } else if (sort === 'donors') {
                    return parseInt(b.donors) - parseInt(a.donors)
                } else {
                    return a.potNumber < b.potNumber || a.title.localeCompare(b.title)
                }
            })
            : searched.sort((a, b) => {
                return a.potNumber < b.potNumber || a.title.localeCompare(b.title)
            })
    }, [filters, mappedEntries, search, sort])

    const getPotFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries,
        getPotFromId
    }), [allEntries, visibleEntries, getPotFromId])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default RaffleDataProvider
