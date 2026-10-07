import React, {useCallback, useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
import ClassificationContext from '../app/ClassificationContext.jsx'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import entryName from '../entries/entryName'
import searchEntriesForText from '../filters/searchEntriesForText'
import belts, {highestBelt} from '../data/belts.js'
import dayjs from 'dayjs'
import collectionOptions from '../data/collectionTypes'
import {getLockSortComparator} from '../locks/lockSortComparators'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'

export function ClassificationDataProvider({children, allEntries}) {
    const {user} = useContext(AuthContext)
    const profile = useContext(DBContext)

    const {allVotes, allAdminActions} = useContext(ClassificationContext)

    const {filters: allFilters, activeFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const voteFilterGroups = useMemo(() => {
        return activeFilterGroups().filter(g => ['displayName', 'votedBelt'].includes(g.fieldName))
    }, [activeFilterGroups])

    const mappedVotes = useMemo(() => {
        return allVotes
            .sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf())
            .map(vote => {
                const latestAdminAction = allAdminActions
                    .sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf())
                    .find(action => action.entryId === vote.entryId) ?? {}
                return {
                    ...vote,
                    latestAdminAction: latestAdminAction
                }
            }) || []
    }, [allAdminActions, allVotes])

    const currentVotes = useMemo(() => {
        return mappedVotes
            .filter(vote => (dayjs(vote.updatedAt).isAfter(vote.latestAdminAction.updatedAt)
                || !vote.latestAdminAction.id)) || []
    }, [mappedVotes])

    const currentUserVotes = useMemo(() => {
        return currentVotes
            .sort((a, b) => dayjs(b.updatedAt).valueOf - dayjs(a.updatedAt).valueOf)
            .filter(vote => vote.userId === user?.uid) ?? null
    }, [currentVotes, user])

    const getUserVote = useCallback((entryId) => {
        return currentUserVotes
            .find(vote => vote.entryId === entryId) ?? null
    }, [currentUserVotes])

    const getAdminAction = useCallback((entry) => {
        return allAdminActions
            .sort((a, b) => dayjs(b.updatedAt).valueOf - dayjs(a.updatedAt).valueOf)
            .find(action => action.entryId === entry.id) ?? null
    }, [allAdminActions])

    const getCurrentVotes = useCallback((entry) => {
        const adminAction = getAdminAction(entry)
        return mappedVotes
            .find(vote => vote.entryId === entry.id
                && (dayjs(vote.updatedAt).isAfter(adminAction.updatedAt)
                    || !adminAction.id)) ?? null
    }, [getAdminAction, mappedVotes])

    const isActive = useCallback((entry) => {
        const adminAction = getAdminAction(entry) ?? {}
        return entry.belt === 'Unranked' ||
            (adminAction.id && dayjs(adminAction.updatedAt).isAfter(dayjs(entry.currentBeltDate)) && adminAction.status !== 'Settled')
    }, [getAdminAction])

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => {
                const allVoteEntries = allVotes.filter(vote => vote.entryId === entry.id)
                const maxVoteDate = Math.max(...allVoteEntries.map(vote => dayjs(vote.updatedAt).valueOf()))
                const voteEntries = filterEntriesAdvanced({
                    advancedFilterGroups: voteFilterGroups,
                    entries: allVoteEntries
                }) ?? []

                const classificationActive = isActive(entry)

                const displayName = voteEntries.map(v => v.displayName)
                const votedBelt = voteEntries.map(v => v.votedBelt)
                const voteCounts = voteEntries.reduce((acc, vote) => {
                    acc[vote.votedBelt] = (acc[vote.votedBelt] || 0) + 1
                    return acc
                }, {})
                const leadingBelt = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b, '')
                const hasConsensus = voteCounts[leadingBelt] >= 3 && (voteCounts[leadingBelt] >= voteEntries.length / 2) ? 'Yes' : 'No'

                return {
                    ...entry,
                    assignedBelt: entry.belt,
                    displayName,
                    classificationActive,
                    votedBelt,
                    voteEntries,
                    hasVotes: voteEntries.length > 0 ? 'Yes' : 'No',
                    voteCount: voteEntries.length,
                    hasConsensus,
                    highestVoteBelt: highestBelt(votedBelt),
                    maxVoteDate,
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
                                displayName.join(',')
                            ])
                            .join(',')
                    )
                }
            })
    }, [allEntries, allVotes, isActive, profile, voteFilterGroups])

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, [...mappedEntries])
    }, [mappedEntries, search])

    const allVisibleEntries = useMemo(() => {
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: activeFilterGroups(),
            entries: mappedEntries
        })

        const searched = searchEntriesForText(search, [...filtered]).sort((a, b) => {
            return a.fuzzy.localeCompare(b.fuzzy)
        })

        return sort
            ? searched.sort(getLockSortComparator(sort))
            : searched

    }, [activeFilterGroups, mappedEntries, search, sort])

    const visibleEntries = useMemo(() => {
        return allVisibleEntries.filter(e => e.classificationActive)
    }, [allVisibleEntries])

    const getEntryFromId = useCallback(id => {
        return mappedEntries.find(e => e.id === id)
    }, [mappedEntries])

    const value = useMemo(() => ({
        mappedVotes,
        currentUserVotes,
        getUserVote,
        getAdminAction,
        getCurrentVotes,
        mappedEntries,
        visibleEntries,
        searchedEntries,
        getEntryFromId,
        expandAll,
        profile,
    }), [mappedVotes, currentUserVotes, getUserVote, getAdminAction, getCurrentVotes, mappedEntries, visibleEntries, searchedEntries, getEntryFromId, expandAll, profile])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext
