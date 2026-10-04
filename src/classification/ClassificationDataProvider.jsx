import React, {useCallback, useContext, useMemo} from 'react'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import entryName from '../entries/entryName'
import searchEntriesForText from '../filters/searchEntriesForText'
import classificationEntries from '../data/classification-samples.json'
import lockEntries from '../data/data.json'
import belts, {highestBelt} from '../data/belts.js'
import dayjs from 'dayjs'
import collectionOptions from '../data/collectionTypes'
import {getLockSortComparator} from '../locks/lockSortComparators'

export function DataProvider({children, profile}) {
    const {allEntries} = useContext(DataContext)
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const voteFilterGroups = useMemo(() => {
        return advancedFilterGroups().filter(g => ['displayName', 'votedBelt'].includes(g.fieldName))
    }, [advancedFilterGroups])

    const mappedEntries = useMemo(() => {
        return lockEntries?.filter(l => classificationEntries.find(e => e.entryId === l.id)).map(entry => {

            const allVoteEntries = classificationEntries.filter(vote => vote.entryId === entry.id)

            const voteEntries = filterEntriesAdvanced({
                advancedFilterGroups: voteFilterGroups,
                entries: allVoteEntries
            }) ?? []

            //const filteredVoteEntries = voteEntries.filter(v => allFilters.voters.includes(v.displayName))
            const displayName = voteEntries.map(v => v.displayName)
            const votedBelt = voteEntries.map(v => v.votedBelt)
            const voteCounts = voteEntries.reduce((acc, vote) => {
                acc[vote.votedBelt] = (acc[vote.votedBelt] || 0) + 1
                return acc
            }, {})
            const leadingBelt = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b,'')
            const hasConsensus = voteCounts[leadingBelt] >= 3 && (voteCounts[leadingBelt] >= voteEntries.length/2) ? 'Yes' : 'No'

            return {
                ...entry,
                displayName,
                votedBelt,
                voteEntries,
                hasVotes: voteEntries.length > 0 ? 'Yes' : 'No',
                voteCount: voteEntries.length,
                hasConsensus,
                highestVoteBelt: highestBelt(votedBelt),
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
    }, [profile, voteFilterGroups])

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, [...mappedEntries])
    }, [mappedEntries, search])

    const visibleEntries = useMemo(() => {
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries
        })

        const searched = searchEntriesForText(search, [...filtered]).sort((a, b) => {
            return a.fuzzy.localeCompare(b.fuzzy)
        })

        return sort
            ? searched.sort(getLockSortComparator(sort))
            : searched

    }, [advancedFilterGroups, mappedEntries, search, sort])

    //console.log('visibleEntries', visibleEntries)

    const getEntryFromId = useCallback(id => {
        return mappedEntries.find(e => e.id === id)
    }, [mappedEntries])

    const lockbazzarAvailable = useCallback((_) => {
        return false
    }, [])

    const value = useMemo(() => ({
        allEntries,
        mappedEntries,
        visibleEntries,
        searchedEntries,
        getEntryFromId,
        expandAll,
        profile,
        lockbazzarAvailable
    }), [allEntries, mappedEntries, visibleEntries, searchedEntries, getEntryFromId, expandAll, profile, lockbazzarAvailable])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContext
