import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import removeAccents from 'remove-accents'
import {statusSort} from './rankingRequestData'

/**
 * @typedef {object} entry
 * @typedef {object} usernames
 * @prop entry.approximateBelt
 * @prop entry.dateRequested
 * @prop approximateBelt
 */

export function DataProvider({children, allEntries, profile}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, expandAll, ...filters} = allFilters

    const mappedEntries = useMemo(() => {
        return allEntries
            .map(entry => ({
                ...entry,
                originalEntry: entry,
                makes: entry.makeModels[0].make ? entry.makeModels.map(({make}) => make) : entry.makeModels[0].model,
                requestCount: entry.requestedBy.length,
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

    const visibleEntries = useMemo(() => {
        // Filters as an array
        const filterArray = Object.keys(filters)
            .map(key => {
                const value = filters[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()

        // Filter the data
        const filtered = mappedEntries
            .filter(datum => {
                return filterArray.every(({key, value}) => {
                    return Array.isArray(datum[key])
                        ? datum[key].includes(value)
                        : datum[key] === value
                })
            })

        // Check for exact search match by id
        const exactMatch = search && filtered.find(e => e.id === search)
        let searched = filtered

        if (exactMatch) {
            searched = [exactMatch]
        } else if (search) {
            // If there is a search term, fuzzy match that
            searched = fuzzysort.go(removeAccents(search), filtered, {keys: fuzzySortKeys, threshold: -25000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
        }

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'alphaAscending') {
                    return a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'alphaDescending') {
                    return b.fuzzy.localeCompare(a.fuzzy)
                } else if (sort === 'requestStatus') {
                     return statusSort(a.requestStatus, b.requestStatus)
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'requestCount') {
                     return b.requestCount - a.requestCount
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'recentlyUpdated') {
                    return Math.floor(dayjs(b.lastUpdated).valueOf() / 3600) - Math.floor(dayjs(a.lastUpdated).valueOf() / 3600)
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'dateRequested') {
                    return dayjs(b.dateRequested).valueOf() - dayjs(a.dateRequested).valueOf()
                        || a.fuzzy.localeCompare(b.fuzzy)
                } else {
                    return dayjs(b.dateRequested).valueOf() - dayjs(a.dateRequested).valueOf()
                        || a.fuzzy.localeCompare(b.fuzzy)
                }
            })
            : searched.sort((a, b) => {
                return dayjs(b.dateRequested).valueOf() - dayjs(a.dateRequested).valueOf()
                    || a.fuzzy.localeCompare(b.fuzzy)

            })
    }, [filters, mappedEntries, search, sort])

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [allEntries])

    const value = useMemo(() => {
        return {
            allEntries,
            visibleEntries,
            getEntryFromId,
            expandAll,
            profile,
        }
    }, [allEntries, visibleEntries, getEntryFromId, expandAll, profile])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

