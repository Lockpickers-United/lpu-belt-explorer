import React, {useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import ScorecardDataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import {beltSort, beltSortReverse} from '../data/belts'
import removeAccents from 'remove-accents'
import allEntries from '../data/data.json'
import {getEntryFromId, getProjectEntryFromId, getAwardEntryFromId} from '../entries/entryutils'

export function ScorecardDataProvider({
                                          children,
                                          cardActivity,
                                          cardBBCount,
                                          cardDanPoints,
                                          cardEligibleDan,
                                          cardNextDanPoints,
                                          cardNextDanLocks,
                                          popularLocks
                                      }) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, locks, ...filters} = allFilters


    const allActivityEntries = useMemo(() => cardActivity.map(act => {
            const entry = getEntryFromId(act.matchId)
            const project = getProjectEntryFromId(act.matchId)
            const award = getAwardEntryFromId(act.matchId)
            const type = award
                ? 'Belt'
                : project
                    ? 'Project'
                    : 'Lock'
            return {
                ...act,
                ...entry,
                ...project,
                ...award,
                id: act.id,
                type
            }
        }
    ), [cardActivity])

    const activityByMatchId = useMemo(() => allActivityEntries.reduce((acc, evid) => {
        acc[evid.matchId] = evid
        return acc
    }, {}), [allActivityEntries])

    const allPopularEntries = useMemo(() => popularLocks.map(lock => ({
        ...getEntryFromId(lock.lockID),
        ...activityByMatchId[lock.lockID],
        popularityRank: lock.rank,
        userCount: lock.count
    })), [popularLocks, activityByMatchId])

    const filterArray = useMemo(() => Object.keys(filters).map(key => {
        const value = filters[key]
        return Array.isArray(value) ? value.map(sk => ({key, value: sk})) : {key, value}
    }).flat(), [filters])

    const visibleEntries = useMemo(() => processEntries(allActivityEntries, filterArray, search, sort), [allActivityEntries, filterArray, search, sort])

    const popularEntries = useMemo(() => processEntries(allPopularEntries, filterArray.concat({
        key: 'exceptionType',
        value: undefined
    }), search, 'popular'), [allPopularEntries, filterArray, search])

    const value = useMemo(() => ({
        allEntries,
        cardActivity,
        cardBBCount,
        cardDanPoints,
        cardEligibleDan,
        cardNextDanPoints,
        cardNextDanLocks,
        visibleEntries,
        popularEntries,
        getEntryFromId,
        getProjectEntryFromId,
        getAwardEntryFromId
    }), [cardActivity, cardBBCount, cardDanPoints, cardEligibleDan, cardNextDanPoints, cardNextDanLocks, visibleEntries, popularEntries])

    return (
        <ScorecardDataContext.Provider value={value}>
            {children}
        </ScorecardDataContext.Provider>
    )
}

function processEntries(entries, filterArray, search, sort) {
    // Fill out fields
    const mappedEntries = entries
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
            documentation: [
                entry.exceptionType === 'badlink' ? 'Bad Link' : 'Valid Link',
                entry.date ? 'Valid Date' : 'No Date'
            ],
            scoring: [
                (() => {
                    switch (entry.exceptionType) {
                        case 'nomatch':
                            return 'Unmatched'
                        case 'badlink':
                            return 'Bad Link'
                        case 'duplicate':
                            return 'Duplicate'
                        case 'upgraded':
                            return 'Upgraded'
                    }
                    switch (entry.belt) {
                        case 'White':
                        case 'Yellow':
                        case 'Orange':
                        case 'Green':
                            return 'Low Level'
                        case 'Unranked':
                            return 'Unranked'
                    }
                    switch (entry.awardType) {
                        case 'belt':
                        case 'dan':
                            return 'Belts & Dans'
                    }
                    return 'Worth Points'
                })()
            ],
            simpleBelt: entry?.belt?.replace(/\s\d/g, '')
        }))

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
        ? fuzzysort.go(removeAccents(search), filtered, {keys: ['fuzzy'], threshold: -25000})
            .map(result => ({
                ...result.obj,
                score: result.score
            }))
        : filtered

    // Finally, sort the entries
    const sortCriteria = (() => {
        switch (sort) {
            case 'popular':
                return (a, b) => {
                    return a.popularityRank - b.popularityRank || a.fuzzy.localeCompare(b.fuzzy)
                }
            case 'danPointsAscending':
                return (a, b) => {
                    return a.points - b.points || beltSort(a.belt, b.belt) || dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                }
            case 'danPointsDescending':
                return (a, b) => {
                    return b.points - a.points || beltSortReverse(a.belt, b.belt) || dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                }
            case 'dateAscending':
                return (a, b) => {
                    return dayjs(a.date).valueOf() - dayjs(b.date).valueOf() || beltSortReverse(a.simpleBelt, b.simpleBelt)
                }
            case 'dateDescending':
                return (a, b) => {
                    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf() || beltSortReverse(a.simpleBelt, b.simpleBelt)
                }
            case 'beltAscending':
                return (a, b) => {
                    return beltSort(a.belt, b.belt) || dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                }
            case 'beltDescending':
                return (a, b) => {
                    return beltSortReverse(a.belt, b.belt) || dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
                }
            case 'alphaAscending':
                return (a, b) => {
                    return a.fuzzy.localeCompare(b.fuzzy) || b.points - a.points
                }
            case 'alphaDescending':
                return (a, b) => {
                    return b.fuzzy.localeCompare(a.fuzzy) || b.points - a.points
                }
            default:
                return (a, b) => {
                    return dayjs(dayjs(b.date).format('YYYY-MM-DD')).valueOf() - dayjs(dayjs(a.date).format('YYYY-MM-DD')).valueOf()
                        || beltSortReverse(a.belt, b.belt)
                        || a.fuzzy.localeCompare(b.fuzzy)
                }
        }
    })()

    return searched.sort(sortCriteria)
}

export default ScorecardDataContext
