import React, {useCallback, useContext, useMemo} from 'react'
import DataContext from '../context/DataContext.jsx'
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
import historicalVotes from '../data/classification-votes-historical.json'

const votesByEntry = new Map()
historicalVotes.forEach(vote => {
    const entryVotes = votesByEntry.get(vote.entryId) ?? []
    entryVotes.push(vote)
    votesByEntry.set(vote.entryId, entryVotes)
})
votesByEntry.forEach(votes => votes.sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()))

export function HistoricalVoteDataProvider({children, allEntries}) {
    const {profile} = useContext(DBContext)

    const {filters: allFilters, activeFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const voteFilterGroups = useMemo(() => {
        return activeFilterGroups().filter(g => ['displayName', 'votedBelt'].includes(g.fieldName))
    }, [activeFilterGroups])

    const mappedEntries = useMemo(() => {
        return allEntries
            .filter(entry => votesByEntry.has(entry.id))
            .map(entry => {
                const allHistoricalVotes = votesByEntry.get(entry.id)
                const filteredVotes = filterEntriesAdvanced({
                    advancedFilterGroups: voteFilterGroups,
                    entries: allHistoricalVotes
                }) ?? []
                const voteStats = classificationVoteStats(allHistoricalVotes)

                const displayName = filteredVotes.map(v => v.displayName)
                const votedBelt = filteredVotes.map(v => v.votedBelt)
                return {
                    ...entry,
                    assignedBelt: entry.belt,
                    displayName,
                    classificationActive: false,
                    classificationStatus: 'Has Votes',
                    votedBelt,
                    historicalVotes: filteredVotes,
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
                                allHistoricalVotes.map(vote => vote.displayName).join(',')
                            ])
                            .join(',')
                    )
                }
            })
    }, [allEntries, profile, voteFilterGroups]).filter(entry => entry.historicalVotes.length)

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, mappedEntries)
    }, [mappedEntries, search])

    const visibleEntries = useMemo(() => {
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
