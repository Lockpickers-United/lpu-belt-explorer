import React, {useCallback, useContext, useMemo} from 'react'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import useData from '../util/useData.jsx'
import {allProjectsEvidence} from '../data/dataUrls'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import entryName from '../entries/entryName'
import searchEntriesForText from '../filters/searchEntriesForText'
import lockEntries from '../data/data.json'

export function DataProvider({children, profile}) {
    const {data, loading, error, _errorMessage} = useData({urls})
    const updateTime = dayjs(data?.metadata?.updatedDateTime).format('MM/DD/YY HH:mm')

    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort, expandAll} = allFilters

    const allEntries = useMemo(() => {
        return data && !loading && !error ? data?.allProjectsEvidence?.evidence : []
    }, [data, error, loading])

    const mappedEntries = useMemo(() => {
        return allEntries?.map(entry => {

            const lock = lockEntries.find(lockEntry => lockEntry.id === entry.entryId)

            return {
                ...lock,
                ...entry,
                tierName: tierNames[entry.tier],
                fuzzy: removeAccents(
                    [entryName(entry, 'long')]
                        .concat([
                            entry.discipline,
                            entry.displayName,
                            entry.tabName
                        ])
                        .join(',')
                ),
            }
        })
    }, [allEntries])

    const searchedEntries = useMemo(() => {
        return searchEntriesForText(search, [...mappedEntries])
    },[mappedEntries, search])

    const visibleEntries = useMemo(() => {
        // Filter the data
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

    const value = useMemo(() => ({
        allEntries,
        mappedEntries,
        visibleEntries,
        searchedEntries,
        getEntryFromId,
        expandAll,
        profile,
        updateTime
    }), [allEntries, mappedEntries, visibleEntries, searchedEntries, getEntryFromId, expandAll, profile, updateTime])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const urls = {allProjectsEvidence}
const tierNames = {
    'T1': 'Tier 1',
    'T2': 'Tier 2',
    'T3': 'Tier 3',
    'T4': 'Tier 4',
    'T5': 'Tier 5'
}

export default DataContext
