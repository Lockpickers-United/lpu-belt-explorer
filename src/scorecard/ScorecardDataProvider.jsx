import React, {useCallback, useContext, useMemo} from 'react'
import fuzzysort from 'fuzzysort'
import DataContext from '../context/DataContext'
import FilterContext from '../context/FilterContext'
import dayjs from 'dayjs'
import belts, {beltSort, beltSortReverse, modifierMultiplier, projectTiers} from '../data/belts'
import removeAccents from 'remove-accents'
import {sys2UserDate} from '../util/datetime'
import entryName from '../entries/entryName'
import allEntries from '../data/data.json'
import allProjects from '../data/projects.json'
import nextUpgrades from '../data/upgrades.json'

export function DataProvider({children, evidenceEntries}) {
    const {filters: allFilters} = useContext(FilterContext)
    const {search, id, tab, name, sort, image, ...filters} = allFilters

    const getLockEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [])

    const annotatedEvidence = evidenceEntries.map(ev => {
        const entry = allEntriesById[ev.matchId]
        const project = allProjectsById[ev.matchId]
        const dateStr = sys2UserDate(ev.date)
        const modifier = ev.modifier && ev.modifier !== 'Upgraded' ? ev.modifier : null
        const multiplier = modifier ? modifierMultiplier[modifier] : 1

        if (entry) {
            const name = entryName(entry)
            const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')

            return {
                ...ev,
                matchId: entry.id,
                matchName: name,
                matchLink: `https://share.lpubelts.com/?id=${entry.id}&name=${safeName}`,
                color: belts[entry.belt].color,
                date: dateStr,
                modifier: modifier,
                points: multiplier * belts[entry.belt].danPoints,
                bbCount: entry.belt.startsWith('Black') ? 1 : 0
            }
        } else if (project) {
            return {
                ...ev,
                matchId: project.id,
                matchName: project.name,
                color: belts['Unranked'].color,
                date: dateStr,
                modifier: modifier,
                points: multiplier * projectTiers[project.tier].danPoints,
                bbCount: 0
            }
        } else {
            return {
                ...ev,
                matchName: '',
                color: belts['Unranked'].color,
                date: dateStr,
                modifier: modifier,
                points: 0,
                bbCount: 0
            }
        }
    })

    const sortedEvidence = annotatedEvidence.sort((a, b) => {
        const aDate = new Date(a.date)
        const bDate = new Date(b.date)
        if (aDate > bDate) {
            return -1
        } else if (aDate < bDate) {
            return 1
        } else {
            return a.name < b.name ? -1 : 1
        }
    })

    let scoredEvidence = []
    let usedIds = {}
    let upgradeableIdIdx = []

    for (let idx = sortedEvidence.length - 1; idx >= 0; idx--) {
        const ev = sortedEvidence[idx]

        if (!ev.matchId) {
            scoredEvidence[idx] = {
                ...ev,
                row: idx + 1,
                note: 'no match with lock or project'
            }
        } else if (!ev.link.startsWith('http')) {
            scoredEvidence[idx] = {
                ...ev,
                row: idx + 1,
                points: 0,
                bbCount: 0,
                note: 'no URL for evidence'
            }
        } else {
            const collidedIdx = usedIds[ev.matchId]

            if (collidedIdx && ev.points <= scoredEvidence[collidedIdx].points) {
                scoredEvidence[idx] = {
                    ...ev,
                    row: idx + 1,
                    points: 0,
                    note: `samelined with row ${collidedIdx + 1}`
                }
            } else {
                if (collidedIdx) {
                    scoredEvidence[collidedIdx] = {
                        ...sortedEvidence[collidedIdx],
                        row: collidedIdx + 1,
                        points: 0,
                        note: `samelined with row ${idx + 1}`
                    }
                }

                usedIds[ev.matchId] = idx
                let superseded = false

                if (possibleUpgrades[ev.matchId]) {
                    for (let jdx = 0; !superseded && jdx < upgradeableIdIdx.length; jdx++) {
                        const [upId, upIdx] = upgradeableIdIdx[jdx]

                        if (isUpgradeOf(upId, ev.matchId)) {
                            superseded = true

                            scoredEvidence[idx] = {
                                ...ev,
                                row: idx + 1,
                                points: 0,
                                note: `superseded by row ${upIdx + 1}`
                            }

                        } else if (isUpgradeOf(ev.matchId, upId)) {
                            scoredEvidence[upIdx] = {
                                ...scoredEvidence[upIdx],
                                row: upIdx + 1,
                                points: 0,
                                note: `superseded by row ${idx + 1}`
                            }
                        }
                    }
                    upgradeableIdIdx.push([ev.matchId, idx])
                }

                if (!superseded) {
                    scoredEvidence[idx] = {
                        ...ev,
                        row: idx + 1
                    }
                }
            }
        }
    }

    const allEvidenceEntries = scoredEvidence.map(evidenceEntry =>
        {
            const entry = getLockEntryFromId(evidenceEntry.matchId)
            return {...evidenceEntry, ...entry, id: evidenceEntry.id}
        }
    )

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

    const getEntryFromId = useCallback(id => {
        return allEntries.find(e => e.id === id)
    }, [])

    const value = useMemo(() => ({
        allEntries,
        visibleEntries,
        getEntryFromId,
        allEntriesById,
        allProjectsById
    }), [getEntryFromId, visibleEntries])

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    )
}

const fuzzySortKeys = ['fuzzy']

const allEntriesById = allEntries
    .reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

const allProjectsById = allProjects
    .reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

const possibleUpgrades = Object.keys(nextUpgrades)
    .reduce((group, term) => {
        group[term] = true
        nextUpgrades[term].forEach(id => {
            group[id] = true
        })
        return group
    }, {})

function isUpgradeOf(aId, bId) {
    if (!nextUpgrades[bId]) {
        return false
    } else if (nextUpgrades[bId].includes(aId)) {
        return true
    } else {
        return nextUpgrades[bId].some(id => isUpgradeOf(aId, id))
    }
}

export default DataContext
