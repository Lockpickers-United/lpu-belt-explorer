import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'

export function RaffleDataProvider({children, allEntries}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, preview, single, expandAll, ...filters} = allFilters

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
        const filtered = allEntries
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
                    return a.contributedBy[0].localeCompare(b.contributedBy[0]) || a.title.localeCompare(b.title)
                } else if (sort === 'tickets') {
                    return parseInt(b.tickets) - parseInt(a.tickets) || a.title.localeCompare(b.title)
                } else if (sort === 'donors') {
                    return parseInt(b.donors) - parseInt(a.donors) || a.title.localeCompare(b.title)
                } else if (sort === 'dateAdded') {
                    return parseInt(b.dateAdded) - parseInt(a.dateAdded) || a.title.localeCompare(b.title)
                } else {
                    return parseInt(a[sort]) - parseInt(b[sort]) || a.title.localeCompare(b.title)
                }
            })
            : searched.sort((a, b) => {
                return parseInt(a.sortPotNumber) - parseInt(b.sortPotNumber) || a.title.localeCompare(b.title)
            })
    }, [allEntries, filters, search, sort])

    const getPotFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries,
        getPotFromId,
        expandAll,
    }), [allEntries, visibleEntries, getPotFromId, expandAll])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default RaffleDataProvider
