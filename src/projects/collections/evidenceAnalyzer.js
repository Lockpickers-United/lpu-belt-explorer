import {localUser, prodUser} from '../../../keys/users.js'
import fs from 'node:fs/promises'
import {setDeepAdd, setDeepUnique} from '../../util/setDeep.js'

const production = process.env.USER !== localUser
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections`
const backupDir = production
    ? `/home/${prodUser}/firebase`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`

const collectionData = JSON.parse(await fs.readFile(`${backupDir}/backup.json`, 'utf8'))['__collections__']['lockcollections']
const scorecardEvidence = JSON.parse(await fs.readFile(`${serverDir}/allScorecardEvidence.json`, 'utf8'))

Object.keys(collectionData).reduce((acc, userId) => {
    setDeepAdd(acc, ['counts', 'users'], 1)

    const userEvidence = scorecardEvidence.filter(evidence => evidence.userId === userId)
    if (userEvidence.length > 0) {
        setDeepAdd(acc, ['counts', 'scorecardUsers'], 1)
        const beltAwards = userEvidence
                .filter(activity => activity['collectionDB'] === 'awards')
                .map(activity => allAwardsById[activity.matchId]) // eslint-disable-line
                .filter(award => award['awardType'] === 'belt')
                .sort((a, b) => a.rank - b.rank)
        const cardMaxBelt = beltAwards ? beltAwards[beltAwards.length - 1] : {}
    }
    return acc
},{})



const scorecardData = scorecardEvidence.reduce((acc, evidence) => {
    setDeepUnique(acc, ['userIds'], evidence.userId)
    setDeepAdd(acc, ['evidenceId', evidence.projectId], 1)
    return acc
}, {})

scorecardData.userCount = scorecardData.userIds.length

console.log('total user count', scorecardData.userCount)

const targetIds = ['23c7988c', '305473cf', '826c31e0']
const targetInfo = scorecardEvidence.reduce((acc, evidence) => {
    if (!targetIds.includes(evidence.projectId)) return acc
    setDeepUnique(acc, ['userIds'], evidence.userId)

    console.log(`${evidence.userId}|${evidence.projectId}|${evidence.evidenceName}`)

    setDeepAdd(acc, ['evidenceId', evidence.projectId, evidence.evidenceName], 1)
    return acc
},{})

targetInfo.userCount = targetInfo.userIds.length
targetInfo.userPercent = (targetInfo.userCount / scorecardData.userCount) * 100

console.log(JSON.stringify(targetInfo, null, 2))
