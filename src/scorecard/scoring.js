import belts, {modifierMultiplier, projectTiers} from '../data/belts'
import isValidUrl from '../util/isValidUrl'
import {allEntriesById, allProjectsById, allAwardsById, possibleUpgrades, isUpgradeOf} from '../entries/entryutils'
import dans from '../data/dans.json'

function calculateScoreForUser(allActivity) {
    const annotatedActivity = allActivity.map(act => {
        const entry = allEntriesById[act.matchId]
        const project = allProjectsById[act.matchId]
        const award = allAwardsById[act.matchId]
        const modifier = act.evidenceModifier && act.evidenceModifier !== 'Upgraded' ? act.evidenceModifier : null
        const multiplier = modifier ? modifierMultiplier[modifier] : 1

        if (entry) {
            return {
                ...act,
                matchId: entry.id,
                evidenceModifier: modifier,
                points: multiplier * belts[entry.belt].danPoints,
                bbCount: entry.belt.startsWith('Black') ? 1 : 0,
                isLock: true
            }
        } else if (project) {
            return {
                ...act,
                matchId: project.id,
                evidenceModifier: modifier,
                points: multiplier * projectTiers[project.tier].danPoints,
                bbCount: 0
            }
        }  else if (award) {
            return {
                ...act,
                matchId: award.id,
                points: 0,
                bbCount: 0
            }
        } else {
            return {
                ...act,
                evidenceModifier: modifier,
                points: 0,
                bbCount: 0
            }
        }
    })

    const sortedActivity = annotatedActivity.sort((a, b) => {
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

    let scoredActivity = []
    let usedIds = {}
    let upgradeableIdIdx = []

    for (let idx = sortedActivity.length - 1; idx >= 0; idx--) {
        const act = sortedActivity[idx]

        if (!act.matchId) {
            scoredActivity[idx] = {
                ...act,
                exceptionType: 'nomatch'
            }
        } else if (!isValidUrl(act.link)) {
            scoredActivity[idx] = {
                ...act,
                exceptionType: 'badlink',
                points: 0,
                bbCount: 0
            }
        } else {
            const [collidedIdx, collidedId] = usedIds[act.matchId] ? usedIds[act.matchId] : [null, null]
            const allowDuplicate = ['T10', 'T11', 'T12', 'T13'].includes(allProjectsById[act.matchId]?.tier)

            if (collidedIdx && act.points <= scoredActivity[collidedIdx].points && !allowDuplicate) {
                scoredActivity[idx] = {
                    ...act,
                    exceptionType: 'duplicate',
                    exceptionId: collidedId,
                    points: 0
                }
            } else {
                if (collidedIdx && !allowDuplicate) {
                    scoredActivity[collidedIdx] = {
                        ...sortedActivity[collidedIdx],
                        exceptionType: 'duplicate',
                        exceptionId: act.id,
                        points: 0
                    }
                }

                usedIds[act.matchId] = [idx, act.id]
                let superseded = false

                if (possibleUpgrades[act.matchId]) {
                    for (let jdx = 0; !superseded && jdx < upgradeableIdIdx.length; jdx++) {
                        const [upMatchId, upIdx, upId] = upgradeableIdIdx[jdx]

                        if (isUpgradeOf(upMatchId, act.matchId)) {
                            superseded = true

                            scoredActivity[idx] = {
                                ...act,
                                exceptionType: 'upgraded',
                                exceptionId: upId,
                                points: 0
                            }

                        } else if (isUpgradeOf(act.matchId, upMatchId)) {

                            if (!scoredActivity[upIdx].exceptionType) {
                                scoredActivity[upIdx] = {
                                    ...scoredActivity[upIdx],
                                    exceptionType: 'upgraded',
                                    exceptionId: act.id,
                                    points: 0
                                }
                            }
                        }
                    }
                    upgradeableIdIdx.push([act.matchId, idx, act.id])
                }

                if (!superseded) {
                    scoredActivity[idx] = act
                }
            }
        }
    }

    const [bbCount, danPoints] = scoredActivity.reduce((group, act) => {
        group[0] = group[0] + act.bbCount
        group[1] = group[1] + act.points
        return group
    }, [0, 0])

    const eligibleDan = dans.filter(d => danPoints >= d.points && bbCount >= d.bbLocks).pop().level
    const nextDan = eligibleDan + 1 < dans.length && dans[eligibleDan + 1]
    const nextDanPoints = nextDan ? Math.max(0, nextDan.points - danPoints) : 0
    const nextDanLocks = nextDan ? Math.max(0, nextDan.bbLocks - bbCount) : 0
    const uniqueLocks = scoredActivity.filter(e => e.isLock).length

    return ({
        scoredActivity,
        bbCount,
        danPoints,
        eligibleDan,
        nextDanPoints,
        nextDanLocks,
        uniqueLocks
    })
}

export default calculateScoreForUser

