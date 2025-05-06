import fs from 'node:fs/promises'
import {setDeep, setDeepAdd, setDeepPush} from '../../util/setDeep.js'
import {localUser, prodUser} from '../../../keys/users.js'
import dayjs from 'dayjs'
import {itemDetails} from '../../util/getItemDetails.js'
import {uniqueBelts} from '../../util/belts.js'


const production = process.env.USER !== localUser

const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/collectionExports`
const backupDir = production
    ? `/home/${prodUser}/firebase`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`
const exportDir = production
    ? `/home/${prodUser}/collectionExports`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/collectionExports`


export default async function processExportAll() {

    console.log('Running processExportAll()')

    const allItemDetails = await itemDetails()
    const lockcollections = await JSON.parse(await fs.readFile(`${exportDir}/lockcollections.json`, 'utf8')).data
    const evidenceData = await JSON.parse(await fs.readFile(`${exportDir}/evidence.json`, 'utf8')).data
    const awardsData = await JSON.parse(await fs.readFile(`${exportDir}/awards.json`, 'utf8')).data

    //TODO: fetch from server once live
    const platformBeltCounts = await JSON.parse(await fs.readFile(`${exportDir}/platformBeltCounts.json`, 'utf8'))

    const users = {}

    const scorecardStats = lockcollections.reduce((acc, user) => {
        const {awards = [], recordedLocks = []} = user

        const maxRank = awards
            ? awards.reduce((acc, awardId) => {
                const award = allItemDetails[awardId]
                return (award['awardType'] === 'belt' && acc < award.rank) ? award.rank : acc
            }, 0)
            : 0
        const belt = (!maxRank || maxRank < 1) ? 'NoBelts' : uniqueBelts[maxRank - 1]

        const dan = belt === 'Black'
            ? user.danLevel > 1
                ? user.danLevel
                : 1
            : undefined

        setDeepAdd(acc, ['userCounts', 'totalUsers'], 1)
        setDeepAdd(acc, ['userCounts', 'scorecardUsers'], recordedLocks?.length > 0 ? 1 : 0)
        setDeepAdd(acc, ['userCounts', 'beltedUsers'], belt !== 'NoBelts' ? 1 : 0)
        belt !== 'NoBelts' && setDeepAdd(acc, ['userCounts', 'belts', belt], 1)
        dan && setDeepAdd(acc, ['userCounts', 'dans', dan], 1)

        const uniqueLockIds = recordedLocks ? new Set([...recordedLocks]) : []
        uniqueLockIds.forEach((id) => {
            setDeepAdd(acc, ['lockCountsByUserBelt', id, 'scorecardPicks', belt], 1)
            setDeepAdd(acc, ['lockCountsByUserBelt', id, 'scorecardPicks', 'All Belts'], 1)

            const entry = allItemDetails[id]
            if (entry && entry.belt && entry.lockingMechanisms) {
                const lockingMechanism = entry.lockingMechanisms.length === 1
                    ? entry.lockingMechanisms[0]
                    : 'Multiple'
                setDeepAdd(acc, ['byBeltByMechanism', belt, lockingMechanism], 1)
                setDeepAdd(acc, ['byBelt', entry.belt], 1)
                setDeepAdd(acc, ['byMechanism', lockingMechanism], 1)
            }
        })

        awards?.forEach((id) => {
            const award = awardsData.find(a => a.awardId === id && a.userId === user.docId)
            if (award.awardUrl.includes('discord')) {
                setDeepAdd(acc, ['awardSources', 'discord'], 1)
            } else if (award.awardUrl.includes('reddit')) {
                setDeepAdd(acc, ['awardSources', 'reddit'], 1)
            }
        })


        setDeep(users, [user.docId], {
            ...user,
            belt,
            isScorecardUser: recordedLocks?.length > 0
        })

        return acc
    }, {})

    scorecardStats.platformBeltCounts = platformBeltCounts

    scorecardStats.metadata = {
        date: new Date().toISOString()
    }

    console.log('scorecardStats', scorecardStats)

    try {
        await fs.writeFile(`${serverDir}/scorecardStats.json`, JSON.stringify(scorecardStats, null, 2))
    } catch (err) {
        console.log(err)
    }

    return scorecardStats

}

await processExportAll().then()
