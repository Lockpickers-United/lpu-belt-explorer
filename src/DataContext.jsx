import React, {useContext, useMemo} from 'react'
import data from './data/data.js'
import fuzzysort from 'fuzzysort'
import FilterContext from './FilterContext.jsx'
import StorageContext from './StorageContext.jsx'
import {uniqueBelts} from './data/belts.js'

const DataContext = React.createContext({})

export function DataProvider({children}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {starredEntries} = useContext(StorageContext)
    const {search, id, ...filters} = allFilters

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

        // If filtering by stars, an additional data element is required
        const mapped = filters.starred
            ? data.map(entry => {
                entry.starred = `${starredEntries.includes(entry.id)}`
                return entry
            })
            : data

        // Filter the data
        const filtered = mapped
            .filter(datum => {
                return filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })

        // If there is a search term, fuzzy match that
        return search
            ? fuzzysort.go(search, filtered, {keys: fuzzySortKeys}).map(result => result.obj)
            : filtered
    }, [filters, search, starredEntries])

    const beltedEntries = useMemo(() => {
        const beltedInitial = uniqueBelts.reduce((acc, val) => ({...acc, [val]: []}), {})
        return visibleEntries.reduce((acc, val) => {
            const belt = val.belt.replace(/\d/g, '')
            acc[belt].push(val)
            return acc
        }, beltedInitial)
    }, [visibleEntries])

    const value = useMemo(() => ({
        allEntries: data,
        visibleEntries,
        beltedEntries
    }), [visibleEntries, beltedEntries])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = [
    'fuzzy',
    'version',
    'notes'
]

export default DataContext
