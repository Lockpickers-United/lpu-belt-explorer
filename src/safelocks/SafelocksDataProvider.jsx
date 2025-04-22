import React, {useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import collectionOptions from '../data/collectionTypes'
import removeAccents from 'remove-accents'
import {groupSort, groupSortReverse} from './groups'

export function SafelocksDataProvider({children, allEntries, profile}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, expandAll, ...filters} = allFilters

    const mappedEntries = useMemo(() => {
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
                    entry.links?.length > 0 ? 'Has Links' : 'No Links'
                ].flat().filter(x => x),
                collection: collectionOptions.safelocks.map.map(m => profile && profile[m.key] && profile[m.key].includes(entry.id) ? m.label : 'Not ' + m.label),
            }))
    }, [allEntries, profile])

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
            .sort((a, b) => { return a.fuzzy.localeCompare(b.fuzzy)})

        // If there is a search term, fuzzy match that
        const searched = search
            ? fuzzysort.go(removeAccents(search), filtered, {keys: fuzzySortKeys, threshold: -25000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
            : filtered

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
    }, [filters, mappedEntries, search, sort])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries
    }), [allEntries, visibleEntries])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default SafelocksDataProvider
