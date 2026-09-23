import fs from 'node:fs/promises'
import path from 'node:path'
import dayjs from 'dayjs'
import {setDeep, setDeepAdd} from '../../util/setDeep.js'
import {itemDetails} from '../../util/getItemDetails.js'
import isDirectRun from '../../util/isDirectRun.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'

const listNames = [
    'own', 'picked', 'recorded', 'wishlist', 'recordedLocks',
    'safelocksOwn', 'safelocksCracked', 'safelocksWishlist',
    'projects', 'raffleWatchlist', 'awards'
]

async function writeJsonFileAtomic(filePath, data) {
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    const tempFile = `${filePath}.tmp-${process.pid}-${Date.now()}`
    await fs.writeFile(tempFile, JSON.stringify(data))
    await fs.rename(tempFile, filePath)
}

function addBeltCount(userStats, items, itemId) {
    const fullBelt = items[itemId]?.fullBelt
    if (fullBelt) setDeepAdd(userStats, ['beltCounts', fullBelt], 1)
}

export function buildLeaderboardData({profiles, items, runDate}) {
    const data = Object.entries(profiles).map(([userId, profile]) => {
        const userStats = {
            displayName: profile.displayName || 'no display name',
            id: userId
        }

        listNames.forEach(listName => {
            if (profile[listName]?.length > 0) {
                setDeep(userStats, [listName], profile[listName].length)
            }
        })

        const locksCollection = new Set([
            ...(profile.own ?? []),
            ...(profile.picked ?? []),
            ...(profile.recorded ?? []),
            ...(profile.recordedLocks ?? [])
        ])
        if (locksCollection.size > 0) setDeep(userStats, ['locksCollection'], locksCollection.size)

        const uniqueLocks = new Set(profile.recordedLocks ?? [])
        if (uniqueLocks.size > 0) setDeep(userStats, ['uniqueLocks'], uniqueLocks.size)

        const safelocksCollection = new Set([
            ...(profile.safelocksOwn ?? []),
            ...(profile.safelocksCracked ?? [])
        ])
        if (safelocksCollection.size > 0) {
            setDeep(userStats, ['safelocksCollection'], safelocksCollection.size)
        }

        if (profile.blackBeltAwardedAt?._seconds > 0) {
            uniqueLocks.forEach(lockId => addBeltCount(userStats, items, lockId))
            profile.projects?.forEach(projectId => {
                addBeltCount(userStats, items, projectId)
                setDeepAdd(userStats, ['beltCounts', 'Project'], 1)
            })
        }

        if (profile.danLevel || profile.awardedDan) {
            setDeep(
                userStats,
                ['danLevel'],
                Math.max(profile.danLevel ?? 0, profile.awardedDan ?? 0)
            )
        }
        if (profile.danPoints) setDeep(userStats, ['danPoints'], profile.danPoints)
        if (profile.blackBeltCount) {
            setDeep(userStats, ['blackBeltCount'], profile.blackBeltCount)
        }
        setDeep(
            userStats,
            ['blackBeltAwardedAt'],
            profile.blackBeltAwardedAt?._seconds || 0
        )

        if (profile.privacyNoLeaderboard) {
            setDeep(userStats, ['privacyNoLeaderboard'], profile.privacyNoLeaderboard)
        }
        if (profile.privacyAnonymous) {
            setDeep(userStats, ['privacyAnonymous'], profile.privacyAnonymous)
        }

        return userStats
    })

    return {
        data,
        metadata: {updatedDateTime: dayjs(runDate).format('YYYY-MM-DD HH:mm')}
    }
}

export async function runLeaderboardStatsProcess({
    backupDir,
    publicDataDir,
    itemDetailsLoader = itemDetails,
    now = () => new Date()
}) {
    const runDate = now()
    const backupFile = path.join(backupDir, 'backup.json')
    const backup = JSON.parse(await fs.readFile(backupFile, 'utf8'))
    const profiles = backup?.__collections__?.lockcollections
    if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) {
        throw new Error(`Invalid lockcollections backup: ${backupFile}`)
    }

    const items = await itemDetailsLoader()
    const leaderboardData = buildLeaderboardData({profiles, items, runDate})
    const outputFile = path.join(publicDataDir, 'leaderboardData.json')
    await writeJsonFileAtomic(outputFile, leaderboardData)

    return Object.freeze({
        profileCount: leaderboardData.data.length,
        outputFile,
        leaderboardData
    })
}

export async function leaderboardStatsProcessMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment,
    itemDetailsLoader = itemDetails,
    now = () => new Date()
} = {}) {
    loadCollectionEnvironment({env, loadEnvironment})
    const config = loadExportJobConfig({env, requirePublicDataDir: true})
    const summary = exportJobConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const result = await runLeaderboardStatsProcess({
        backupDir: config.backupDir,
        publicDataDir: config.publicDataDir,
        itemDetailsLoader,
        now
    })
    if (!argv.includes('cron')) {
        writeOutput('Leaderboard stats processing complete', {
            profileCount: result.profileCount,
            outputFile: result.outputFile
        })
    }
    return result
}

if (isDirectRun(import.meta.url)) {
    await leaderboardStatsProcessMain()
}
