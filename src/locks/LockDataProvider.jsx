import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import belts, {beltSort, beltSortReverse} from '../data/belts'
import collectionOptions from '../data/collectionTypes'
import removeAccents from 'remove-accents'
import collectionStatsById from '../data/collectionStatsById.json'
import useData from '../util/useData.jsx'
import {lockbazzarEntryIds} from '../data/dataUrls'

export function DataProvider({children, allEntries, profile}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, expandAll, ...filters} = allFilters

    const {data, loading, error} = useData({urls})
    const lockbazzarIds = useMemo(() => {
        return data && !loading && !error ? data.lockbazzarEntryIds : []
    },[data, error, loading])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => ({
                ...entry,
                makes: entry.makeModels[0].make ? entry.makeModels.map(({make}) => make) : entry.makeModels[0].model,
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
                collection: collectionOptions.locks.map.map(m => profile && profile[m.key] && profile[m.key].includes(entry.id) ? m.label : 'Not ' + m.label),
                collectionSaves: collectionStatsById[entry.id] || 0,
                simpleBelt: entry.belt.replace(/\s\d/g, ''),
            }))
    }, [allEntries, profile])

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

        // Check for exact search match by id
        const exactMatch = search && filtered.find(e => e.id === search)
        let searched = filtered

        if (exactMatch) {
            searched = [exactMatch]
        } else if (search) {
            // If there is a search term, fuzzy match that
            searched = fuzzysort.go(removeAccents(search), filtered, {keys: fuzzySortKeys, threshold: -25000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
        }

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'popularity') {
                    return b.collectionSaves - a.collectionSaves
                        || b.views - a.views
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'beltAscending') {
                    return beltSort(a.belt, b.belt)
                } else if (sort === 'beltDescending') {
                    return beltSortReverse(a.belt, b.belt)
                } else if (sort === 'alphaAscending') {
                    return a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'alphaDescending') {
                    return b.fuzzy.localeCompare(a.fuzzy)
                } else if (sort === 'recentlyUpdated') {
                    return Math.floor(dayjs(b.lastUpdated).valueOf()/3600) - Math.floor(dayjs(a.lastUpdated).valueOf()/3600)
                        || beltSort(a.belt, b.belt)
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'dateAdded') {
                    return Math.floor(dayjs(b.dateAdded).valueOf()/3600 * 24) - Math.floor(dayjs(a.dateAdded).valueOf()/3600 * 24)
                        || beltSort(a.belt, b.belt)
                        || a.fuzzy.localeCompare(b.fuzzy)
                }
            })
            : searched
    }, [filters, mappedEntries, search, sort])

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const lockbazzarAvailable = useCallback(id => {
        return lockbazzarIds?.includes(id)
    }, [lockbazzarIds])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries,
        getEntryFromId,
        expandAll,
        profile,
        lockbazzarAvailable
    }), [allEntries, getEntryFromId, visibleEntries, expandAll, profile, lockbazzarAvailable])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

const urls = {lockbazzarEntryIds}

export default DataContext
