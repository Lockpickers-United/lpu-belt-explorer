import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import ScorecardDataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import {beltSort, beltSortReverse} from '../data/belts'
import removeAccents from 'remove-accents'
import allEntries from '../data/data.json'
import allProjects from '../data/projects.json'

export function ScorecardDataProvider({children, cardEvidence, cardBBCount, cardDanPoints}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, ...filters} = allFilters


    const getProjectEntryFromId = useCallback(id => {
        return allProjects.find(e => e.id === id)
    }, [])

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [])

    const allEvidenceEntries = useMemo(() => cardEvidence.map(evidenceEntry =>
        {
            const entry = getEntryFromId(evidenceEntry.matchId)
            const projectEntry = getProjectEntryFromId(evidenceEntry.matchId)
            return {...evidenceEntry, ...entry, ...projectEntry, id: evidenceEntry.id}
        }
    ), [cardEvidence, getEntryFromId, getProjectEntryFromId])

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
                simpleBelt: entry?.belt?.replace(/\s\d/g, '')
            }))
    }, [allEvidenceEntries])

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
                if (sort === 'danPoints') {
                    return a.points - b.points
                } else if (sort === 'dateAscending') {
                    const dayA = dayjs(a.date)
                    const dayB = dayjs(b.date)
                    if (dayA.isAfter(dayB)) return 1
                    else if (dayB.isAfter(dayA)) return -1
                } else if (sort === 'dateDescending') {
                    const dayA = dayjs(a.date)
                    const dayB = dayjs(b.date)
                    if (dayA.isAfter(dayB)) return -1
                    else if (dayB.isAfter(dayA)) return 1
                } else if (sort === 'beltAscending') {
                    return beltSort(a.belt, b.belt)
                } else if (sort === 'beltDescending') {
                    return beltSortReverse(a.belt, b.belt)
                } else if (sort === 'alphaAscending') {
                    return a.fuzzy.localeCompare(b.fuzzy)
                } else if (sort === 'alphaDescending') {
                    return b.fuzzy.localeCompare(a.fuzzy)
                }
            })
            : searched
    }, [filters, mappedEntries, search, sort])

    const value = useMemo(() => ({
        allEntries,
        cardEvidence,
        cardBBCount,
        cardDanPoints,
        visibleEntries,
        getEntryFromId,
        getProjectEntryFromId
    }), [getEntryFromId, cardEvidence, cardBBCount, cardDanPoints, visibleEntries,getProjectEntryFromId])

    return (
        <ScorecardDataContext.Provider value={value}>
            {children}
        </ScorecardDataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

export default ScorecardDataContext
