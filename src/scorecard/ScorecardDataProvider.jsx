import React, {useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import ScorecardDataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import {beltSort, beltSortReverse} from '../data/belts'
import removeAccents from 'remove-accents'
import allEntries from '../data/data.json'
import {getEntryFromId, getProjectEntryFromId, getAwardEntryFromId} from '../entries/entryutils'
import filterEntriesAdvanced from '../filters/filterEntriesAdvanced'

export function ScorecardDataProvider({
                                          children,
                                          cardActivity,
                                          cardBBCount,
                                          cardDanPoints,
                                          cardEligibleDan,
                                          cardNextDanPoints,
                                          cardNextDanLocks,
                                          cardUniqueLocks,
                                          cardMaxBelt,
                                          popularLocks,
                                          popularLocksBB,
                                          profile,
                                          blackBeltScorecard
                                      }) {
    const {filters: allFilters, advancedFilterGroups} = useContext(FilterContext)
    const {search, sort} = allFilters

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
        ...getEntryFromId(lock.id),
        ...activityByMatchId[lock.id],
        popularityRank: lock.rank,
        userCount: lock.saveCount
    })), [popularLocks, activityByMatchId])

    const bbPopularEntries = useMemo(() => popularLocksBB?.map(lock => ({
        ...getEntryFromId(lock.id),
        ...activityByMatchId[lock.id],
        popularityRank: lock.rank,
        userCount: lock.saveCount
    })), [popularLocksBB, activityByMatchId])

    const {visibleEntries, searchedEntries} = useMemo(() =>
        processEntries(allActivityEntries, search, sort, profile, advancedFilterGroups()),
        [allActivityEntries, search, sort, profile, advancedFilterGroups])

    const {visibleEntries: popularEntries} = useMemo(() => processEntries(allPopularEntries, search, 'popular', profile, true), [allPopularEntries, profile, search])

    const blackBeltUser = useMemo(() => {
        return profile?.blackBeltAwardedAt > 0
    }, [profile])

    const value = useMemo(() => ({
        allEntries,
        cardActivity,
        cardBBCount,
        cardDanPoints,
        cardEligibleDan,
        cardNextDanPoints,
        cardNextDanLocks,
        searchedEntries,
        visibleEntries,
        popularEntries,
        bbPopularEntries,
        cardUniqueLocks,
        cardMaxBelt,
        blackBeltUser,
        blackBeltScorecard,
        getEntryFromId,
        getProjectEntryFromId,
        getAwardEntryFromId
    }), [cardActivity, cardBBCount, cardDanPoints, cardEligibleDan, cardNextDanPoints, cardNextDanLocks, searchedEntries, visibleEntries, popularEntries, bbPopularEntries, cardUniqueLocks, cardMaxBelt, blackBeltUser, blackBeltScorecard])

    return (
        <ScorecardDataContext.Provider value={value}>
            {children}
        </ScorecardDataContext.Provider>
    )
}

function processEntries(entries, search, sort, profile = {}, advancedFilterGroups, popular=false) {
    const userNotes = profile?.userLockNotes || {}

    let filterGroups = advancedFilterGroups

    if (popular) {
        const newGroup = {
            _id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fieldName: 'exceptionType',
            matchType: 'Is',
            operator: 'OR',
            values: [undefined]
        }
        filterGroups = [...advancedFilterGroups, newGroup ]
    }

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
            content: [
                userNotes[entry.id] || userNotes[entry.matchId] ? 'Has Personal Notes' : undefined
            ].flat().filter(x => x),
            scoring: [
                (() => {
                    switch (entry.awardType) {
                        case 'belt':
                        case 'dan':
                            return 'Belts & Dans'
                    }
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
                    return 'Worth Points'
                })()
            ],
            simpleBelt: entry?.belt?.replace(/\s\d/g, ''),
            personalNotes: userNotes[entry.id] || userNotes[entry.matchId]
        }))

    const searchCutoff = 0.30

    const searchEntriesForText = (entries) => {
        const exactMatch = search && entries.find(e => e.id === search)
        if (exactMatch) {
            return [exactMatch]
        }
        return !search
            ? entries
            : fuzzysort.go(removeAccents(search), entries, {keys: ['fuzzy'], threshold: -23000})
                .map(result => ({
                    ...result.obj,
                    score: result.score
                }))
                .filter(entry => entry.score > searchCutoff)
    }

    const searchedEntries = searchEntriesForText(mappedEntries)

    // Filter the data
    const filtered = filterEntriesAdvanced({
        advancedFilterGroups: filterGroups,
        entries: mappedEntries,
    })
    const searched = searchEntriesForText([...filtered])

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

    return {visibleEntries: searched.sort(sortCriteria), searchedEntries}
}

export default ScorecardDataContext
