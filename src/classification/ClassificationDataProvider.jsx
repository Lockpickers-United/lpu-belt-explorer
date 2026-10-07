import React, {useCallback, useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import ClassificationContext from '../app/ClassificationContext.jsx'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import entryName from '../entries/entryName'
import searchEntriesForText from '../filters/searchEntriesForText'
import belts from '../data/belts.js'
import dayjs from 'dayjs'
import collectionOptions from '../data/collectionTypes'
import {getLockSortComparator} from '../locks/lockSortComparators'
import DBContext from '../app/DBContext.jsx'
import classificationVoteStats from './classificationVoteStats.js'

export function ClassificationDataProvider({children, allEntries}) {
    const {profile} = useContext(DBContext)

    const {
        getAdminActionStatus,
        getCurrentVotes,
        getPreviousVotes,
        isActive
    } = useContext(ClassificationContext)

    const {filters: allFilters, activeFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const voteFilterGroups = useMemo(() => {
        return activeFilterGroups().filter(g => ['displayName', 'votedBelt'].includes(g.fieldName))
    }, [activeFilterGroups])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => {
                const allCurrentVotes = getCurrentVotes(entry)
                const currentVotes = filterEntriesAdvanced({
                    advancedFilterGroups: voteFilterGroups,
                    entries: allCurrentVotes
                }) ?? []
                const voteStats = classificationVoteStats(allCurrentVotes)

                const classificationActive = isActive(entry)
                const classificationStatus = getAdminActionStatus(entry)

                const displayName = currentVotes.map(v => v.displayName)
                const votedBelt = currentVotes.map(v => v.votedBelt)
                return {
                    ...entry,
                    assignedBelt: entry.belt,
                    displayName,
                    classificationActive,
                    classificationStatus,
                    votedBelt,
                    previousVotes: getPreviousVotes(entry),
                    currentVotes,
                    ...voteStats,
                    makes: entry.makeModels[0].make ? entry.makeModels.map(({make}) => make) : entry.makeModels[0].model,
                    content: [
                        entry.media?.some(m => !m.fullUrl.match(/youtube\.com/)) ? 'Has Images' : 'No Images',
                        entry.media?.some(m => m.fullUrl.match(/youtube\.com/)) ? 'Has Video' : 'No Video',
                        entry.media?.some(m => m.label) ? 'Model Photos' : undefined,
                        entry.links?.length > 0 ? 'Has Links' : 'No Links',
                        belts[entry.belt].danPoints > 0 ? 'Worth Dan Points' : undefined,
                        dayjs(entry.lastUpdated).isAfter(dayjs().subtract(1, 'days')) ? 'Updated Recently' : undefined,
                        entry.belt !== 'Unranked' ? 'Is Ranked' : undefined,
                        profile?.userLockNotes?.[entry.id] ? 'Has Personal Notes' : undefined
                    ].flat().filter(x => x),
                    collection: collectionOptions.locks.map.map(m => profile && profile[m.key] && profile[m.key].includes(entry.id) ? m.label : 'Not ' + m.label),
                    fuzzy: removeAccents(
                        [entryName(entry, 'long')]
                            .concat([
                                allCurrentVotes.map(vote => vote.displayName).join(',')
                            ])
                            .join(',')
                    )
                }
            })
    }, [allEntries, getAdminActionStatus, getCurrentVotes, getPreviousVotes, isActive, profile, voteFilterGroups])

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, mappedEntries.filter(entry => entry.classificationActive))
    }, [mappedEntries, search])

    const allVisibleEntries = useMemo(() => {
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: activeFilterGroups(),
            entries: mappedEntries.filter(entry => entry.classificationActive)
        })
        const searched = searchEntriesForText(search, [...filtered]).sort((a, b) => {
            return a.fuzzy.localeCompare(b.fuzzy)
        })
        return sort
            ? searched.sort(getLockSortComparator(sort))
            : searched
    }, [activeFilterGroups, mappedEntries, search, sort])

    const visibleEntries = allVisibleEntries

    const getEntryFromId = useCallback(id => {
        return mappedEntries.find(e => e.id === id)
    }, [mappedEntries])

    const value = useMemo(() => ({
        mappedEntries,
        visibleEntries,
        searchedEntries,
        getEntryFromId,
        expandAll,
        profile
    }), [mappedEntries, visibleEntries, searchedEntries, getEntryFromId, expandAll, profile])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext
