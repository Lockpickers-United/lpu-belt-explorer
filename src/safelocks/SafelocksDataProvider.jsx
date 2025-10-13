import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import collectionOptions from '../data/collectionTypes'
import removeAccents from 'remove-accents'
import {groupSort, groupSortReverse} from './groups'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'

export function SafelocksDataProvider({children, allEntries, profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const mappedEntries = useMemo(() => {
        const userNotes = profile?.userLockNotes || {}
        return allEntries
            .map(entry => ({
                ...entry,
                makeModels: [{make:entry.make, model:entry.model}],
                fuzzy: removeAccents([
                    entry.make,
                    entry.model
                ].join(',')),
                content: [
                    entry.media?.some(m => !m.fullUrl.match(/youtube\.com/)) ? 'Has Images' : 'No Images',
                    entry.media?.some(m => m.fullUrl.match(/youtube\.com/)) ? 'Has Video' : 'No Video',
                    entry.links?.length > 0 ? 'Has Links' : 'No Links',
                    userNotes[entry.id] ? 'Has Personal Notes' : undefined,
                ].flat().filter(x => x),
                collection: collectionOptions.safelocks.map.map(m => profile && profile[m.key] && profile[m.key].includes(entry.id) ? m.label : 'Not ' + m.label),
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
                .filter(entry => entry.score > 0.30)
    }, [search])

    const searchedEntries = useMemo(() => {
            return searchEntries(mappedEntries)
    },[mappedEntries, searchEntries])


    const visibleEntries = useMemo(() => {

        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries,
        })
        const searched = searchEntries([...filtered])

        const groupList = ['2', '2M', '1', '1R']
        const tierList = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5']

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'alphaAscending') {
                    return a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'alphaDescending') {
                    return b.fuzzy.localeCompare(a.fuzzy)
                } else if (sort === 'groupAscending') {
                    const groupA = groupList.includes(a.group) ? a.group : 'zzz'
                    const groupB = groupList.includes(b.group) ? b.group : 'zzz'
                    return groupSort(groupA, groupB)
                } else if (sort === 'groupDescending') {
                    const groupA = groupList.includes(a.group) ? a.group : ''
                    const groupB = groupList.includes(b.group) ? b.group : ''
                    return groupSortReverse(groupA, groupB)
                } else if (sort === 'tierAscending') {
                    const tierA = tierList.includes(a.tier) ? a.tier : 'zzz'
                    const tierB = tierList.includes(b.tier) ? b.tier : 'zzz'
                    return tierA.localeCompare(tierB)
                } else if (sort === 'tierDescending') {
                    return b.tier.localeCompare(a.tier)
                } else if (sort === 'recentlyUpdated') {
                    const dayA = dayjs(a.lastUpdated)
                    const dayB = dayjs(b.lastUpdated)
                    if (dayA.isAfter(dayB)) return -1
                    else if (dayB.isAfter(dayA)) return 1
                } else {
                    return a.fuzzy.localeCompare(b.fuzzy)
                }
            })
            : searched
    }, [advancedFilterGroups, mappedEntries, searchEntries, sort])

    const value = useMemo(() => ({
        allEntries,
        searchedEntries,
        visibleEntries,
        expandAll
    }), [allEntries, searchedEntries, visibleEntries, expandAll])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default SafelocksDataProvider
