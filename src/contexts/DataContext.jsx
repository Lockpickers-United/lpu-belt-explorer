import React, {useContext, useEffect, useMemo, useState} from 'react'
import fuzzysort from 'fuzzysort'
import FilterContext from './FilterContext'
import StorageContext from './StorageContext'
import dayjs from 'dayjs'
import belts from '../data/belts'

const DataContext = React.createContext({})

export function DataProvider({children}) {
    const [allEntries, setAllEntries] = useState([])
    const {filters: allFilters} = useContext(FilterContext)
    const {starredEntries} = useContext(StorageContext)
    const {search, id, tab, name, sort, ...filters} = allFilters

    useEffect(() => {
        const load = async () => {
            const value = (await import('../data/data.json')).default
            setAllEntries(value)
        }
        load()
    }, [])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => ({
                ...entry,
                makes: entry.makeModels.map(({make}) => make),
                fuzzy: entry.makeModels.map(({make, model}) => [make, model]).flat().filter(a => a).join(','),
                content: [
                    entry.media?.some(m => !m.fullUrl.match(/youtube\.com/)) ? 'Has Images' : 'No Images',
                    entry.media?.some(m => m.fullUrl.match(/youtube\.com/)) ? 'Has Video' : 'No Video',
                    entry.links?.length > 0 ? 'Has Links' : 'No Links',
                    starredEntries.includes(entry.id) ? 'Is Starred' : 'Not Starred'
                ].flat().filter(x => x),
                simpleBelt: entry.belt.replace(/\s\d/g, '')
            }))
    }, [allEntries, starredEntries])

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
        let value = mappedEntries
            .filter(datum => {
                return filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })

        // If there is a search term, fuzzy match that
        value = search
            ? fuzzysort.go(search, value, {keys: fuzzySortKeys})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
                .sort((a, b) => {
                    // Move unranked to the bottom of search results
                    const val1 = a.belt === 'Unranked'
                    const val2 = b.belt === 'Unranked'
                    return val1 - val2
                })
            : value

        if (sort) {
            value = value
                .sort((a, b) => {
                    if (sort === 'popularity') {
                        return b.views - a.views
                    } else if (sort === 'recentlyUpdated') {
                        const dayA = dayjs(a.lastUpdated)
                        const dayB = dayjs(b.lastUpdated)
                        if (dayA.isAfter(dayB)) return -1
                        else if (dayB.isAfter(dayA)) return 1
                    } else if (sort === 'danPoints') {
                        return belts[b.belt].danPoints - belts[a.belt].danPoints
                    }
                })
        }

        return value
    }, [filters, mappedEntries, search, sort])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries
    }), [allEntries, visibleEntries])

    if (!allEntries.length) return null
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
