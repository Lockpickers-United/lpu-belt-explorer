import React, {useCallback, useContext, useMemo, useState} from 'react'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import useData from '../util/useData.jsx'
import {allProjectsEvidence} from '../data/dataUrls'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import entryName from '../entries/entryName'
import searchEntriesForText from '../filters/searchEntriesForText'

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
            let host
            try {
                const url = new URL(entry.evidenceUrl)
                host = url.hostname
            } catch (_error) {
                //console.error('Invalid URL:', error)
            }
            return {
                ...entry,
                pickerName: entry.displayName || entry.tabName,
                tierName: tierNames[entry.tier],
                dateText: dayjs(entry.date).format('MM/DD/YY'),
                source: entry.unclaimed ? 'Dan Sheet' : 'Scorecard',
                envidenceHost: host,
                fuzzy: removeAccents(
                    [entryName(entry, 'long')]
                        .concat([
                            entry.discipline,
                            entry.displayName,
                            entry.tabName
                        ])
                        .join(',')
                ),
                score: 1
            }
        })
    }, [allEntries])

    const searchedEntries = searchEntriesForText(search, [...mappedEntries])

    const visibleEntries = useMemo(() => {
        // Filter the data
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries
        })

        const searched = searchEntriesForText(search, [...filtered])

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'popularity') {
                    return b.collectionSaves - a.collectionSaves
                        || b.views - a.views
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'alphaAscending') {
                    return a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'alphaDescending') {
                    return b.fuzzy.localeCompare(a.fuzzy)
                } else if (sort === 'recentlyUpdated') {
                    return Math.floor(dayjs(b.lastUpdated).valueOf() / 3600) - Math.floor(dayjs(a.lastUpdated).valueOf() / 3600)
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'dateAdded') {
                    return Math.floor(dayjs(b.dateAdded).valueOf() / 3600 * 24) - Math.floor(dayjs(a.dateAdded).valueOf() / 3600 * 24)
                        || a.fuzzy.localeCompare(b.fuzzy)
                }
            })
            : searched
    }, [advancedFilterGroups, mappedEntries, search, sort])

    console.log('visibleEntries', visibleEntries)

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
