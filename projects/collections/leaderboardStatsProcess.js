import fs from 'node:fs/promises'
import {setDeep, setDeepAdd} from '../util/setDeep.js'
import {itemDetails, projectDetails} from '../util/getItemDetails.js'
import {localUser, prodUser} from '../../keys/users.js'
import dayjs from 'dayjs'

const production = process.env.USER !== localUser

const backupDir = production
    ? `/home/${prodUser}/firebase/archive`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`
const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections`

const listNames = [
    'own', 'picked', 'recorded', 'wishlist', 'recordedLocks',
    'safelocksOwn', 'safelocksCracked', 'safelocksWishlist',
    'projects', 'raffleWatchlist', 'awards']

async function saveLeaderboard() {

    const profiles = JSON.parse(await fs.readFile(`${backupDir}/backup.json`, 'utf8'))['__collections__']['lockcollections']
    const items = await itemDetails()
    const projects = await projectDetails()

    const leaderboard = Object.keys(profiles).reduce((acc, userId) => {
        const profile = profiles[userId]

        const userStats = {displayName: profile.displayName || 'no display name', id: userId}
        listNames.forEach(listName => {
            if (profile[listName]?.length > 0) {
                setDeep(userStats, [listName], profile[listName].length)
            } // ELSE SET TO 0?
        })

        const locksCollection = [...new Set([...profile.own || [], ...profile.picked || [], ...profile.recorded || [], ...profile.recordedLocks || []])]
        setDeep(userStats, ['locksCollection'], locksCollection.length || 0)

        const uniqueLocks = [...new Set([...profile.recordedLocks || []])]
        setDeep(userStats, ['uniqueLocks'], uniqueLocks.length || 0)

        const safelocksCollection = [...new Set([...profile.safelocksOwn || [], ...profile.safelocksCracked || []])]
        setDeep(userStats, ['safelocksCollection'], safelocksCollection.length || 0)

        if (profile.blackBeltAwardedAt?._seconds > 0) {
            uniqueLocks.forEach(lockId => {
                setDeepAdd(userStats, ['beltCounts', items[lockId].fullBelt], 1)
            })

            profile?.projects?.forEach(projectId => {
                setDeepAdd(userStats, ['beltCounts', projects[projectId].fullBelt], 1)
                setDeepAdd(userStats, ['beltCounts', 'Project'], 1)
            })

        }

        setDeep(userStats, ['danLevel'], profile.danLevel || 0)
        setDeep(userStats, ['danPoints'], profile.danPoints || 0)
        setDeep(userStats, ['blackBeltCount'], profile.blackBeltCount || 0)
        setDeep(userStats, ['blackBeltAwardedAt'], profile?.blackBeltAwardedAt?._seconds || 0)

        if (profile.privacyNoLeaderboard) {
            setDeep(userStats, ['privacyNoLeaderboard'], profile?.privacyNoLeaderboard)
        }
        if (profile.privacyAnonymous) {
            setDeep(userStats, ['privacyAnonymous'], profile?.privacyAnonymous)
        }

        acc.push(userStats)
        return acc
    },[])

    const leaderboardData = {data: leaderboard, metadata: {updatedDateTime: dayjs().format('YYYY-MM-DD HH:mm')}
    }
    await fs.writeFile(`${serverDir}/leaderboardData.json`, JSON.stringify(leaderboardData, null, 2), function (err) {if (err) {console.error('save leaderboardData error:', err)}})

    return leaderboardData

}

await saveLeaderboard().then()
