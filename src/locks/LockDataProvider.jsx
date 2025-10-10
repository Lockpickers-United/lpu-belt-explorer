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
import filterEntries from '../filters/filterEntries'

export function DataProvider({children, allEntries, profile}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, expandAll, ...filters} = allFilters

    const {data, loading, error} = useData({urls})
    const lockbazzarIds = useMemo(() => {
        return data && !loading && !error ? data.lockbazzarEntryIds : []
    }, [data, error, loading])

    const mappedEntries = useMemo(() => {
        const userNotes = profile?.userLockNotes || {}

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
                    entry.belt !== 'Unranked' ? 'Is Ranked' : undefined,
                    userNotes[entry.id] ? 'Has Personal Notes' : undefined,
                ].flat().filter(x => x),
                collection: collectionOptions.locks.map.map(m => profile && profile[m.key] && profile[m.key].includes(entry.id) ? m.label : 'Not ' + m.label),
                collectionSaves: collectionStatsById[entry.id] || 0,
                simpleBelt: entry.belt.replace(/\s\d/g, ''),
                personalNotes: userNotes[entry.id]
            }))
    }, [allEntries, profile])

    const searchedBeltEntries = useMemo(() => {
        if (!search) return mappedEntries

        // Check for exact search match by id
        const exactMatch = search && mappedEntries.find(e => e.id === search)
        if (exactMatch) {
            return [exactMatch]
        }
        const searchEntries = fuzzysort.go(removeAccents(search), mappedEntries, {keys: fuzzySortKeys, threshold: -23000})
            .map(result => ({
                ...result.obj,
                score: result.score
            }))
            .filter(entry => entry.score > 0.23)
        if (tab === 'search' || !tab) {
            return searchEntries
        } else {
            return searchEntries.filter(entry => entry.simpleBelt === tab)
        }

    }, [mappedEntries, search, tab])

    const visibleEntries = useMemo(() => {
        // Filter the data
        let filtered = filterEntries(filters, searchedBeltEntries)

        return sort
            ? filtered.sort((a, b) => {
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
                    return Math.floor(dayjs(b.lastUpdated).valueOf() / 3600) - Math.floor(dayjs(a.lastUpdated).valueOf() / 3600)
                        || beltSort(a.belt, b.belt)
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'dateAdded') {
                    return Math.floor(dayjs(b.dateAdded).valueOf() / 3600 * 24) - Math.floor(dayjs(a.dateAdded).valueOf() / 3600 * 24)
                        || beltSort(a.belt, b.belt)
                        || a.fuzzy.localeCompare(b.fuzzy)
                }
            })
            : filtered
    }, [filters, searchedBeltEntries, sort])

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const mappedBeltEntries = useMemo(() => {
        if (tab === 'search' || !tab) {
            return mappedEntries
        } else {
            return mappedEntries.filter(entry => entry.simpleBelt === tab)
        }
    }, [tab, mappedEntries])

    const beltEntries = useMemo(() => {
        if (tab === 'search' || !tab) {
            return visibleEntries
        } else {
            return visibleEntries.filter(entry => entry.simpleBelt === tab)
        }
    }, [tab, visibleEntries])

    const lockbazzarAvailable = useCallback(id => {
        return lockbazzarIds?.includes(id)
    }, [lockbazzarIds])

    const blackBeltUser = useMemo(() => {
        return profile?.blackBeltAwardedAt > 0
    }, [profile])

    const value = useMemo(() => ({
        allEntries,
        mappedEntries,
        searchedBeltEntries,
        visibleEntries,
        mappedBeltEntries,
        beltEntries,
        getEntryFromId,
        expandAll,
        profile,
        blackBeltUser,
        lockbazzarAvailable
    }), [allEntries, mappedEntries, searchedBeltEntries, visibleEntries, mappedBeltEntries, beltEntries, getEntryFromId, expandAll, profile, blackBeltUser, lockbazzarAvailable])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

const urls = {lockbazzarEntryIds}

export default DataContext
