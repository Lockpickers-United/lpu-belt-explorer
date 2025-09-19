import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'
import RaffleContext from './RaffleContext.jsx'

const scoreThreshold = 0.3

export function RaffleDataProvider({children, allEntries = []}) {
    const {summary} = useContext(RaffleContext)
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, preview, single, expandAll, ...filters} = allFilters

    const visibleEntries = useMemo(() => {

        if (!summary || Object.keys(summary).length === 0 || !allEntries) return []

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
        const filtered = allEntries
            .filter(datum => {
                return filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })
            .sort((a, b) => {
                return a.potNumber - b.potNumber
            })

        // If there is a search term, fuzzy match that
        const searched = search
            ? fuzzysort.go(removeAccents(search), filtered, {keys: fuzzySortKeys, threshold: -30000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
                .filter(result => result.score > scoreThreshold)
            : filtered

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
    }, [allEntries, filters, search, sort, summary])

    const getPotFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries,
        getPotFromId,
        expandAll
    }), [allEntries, visibleEntries, getPotFromId, expandAll])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default RaffleDataProvider
