import React, {useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../../context/DataContext'
import FilterContext from '../../context/FilterContext'
import dayjs from 'dayjs'
import {beltSort, beltSortReverse} from '../../data/belts'
import removeAccents from 'remove-accents'
import {collectionsFullBB} from '../../data/dataUrls'
import useData from '../../util/useData.jsx'
import allEntries from '../../data/data.json'

export function PopularLocksDataProvider({children}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, ...filters} = allFilters

    const {data, loading, error} = useData({urls})
    const popularLocks = useMemo(() => data?.collectionsFullBB?.scorecardLocks, [data])

    const allPopularEntries = useMemo(() => {
        return popularLocks
            ? popularLocks.map(lock => {
                return allEntries.find(e => e.id === lock['lockID'])
            })
            : []
    }, [popularLocks])

    const mappedEntries = useMemo(() => {
        return allPopularEntries
            .map(entry => ({
                ...entry,
                makes: entry?.makeModels?.map(({make}) => make),
                fuzzy: removeAccents(
                    entry?.makeModels?.map(({make, model}) => [make, model])
                        .flat()
                        .filter(a => a)
                        .concat([
                            entry.version,
                            entry.notes,
                            entry.belt
                        ])
                        .join(',')
                    + ' '
                ),
                simpleBelt: entry?.belt?.replace(/\s\d/g, '')
            }))
    }, [allPopularEntries])

    const popularEntries = useMemo(() => {
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

        // If there is a search term, fuzzy match that
        const searched = search
            ? fuzzysort.go(removeAccents(search), filtered, {keys: fuzzySortKeys, threshold: -25000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
            : filtered

        return sort
            ? searched.sort((a, b) => {
                if (sort === 'danPointsAscending') {
                    return a.points - b.points
                        || dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                } else if (sort === 'danPointsDescending') {
                    return b.points - a.points
                        || dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                } else if (sort === 'dateAscending') {
                    return dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
                        || beltSortReverse(a.simpleBelt, b.simpleBelt)
                } else if (sort === 'dateDescending') {
                    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                        || beltSortReverse(a.simpleBelt, b.simpleBelt)
                } else if (sort === 'beltAscending') {
                    return beltSort(a.belt, b.belt)
                        || dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                } else if (sort === 'beltDescending') {
                    return beltSortReverse(a.belt, b.belt)
                        || dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                } else if (sort === 'alphaAscending') {
                    return a.fuzzy.localeCompare(b.fuzzy)
                        || b.points - a.points
                } else if (sort === 'alphaDescending') {
                    return b.fuzzy.localeCompare(a.fuzzy)
                        || b.points - a.points
                }
            })
            : searched.sort((a, b) => {
                return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                    || beltSortReverse(a.belt, b.belt)
                    || a.fuzzy.localeCompare(b.fuzzy)
            })
    }, [filters, mappedEntries, search, sort])

    //console.log('popularEntries', popularEntries)

    const foo = 'bar'
    console.log('foo', foo)

    const value = useMemo(() => ({
        allPopularEntries,
        popularEntries,
        foo
    }), [allPopularEntries, popularEntries, foo])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

const urls = {
    collectionsFullBB
}

export default PopularLocksDataProvider
