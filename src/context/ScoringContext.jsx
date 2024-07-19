
import React, {useCallback, useContext, useMemo} from 'react'
import {sys2UserDate} from '../util/datetime'
import belts, {modifierMultiplier, projectTiers} from '../data/belts'
import entryName from '../entries/entryName'
import AuthContext from '../app/AuthContext.jsx'
import DBContext from '../app/DBContext.jsx'
import useData from '../util/useData.jsx'
import allEntries from '../data/data.json'
import allProjects from '../data/projects.json'
import nextUpgrades from '../data/upgrades.json'
import {useParams} from 'react-router-dom'

const ScoringContext = React.createContext({})

export function ScoringProvider({children}) {
    const {user} = useContext(AuthContext)
    const {evidence, getEvidence} = useContext(DBContext)

    console.log('user', user)

    const loadFn = useCallback(async () => {
        try {
            return await getEvidence(user?.uid)
        } catch (ex) {
            console.error('Error loading profile and evidence.', ex)
            return null
        }
    }, [user, getEvidence])

    const {data = {}, loading, error} = useData({loadFn})


    const allEvidence = useMemo(() => {
        if (loading || !data || error) return []
        return data
    }, [data, error, loading])

    console.log('allEvidence', allEvidence)

    const annotatedEvidence = allEvidence.map(ev => {
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

    let scoredEvidence = useMemo(() => [], [])
    let usedIds = {}
    let upgradeableIdIdx = []

    for (let idx = sortedEvidence.length - 1; idx >= 0; idx--) {
        const ev = sortedEvidence[idx]

        if (!ev.matchId) {
            scoredEvidence[idx] = {
                ...ev,
                exceptionType: 'nomatch',
                row: idx + 1,
                note: 'no match with lock or project'
            }
        } else if (!ev.link.startsWith('http')) {
            scoredEvidence[idx] = {
                ...ev,
                exceptionType: 'badlink',
                row: idx + 1,
                points: 0,
                bbCount: 0,
                note: 'no URL for evidence'
            }
        } else {
            const [collidedIdx, collidedId] = usedIds[ev.matchId] ? usedIds[ev.matchId] : [null, null]

            if (collidedIdx && ev.points <= scoredEvidence[collidedIdx].points) {
                scoredEvidence[idx] = {
                    ...ev,
                    exceptionType: 'duplicate',
                    row: idx + 1,
                    points: 0,
                    samelinedId: collidedId,
                    note: `samelined with row ${collidedIdx + 1}`
                }
            } else {
                if (collidedIdx) {
                    scoredEvidence[collidedIdx] = {
                        ...sortedEvidence[collidedIdx],
                        exceptionType: 'duplicate',
                        row: collidedIdx + 1,
                        points: 0,
                        samelinedId: ev.id,
                        note: `samelined with row ${idx + 1}`
                    }
                }

                usedIds[ev.matchId] = [idx, ev.id]
                let superseded = false

                if (possibleUpgrades[ev.matchId]) {
                    for (let jdx = 0; !superseded && jdx < upgradeableIdIdx.length; jdx++) {
                        const [upMatchId, upIdx, upId] = upgradeableIdIdx[jdx]

                        if (isUpgradeOf(upMatchId, ev.matchId)) {
                            superseded = true

                            scoredEvidence[idx] = {
                                ...ev,
                                exceptionType: 'upgraded',
                                row: idx + 1,
                                points: 0,
                                supersededId: upId,
                                note: `superseded by row ${upIdx + 1}`
                            }

                        } else if (isUpgradeOf(ev.matchId, upMatchId)) {
                            scoredEvidence[upIdx] = {
                                ...scoredEvidence[upIdx],
                                exceptionType: 'upgraded',
                                row: upIdx + 1,
                                points: 0,
                                supersededId: ev.id,
                                note: `superseded by row ${idx + 1}`
                            }
                        }
                    }
                    upgradeableIdIdx.push([ev.matchId, idx, ev.id])
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

    const [bbCount, danPoints] = scoredEvidence.reduce((group, ev) => {
        group[0] = group[0] + ev.bbCount
        group[1] = group[1] + ev.points
        return group
    }, [0, 0])


    const value = useMemo(() => ({
        allEvidence,
        scoredEvidence,
        bbCount,
        danPoints
    }), [
        allEvidence,
        scoredEvidence,
        bbCount,
        danPoints
    ])


    return (
        <ScoringContext.Provider value={value}>
            {children}
        </ScoringContext.Provider>
    )
}

export default ScoringContext

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

