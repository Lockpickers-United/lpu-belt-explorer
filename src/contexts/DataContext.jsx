import React, {useContext, useMemo} from 'react'
import allEntries from '../data/data.json'
import fuzzysort from 'fuzzysort'
import FilterContext from './FilterContext.jsx'
import StorageContext from './StorageContext.jsx'

const DataContext = React.createContext({})

export function DataProvider({children}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {starredEntries} = useContext(StorageContext)
    const {search, id, ...filters} = allFilters

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => ({
                ...entry,
                makes: entry.makeModels.map(({make}) => make),
                fuzzy: entry.makeModels.map(({make, model}) => [make, model]).flat().filter(a => a).join(','),
                content: [
                    entry.media?.length > 0 ? 'Has Images' : 'No Images',
                    entry.links?.length > 0 ? 'Has Links' : 'No Links',
                    starredEntries.includes(entry.id) ? 'Is Starred' : 'Not Starred'
                ].filter(x => x),
                simpleBelt: entry.belt.replace(/\d/g, '')
            }))
    }, [starredEntries])

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

        // If there is a search term, fuzzy match that
        return search
            ? fuzzysort.go(search, filtered, {keys: fuzzySortKeys}).map(result => result.obj)
            : filtered
    }, [filters, search, mappedEntries])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries
    }), [visibleEntries])

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
