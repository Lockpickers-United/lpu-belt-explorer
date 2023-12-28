import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DBContext from './DBContext'
import FilterContext from './FilterContext'
import dayjs from 'dayjs'
import belts, {beltSort, beltSortReverse} from '../data/belts'
import removeAccents from 'remove-accents'
import allEntries from '../data/data.json'

const DataContext = React.createContext({})

export function DataProvider({children}) {
    const {anyCollection, lockCollection} = useContext(DBContext)
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, ...filters} = allFilters

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => ({
                ...entry,
                makes: entry.makeModels.map(({make}) => make),
                fuzzy: removeAccents(
                    entry.makeModels
                        .map(({make, model}) => [make, model])
                        .flat()
                        .filter(a => a)
                        .concat([
                            entry.version,
                            entry.notes,
                            entry.belt
                        ])
                        .join(',')
                ),
                content: [
                    entry.media?.some(m => !m.fullUrl.match(/youtube\.com/)) ? 'Has Images' : 'No Images',
                    entry.media?.some(m => m.fullUrl.match(/youtube\.com/)) ? 'Has Video' : 'No Video',
                    entry.links?.length > 0 ? 'Has Links' : 'No Links',
                    belts[entry.belt].danPoints > 0 ? 'Worth Dan Points' : undefined,
                    dayjs(entry.lastUpdated).isAfter(dayjs().subtract(1, 'days')) ? 'Updated Recently' : undefined,
                    entry.belt.startsWith('Black') ? 'Is Black' : undefined,
                    entry.belt !== 'Unranked' ? 'Is Ranked' : undefined
                ].flat().filter(x => x),
                collection: [
                    anyCollection.includes(entry.id) ? 'Any' : 'Not in any Collection',
                    lockCollection.own?.includes?.(entry.id) ? 'Own' : 'Don\'t Own',
                    lockCollection.picked?.includes?.(entry.id) ? 'Picked' : 'Not Picked',
                    lockCollection.wishlist?.includes?.(entry.id) ? 'Wishlist' : 'Not on Wishlist',
                    lockCollection.recorded?.includes?.(entry.id) ? 'Recorded' : 'Not Recorded'
                ],
                simpleBelt: entry.belt.replace(/\s\d/g, '')
            }))
    }, [anyCollection, lockCollection])

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
        const searched = search
            ? fuzzysort.go(removeAccents(search), filtered, {keys: fuzzySortKeys})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
            : filtered

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'popularity') {
                    return b.views - a.views
                } else if (sort === 'recentlyUpdated') {
                    const dayA = dayjs(a.lastUpdated)
                    const dayB = dayjs(b.lastUpdated)
                    if (dayA.isAfter(dayB)) return -1
                    else if (dayB.isAfter(dayA)) return 1
                } else if (sort === 'beltAscending') {
                    return beltSort(a.belt, b.belt)
                } else if (sort === 'beltDescending') {
                    return beltSortReverse(a.belt, b.belt)
                } else if (sort === 'alphaAscending') {
                    return a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'alphaDescending') {
                    return b.fuzzy.localeCompare(a.fuzzy)
                }
            })
            : searched
    }, [filters, mappedEntries, search, sort])

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [])

    // TODO: Move to entryName.js and fix references
    const getNameFromId = useCallback(id => {
        const entry = getEntryFromId(id)
        if (entry) {
            const {makeModels} = entry
            const {make, model} = makeModels[0]
            const makeModel = make && make !== model ? `${make} ${model}` : model
            return makeModel.replace(/[\s/]/g, '_').replace(/\W/g, '')
        }
    }, [getEntryFromId])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries,
        getEntryFromId,
        getNameFromId
    }), [getNameFromId, getEntryFromId, visibleEntries])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default DataContext
