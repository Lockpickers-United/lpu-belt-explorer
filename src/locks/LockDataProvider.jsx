import React, {useCallback, useContext, useMemo, useState} from 'react'
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
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'

export function DataProvider({children, allEntries, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, tab, sort, expandAll} = allFilters
    const {data, loading, error} = useData({urls})
    const lockbazzarIds = useMemo(() => {
        return data && !loading && !error ? data.lockbazzarEntryIds : []
    }, [data, error, loading])

    const [searchCutoff, setSearchCutoff] = useState(0.30) // eslint-disable-line no-unused-vars

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
                    entry.belt !== 'Unranked' ? 'Is Ranked' : undefined,
                    userNotes[entry.id] ? 'Has Personal Notes' : undefined
                ].flat().filter(x => x),
                collection: collectionOptions.locks.map.map(m => profile && profile[m.key] && profile[m.key].includes(entry.id) ? m.label : 'Not ' + m.label),
                collectionSaves: collectionStatsById[entry.id] || 0,
                simpleBelt: entry.belt.replace(/\s\d/g, ''),
                filterBelts: entry.belt.startsWith('Black') ? ['Black', entry.belt]  : [entry.belt],
                personalNotes: userNotes[entry.id]
            }))
    }, [allEntries, profile])

    const searchEntries = useCallback((entries) => {
        const exactMatch = search && entries.find(e => e.id === search)
        if (exactMatch) {
            return [exactMatch]
        }
        return !search
            ? entries
            : fuzzysort.go(removeAccents(search), entries, {keys: fuzzySortKeys, threshold: -23000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
                .filter(entry => entry.score > searchCutoff)
    }, [search, searchCutoff])

    const searchedBeltEntries = useMemo(() => {
        if (tab === 'search' || !tab) {
            return searchEntries(mappedEntries)
        } else {
            return searchEntries(mappedEntries).filter(entry => entry.simpleBelt === tab)
        }
    },[mappedEntries, searchEntries, tab])

    const visibleEntries = useMemo(() => {
        // Filter the data
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries,
        })
        const searched = searchEntries([...filtered])

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
                    return Math.floor(dayjs(b.lastUpdated).valueOf() / 3600) - Math.floor(dayjs(a.lastUpdated).valueOf() / 3600)
                        || beltSort(a.belt, b.belt)
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'dateAdded') {
                    return Math.floor(dayjs(b.dateAdded).valueOf() / 3600 * 24) - Math.floor(dayjs(a.dateAdded).valueOf() / 3600 * 24)
                        || beltSort(a.belt, b.belt)
                        || a.fuzzy.localeCompare(b.fuzzy)
                }
            })
            : searched
    }, [advancedFilterGroups, mappedEntries, searchEntries, sort])

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const visibleBeltEntries = useMemo(() => {
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
        visibleBeltEntries,
        getEntryFromId,
        expandAll,
        profile,
        blackBeltUser,
        lockbazzarAvailable,
        searchCutoff,
        setSearchCutoff
    }), [allEntries,
        mappedEntries,
        searchedBeltEntries,
        visibleEntries,
        visibleBeltEntries,
        getEntryFromId,
        expandAll,
        profile,
        blackBeltUser,
        lockbazzarAvailable,
        searchCutoff,
        setSearchCutoff])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

const urls = {lockbazzarEntryIds}

export default DataContext
