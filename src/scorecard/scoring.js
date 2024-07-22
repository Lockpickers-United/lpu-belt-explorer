import {sys2UserDate} from '../util/datetime'
import belts, {modifierMultiplier, projectTiers} from '../data/belts'
import isValidUrl from '../util/isValidUrl'
import {allEntriesById, allProjectsById, possibleUpgrades, isUpgradeOf} from '../entries/entryutils'

function calculateScoreForUser(allEvidence) {
    const annotatedEvidence = allEvidence.map(ev => {
        const entry = allEntriesById[ev.matchId]
        const project = allProjectsById[ev.matchId]
        const dateStr = sys2UserDate(ev.date)
        const modifier = ev.modifier && ev.modifier !== 'Upgraded' ? ev.modifier : null
        const multiplier = modifier ? modifierMultiplier[modifier] : 1

        if (entry) {
            return {
                ...ev,
                matchId: entry.id,
                date: dateStr,
                modifier: modifier,
                points: multiplier * belts[entry.belt].danPoints,
                bbCount: entry.belt.startsWith('Black') ? 1 : 0
            }
        } else if (project) {
            return {
                ...ev,
                matchId: project.id,
                date: dateStr,
                modifier: modifier,
                points: multiplier * projectTiers[project.tier].danPoints,
                bbCount: 0
            }
        } else {
            return {
                ...ev,
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
            return a.evidenceNotes < b.evidenceNotes ? -1 : 1
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
                exceptionType: 'nomatch'
            }
        } else if (!isValidUrl(ev.link)) {
            scoredEvidence[idx] = {
                ...ev,
                exceptionType: 'badlink',
                points: 0,
                bbCount: 0
            }
        } else {
            const [collidedIdx, collidedId] = usedIds[ev.matchId] ? usedIds[ev.matchId] : [null, null]

            if (collidedIdx && ev.points <= scoredEvidence[collidedIdx].points) {
                scoredEvidence[idx] = {
                    ...ev,
                    exceptionType: 'duplicate',
                    exceptionId: collidedId,
                    points: 0
                }
            } else {
                if (collidedIdx) {
                    scoredEvidence[collidedIdx] = {
                        ...sortedEvidence[collidedIdx],
                        exceptionType: 'duplicate',
                        exceptionId: ev.id,
                        points: 0
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
                                exceptionId: upId,
                                points: 0
                            }

                        } else if (isUpgradeOf(ev.matchId, upMatchId)) {

                            if (!scoredEvidence[upIdx].exceptionType) {
                                scoredEvidence[upIdx] = {
                                    ...scoredEvidence[upIdx],
                                    exceptionType: 'upgraded',
                                    exceptionId: ev.id,
                                    points: 0
                                }
                            }
                        }
                    }
                    upgradeableIdIdx.push([ev.matchId, idx, ev.id])
                }

                if (!superseded) {
                    scoredEvidence[idx] = ev
                }
            }
        }
    }

    const [bbCount, danPoints] = scoredEvidence.reduce((group, ev) => {
        group[0] = group[0] + ev.bbCount
        group[1] = group[1] + ev.points
        return group
    }, [0, 0])

    return ({
        scoredEvidence,
        bbCount,
        danPoints
    })
}

export default calculateScoreForUser

