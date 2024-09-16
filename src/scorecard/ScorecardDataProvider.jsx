import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import ScorecardDataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import {beltSort, beltSortReverse} from '../data/belts'
import removeAccents from 'remove-accents'
import allEntries from '../data/data.json'
import {getEntryFromId, getProjectEntryFromId} from '../entries/entryutils'
import useData from '../util/useData.jsx'
import {collectionsFullBB} from '../data/dataUrls'

export function ScorecardDataProvider({
                                          children,
                                          cardEvidence,
                                          cardBBCount,
                                          cardDanPoints,
                                          cardEligibleDan,
                                          cardNextDanPoints,
                                          cardNextDanLocks
                                      }) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, locks, ...filters} = allFilters

    const allEvidenceEntries = useMemo(() => cardEvidence.map(evidenceEntry => {
            const entry = getEntryFromId(evidenceEntry.matchId)
            const projectEntry = getProjectEntryFromId(evidenceEntry.matchId)
            return {...entry, ...evidenceEntry, ...projectEntry, id: evidenceEntry.id}
        }
    ), [cardEvidence])

    const mappedEntries = useMemo(() => {
        return allEvidenceEntries
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
                    entry.exceptionType === 'nomatch' ? 'Unmatched' :
                        entry.exceptionType === 'badlink' ? 'Bad Link' :
                            entry.exceptionType === 'duplicate' ? 'Duplicate' :
                                entry.exceptionType === 'upgraded' ? 'Upgraded' :
                                    ['White', 'Yellow', 'Orange', 'Green'].includes(entry.belt) ? 'Low Level' :
                                        'Worth Points'
                ],
                simpleBelt: entry?.belt?.replace(/\s\d/g, '')
            }))
    }, [allEvidenceEntries])

    const filterArray = useMemo(() => Object.keys(filters)
            .map(key => {
                const value = filters[key]
                return Array.isArray(value)
                    ? value.map(subkey => ({key, value: subkey}))
                    : {key, value}
            })
            .flat()
        , [filters])

    const visibleEntries = useMemo(() => processEntries(mappedEntries, filterArray, 'evidence', search, sort), [filterArray, mappedEntries, search, sort])

    const {data, loading, error} = useData({urls})
    const popularLocks = useMemo(() => data?.collectionsFullBB?.scorecardLocks, [data])

    const getEvidenceFromId = useCallback(id => {
        return visibleEntries.find(e => e.matchId === id)
    }, [visibleEntries])

    const allPopularEntries = useMemo(() => {
        return popularLocks && !loading && !error
            ? popularLocks?.reduce((acc, lock) => {
                const entry = allEntries.find(e => e.id === lock['lockID'])
                const evidence = getEvidenceFromId(lock.lockID)
                if (entry && !evidence?.exceptionType) {
                    acc.push({
                        ...entry,
                        evidence: evidence,
                        popularityRank: lock.rank,
                        userCount: lock.userCount,
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
                    })
                }
                return acc
            }, []).filter(x => x)
            : []
    }, [error, getEvidenceFromId, loading, popularLocks])

    const popularEntries = useMemo(() => processEntries(allPopularEntries, filterArray, 'popular', search, sort), [allPopularEntries, filterArray, search, sort])

    const value = useMemo(() => ({
        allEntries,
        cardEvidence,
        cardBBCount,
        cardDanPoints,
        cardEligibleDan,
        cardNextDanPoints,
        cardNextDanLocks,
        visibleEntries,
        popularEntries,
        getEntryFromId,
        getProjectEntryFromId
    }), [cardEvidence, cardBBCount, cardDanPoints, cardEligibleDan, cardNextDanPoints, cardNextDanLocks, visibleEntries, popularEntries])

    return (
        <ScorecardDataContext.Provider value={value}>
            {children}
        </ScorecardDataContext.Provider>
    )
}

const urls = {
    collectionsFullBB
}

function processEntries(entries, filterArray, entryType, search, sort) {
    // Filter the data
    const filtered = entries
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

    return entryType === 'popular'
        ? searched.sort((a, b) => {
            return a.popularityRank - b.popularityRank
                || a.fuzzy.localeCompare(b.fuzzy)
        })
        : sort
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
}

const fuzzySortKeys = ['fuzzy']

export default ScorecardDataContext
