import React, {useCallback, useContext, useMemo, useState} from 'react'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import {statusSort} from './rankingRequestData'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'
import SearchEntries from '../filters/SearchEntries.jsx'

/**
 * @typedef {object} entry
 * @typedef {object} usernames
 * @prop entry.approximateBelt
 * @prop entry.dateRequested
 * @prop requestedBy
 */

export function DataProvider({children, allEntries=[], profile}) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, expandAll, ..._filters} = allFilters

    const [searchCutoff, setSearchCutoff] = useState(0.30)

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => ({
                ...entry,
                originalEntry: entry,
                makes: entry.makeModels[0].make ? entry.makeModels.map(({make}) => make) : entry.makeModels[0].model,
                requestCount: entry.requestedBy?.length,
                danPoints: 0,
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
                    dayjs(entry.dateRequested).isAfter(dayjs().subtract(1, 'days')) ? 'Requested Recently' : undefined
                ].flat().filter(x => x)
            }))
    }, [allEntries])


    const searchedEntries = useMemo(() => {
        return SearchEntries(mappedEntries, search, searchCutoff)
    }, [mappedEntries, search, searchCutoff])

    const visibleEntries = useMemo(() => {

        // Filter the data
        const filtered = filterEntriesAdvanced({
            advancedFilterGroups: advancedFilterGroups(),
            entries: mappedEntries
        })

        const searched = SearchEntries(filtered, search, searchCutoff)

        const effectiveSort = sort ?? 'dateRequested'
        return [...searched].sort((a, b) => {
                if (effectiveSort === 'alphaAscending') {
                    return a.fuzzy.localeCompare(b.fuzzy)
                } else if (effectiveSort === 'alphaDescending') {
                    return b.fuzzy.localeCompare(a.fuzzy)
                } else if (effectiveSort === 'requestStatus') {
                    return statusSort(a.requestStatus, b.requestStatus)
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (effectiveSort === 'requestCount') {
                    return b.requestCount - a.requestCount
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (effectiveSort === 'recentlyUpdated') {
                    return Math.floor(dayjs(b.lastUpdated).valueOf() / 3600) - Math.floor(dayjs(a.lastUpdated).valueOf() / 3600)
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (effectiveSort === 'dateRequested') {
                    return dayjs(b.dateRequested).valueOf() - dayjs(a.dateRequested).valueOf()
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else {
                    return dayjs(b.dateRequested).valueOf() - dayjs(a.dateRequested).valueOf()
                        || a.fuzzy.localeCompare(b.fuzzy)
                }
            })
    }, [advancedFilterGroups, mappedEntries, search, searchCutoff, sort])

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const value = useMemo(() => {
        return {
            allEntries,
            searchedEntries,
            visibleEntries,
            getEntryFromId,
            expandAll,
            profile,
            searchCutoff, setSearchCutoff
        }
    }, [allEntries, searchedEntries, visibleEntries, getEntryFromId, expandAll, profile, searchCutoff])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}
