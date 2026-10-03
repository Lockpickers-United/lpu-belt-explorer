import React, {useCallback, useContext, useMemo} from 'react'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import removeAccents from 'remove-accents'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import entryName from '../entries/entryName'
import searchEntriesForText from '../filters/searchEntriesForText'
import classificationEntries from '../data/classification-samples.json'
import lockEntries from '../data/data.json'
import belts from '../data/belts.js'
import dayjs from 'dayjs'
import collectionOptions from '../data/collectionTypes'

export function DataProvider({children, profile}) {
    const {allEntries} = useContext(DataContext)
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const mappedEntries = useMemo(() => {
        return lockEntries?.filter(l => classificationEntries.find(entry => entry.entryId === l.id)).map(entry => {

            const voteEntries = classificationEntries.filter(vote => vote.entryId === entry.id)
            const voters = voteEntries.map(v => v.displayName)
            const voteBelts = voteEntries.map(v => v.votedBelt)

            return {
                ...entry,
                voters,
                voteBelts,
                voteEntries,
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
                            voters.join(',')
                        ])
                        .join(',')
                )
            }
        })
    }, [profile])

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, [...mappedEntries])
    }, [mappedEntries, search])

    const visibleEntries = useMemo(() => {
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries
        })

        const searched = searchEntriesForText(search, [...filtered])

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'discipline') {
                    return a.discipline.localeCompare(b.discipline)
                        || a.pickerName.localeCompare(b.pickerName)
                } else if (sort === 'tier') {
                    return a.tier.localeCompare(b.tier)
                        || a.pickerName.localeCompare(b.pickerName)
                } else if (sort === 'date') {
                    return a.date.localeCompare(b.date)
                        || a.pickerName.localeCompare(b.pickerName)
                } else if (sort === 'source') {
                    return a.source.localeCompare(b.source)
                        || a.pickerName.localeCompare(b.pickerName)
                } else if (sort === 'evidenceUrl') {
                    return a.evidenceUrl.localeCompare(b.evidenceUrl)
                        || a.pickerName.localeCompare(b.pickerName)
                } else {
                    return a.pickerName.localeCompare(b.pickerName)
                }
            })
            : searched
    }, [advancedFilterGroups, mappedEntries, search, sort])

    //console.log('visibleEntries', visibleEntries)

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

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
