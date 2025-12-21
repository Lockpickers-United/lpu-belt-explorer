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
import {setDeepUnique} from '../util/setDeep'
import {isValidRegex} from '../util/stringUtils'
import entryName from '../entries/entryName'

export function DataProvider({children, allEntries, profile}) {

    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, tab, sort, expandAll} = allFilters
    const {data, loading, error} = useData({urls})
    const lockbazzarIds = useMemo(() => {
        return data && !loading && !error ? data.lockbazzarEntryIds : []
    }, [data, error, loading])

    const [searchCutoff, setSearchCutoff] = useState({A: '0.40', B: '0.25'})
    const [searchVariant, setSearchVariant] = useState('A')

    const mappedEntries = useMemo(() => {
        const userNotes = profile?.userLockNotes || {}
        return allEntries
            .map(entry => {
                let photographers = {}
                const newMedia = entry.media?.map(m => {
                    if (m && m.title && m.title?.includes('By:')) {
                        setDeepUnique(photographers, ['names'], m.title.replace('By: ', '').trim())
                    }
                    if (m?.thumbnailUrl?.includes('flickr.com')) {
                        m.thumbnailUrl = m.thumbnailUrl.replace('_w_d.jpg', '_w.jpg')
                    }
                    return m
                })

                return {
                    ...entry,
                    media: newMedia,
                    makes: entry.makeModels[0].make ? entry.makeModels.map(({make}) => make) : entry.makeModels[0].model,
                    fuzzy: removeAccents(
                        [entryName(entry, 'long')]
                            .concat([
                                entry.searchKeywords,
                                entry.notes
                                //entry.version,
                                //entry.belt
                            ])
                            .join(',')
                    ),
                    fuzzyB: removeAccents(
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
                    score: 1,
                    content: [
                        entry.media?.some(m => !m.fullUrl.match(/youtube\.com/)) ? 'Has Images' : 'No Images',
                        entry.media?.some(m => m.fullUrl.match(/youtube\.com/)) ? 'Has Video' : 'No Video',
                        entry.media?.some(m => m.label) ? 'Model Photos' : undefined,
                        entry.links?.length > 0 ? 'Has Links' : 'No Links',
                        belts[entry.belt].danPoints > 0 ? 'Worth Dan Points' : undefined,
                        dayjs(entry.lastUpdated).isAfter(dayjs().subtract(1, 'days')) ? 'Updated Recently' : undefined,
                        entry.belt !== 'Unranked' ? 'Is Ranked' : undefined,
                        userNotes[entry.id] ? 'Has Personal Notes' : undefined
                    ].flat().filter(x => x),
                    collection: collectionOptions.locks.map.map(m => profile && profile[m.key] && profile[m.key].includes(entry.id) ? m.label : 'Not ' + m.label),
                    collectionSaves: collectionStatsById[entry.id] || 0,
                    simpleBelt: entry.belt.replace(/\s\d/g, ''),
                    filterBelts: entry.belt.startsWith('Black') ? ['Black', entry.belt] : [entry.belt],
                    personalNotes: userNotes[entry.id],
                    photographers: photographers?.names,
                }
            })
    }, [allEntries, profile])

    const allMakes = useMemo(() => {
        return allEntries.reduce((acc, entry) => {
            entry.makeModels.forEach(mm => {
                if (mm.make && !acc.includes(mm.make)) {
                    acc.push(mm.make)
                }
            })
            return acc
        }, []).sort((a, b) => a.localeCompare(b))
    }, [allEntries])

    const closestMake = useMemo(() => {
        return search
            ? fuzzysort.go(removeAccents(search), allMakes, {limit: 1, threshold: .2})
                .map(result => ({
                    make: result.target,
                    score: result.score
                }))?.[0]
            : undefined
    }, [allMakes, search])

    const anyMatch = useMemo(() => {
        return search
            ? fuzzysort.go(removeAccents(search), mappedEntries, {keys: fuzzySortKeys, limit: 1, threshold: 0})
                .map(result => ({
                    name: entryName(result.obj, 'long'),
                    score: result.score
                }))?.[0]
            : undefined
    }, [mappedEntries, search])

    const searchEntriesForText = useCallback((entries) => {
        if (!search) return entries

        const exactMatch = search && entries.find(e => e.id === search)
        if (exactMatch) {
            return [exactMatch]
        }

        const regex = /^\/(.*)\/$/.exec(search)
        if (regex && isValidRegex(regex[1])) {
            return entries.reduce((acc, entry) => {
                if (entryName(entry, 'long').match(new RegExp(regex[1], 'i'))) acc.push(entry)
                return acc
            }, [])
        }

        const coreSearch = searchVariant === 'A'
            ? fuzzysort.go(removeAccents(search), entries, {keys: fuzzySortKeys, threshold: -23000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
                .filter(entry => entry.score > parseFloat(searchCutoff['A']))
                .sort((a, b) => {
                    return Math.floor(b.score * 10) - Math.floor(a.score * 10)
                        || a.fuzzy.localeCompare(b.fuzzy)
                        || beltSort(a.belt, b.belt)
                })
            : fuzzysort.go(removeAccents(search), entries, {keys: ['fuzzyB'], threshold: -23000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
                .filter(entry => entry.score > parseFloat(searchCutoff['B']))

        return searchVariant === 'A' && ['master', 'master lock', 'abus'].includes(search.toLowerCase())
            ? coreSearch.sort((a, b) => {
                return parseFloat(a.modelNum || '99999') - parseFloat(b.modelNum || '99999')
                    || Math.floor(b.score * 10) - Math.floor(a.score * 10)
                    || a.fuzzy.localeCompare(b.fuzzy)
            })
            : coreSearch

    }, [search, searchCutoff, searchVariant])

    const searchedBeltEntries = useMemo(() => {
        if (tab === 'search' || !tab) {
            return searchEntriesForText(mappedEntries)
        } else {
            return searchEntriesForText(mappedEntries).filter(entry => entry.simpleBelt === tab)
        }
    }, [mappedEntries, searchEntriesForText, tab])

    const visibleEntries = useMemo(() => {
        // Filter the data
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries
        })
        const searched = searchEntriesForText([...filtered])

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
    }, [advancedFilterGroups, mappedEntries, searchEntriesForText, sort])

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
        closestMake,
        anyMatch,
        getEntryFromId,
        expandAll,
        profile,
        blackBeltUser,
        lockbazzarAvailable,
        searchCutoff, setSearchCutoff,
        searchVariant, setSearchVariant
    }), [allEntries,
        mappedEntries,
        searchedBeltEntries,
        visibleEntries,
        visibleBeltEntries,
        closestMake,
        anyMatch,
        getEntryFromId,
        expandAll,
        profile,
        blackBeltUser,
        lockbazzarAvailable,
        searchCutoff, setSearchCutoff,
        searchVariant, setSearchVariant
    ])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

const urls = {lockbazzarEntryIds}

export default DataContext
