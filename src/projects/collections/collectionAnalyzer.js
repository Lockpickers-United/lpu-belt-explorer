import fs from 'node:fs/promises'
import path from 'node:path'
import dayjs from 'dayjs'
import {setDeep, setDeepAdd, setDeepMax, setDeepUnique} from '../../util/setDeep.js'
import {itemDetails} from '../../util/getItemDetails.js'
import isDirectRun from '../../util/isDirectRun.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'

const listNames = [
    'own', 'picked', 'recorded', 'wishlist', 'recordedLocks',
    'safelocksOwn', 'safelocksCracked', 'safelocksWishlist',
    'projects', 'raffleWatchlist', 'awards'
]
const backupFilePattern = /^backup_(\d{4}-\d{2}-\d{2})\.json$/
const statsFilePattern = /^collectionStats_(\d{4}-\d{2}-\d{2})\.json$/

async function ensureWriteDir(filePath) {
    await fs.mkdir(path.dirname(filePath), {recursive: true})
}

async function writeJsonFileAtomic(filePath, data) {
    await ensureWriteDir(filePath)
    const tempFile = `${filePath}.tmp-${process.pid}-${Date.now()}`
    await fs.writeFile(tempFile, JSON.stringify(data))
    await fs.rename(tempFile, filePath)
}

async function readDirIfExists(directory) {
    try {
        return await fs.readdir(directory)
    } catch (err) {
        if (err.code === 'ENOENT') return []
        throw err
    }
}

function analyzeProfiles({collectionData, items, blackBeltOnly}) {
    const profiles = blackBeltOnly
        ? Object.keys(collectionData)
            .filter(key => collectionData[key].blackBeltAwardedAt)
            .reduce((acc, key) => {
                acc[key] = collectionData[key]
                return acc
            }, {})
        : collectionData

    const collectionStatsCurrent = Object.keys(profiles).reduce((acc, userId) => {
        const profile = profiles[userId]
        setDeepAdd(acc, ['totalProfiles'], 1)

        if (blackBeltOnly) {
            setDeep(acc, ['blackBelts', userId], {
                displayName: profile.displayName || 'no display name',
                tabClaimed: profile.tabClaimed || 'no tab claimed'
            })
        }

        listNames.forEach(listName => {
            if (profile[listName]?.length > 0) {
                setDeepUnique(acc, ['listUserIds'], userId)
                setDeep(acc, ['listUsers'], acc.listUserIds.length)

                setDeepAdd(acc, ['listStats', listName, 'userCount'], 1)
                setDeepMax(acc, ['listStats', listName, 'maxSaves'], profile[listName].length)

                setDeepUnique(acc, ['listStats', 'allLists', 'userIds'], userId)
                setDeep(acc, ['listStats', 'allLists', 'userCount'], acc.listStats.allLists.userIds.length)
                setDeepMax(acc, ['listStats', 'allLists', 'maxSaves'], profile[listName].length)

                const uniqueItems = new Set(profile[listName])
                uniqueItems.forEach(itemId => {
                    setDeepAdd(acc, ['totalSaves'], 1)
                    setDeepAdd(acc, ['listStats', listName, 'totalSaves'], 1)
                    setDeepAdd(acc, ['listStats', listName, 'savesById', itemId], 1)
                    setDeepAdd(acc, ['listStats', 'allLists', 'totalSaves'], 1)
                    setDeepAdd(acc, ['listStats', 'allLists', 'savesById', itemId], 1)

                    if (!blackBeltOnly) setDeepAdd(acc, ['totalSavesById', itemId], 1)
                    if (!blackBeltOnly && listName === 'own') {
                        setDeepAdd(acc, ['ownSavesById', itemId], 1)
                    }
                    if (!blackBeltOnly && listName === 'wishlist') {
                        setDeepAdd(acc, ['wishlistSavesById', itemId], 1)
                    }
                    if (!blackBeltOnly && listName === 'recordedLocks') {
                        setDeepAdd(acc, ['scorecardSavesById', itemId], 1)
                    }

                    if (items[itemId]?.type === 'lock') {
                        setDeepAdd(acc, ['lockSaves'], 1)
                        setDeepAdd(acc, ['savesByBelt', items[itemId].belt, 'count'], 1)
                        setDeepAdd(acc, ['listSavesByBelt', listName, items[itemId].belt], 1)
                    } else if (items[itemId]?.type === 'award') {
                        setDeepAdd(acc, ['awardCounts', itemId], 1)
                        setDeepMax(acc, ['maxAward', userId], items[itemId].absRank)
                        setDeepAdd(acc, ['importSummary', 'totalAwards'], 1)
                    }
                })
            }
        })

        if (profile.discordUsername || profile.redditUsername) {
            setDeepAdd(acc, ['importSummary', 'importUsers'], 1)
        }
        if (profile.awards?.length > 0) setDeepAdd(acc, ['importSummary', 'awardUsers'], 1)

        return acc
    }, {})

    if (collectionStatsCurrent.maxAward) {
        Object.keys(collectionStatsCurrent.maxAward).forEach(userId => {
            const awardId = Object.keys(items)
                .find(itemId => collectionStatsCurrent.maxAward[userId] === items[itemId].absRank)
            if (!awardId) return
            setDeepAdd(collectionStatsCurrent, ['maxAwardCounts', awardId], 1)
            setDeep(
                collectionStatsCurrent,
                ['awardsDisplayNames', userId, 'maxAward'],
                items[awardId].absRank
            )
            setDeep(
                collectionStatsCurrent,
                ['awardsDisplayNames', userId, 'displayName'],
                profiles[userId].displayName
            )
        })
        delete collectionStatsCurrent.maxAward
    }

    if (collectionStatsCurrent.savesByBelt) {
        Object.keys(collectionStatsCurrent.savesByBelt).forEach(belt => {
            setDeep(
                collectionStatsCurrent,
                ['savesByBelt', belt, 'value'],
                collectionStatsCurrent.savesByBelt[belt].count / collectionStatsCurrent.lockSaves
            )
        })
    }

    const allListNames = [...listNames, 'allLists']
    allListNames.forEach(listName => {
        const listStats = collectionStatsCurrent.listStats?.[listName]
        if (!listStats) return

        listStats.averageSaves = listStats.totalSaves / listStats.userCount
        const savesById = listStats.savesById
        const topItems = Object.keys(savesById)
            .sort((a, b) => savesById[b] - savesById[a]
                || (items[a]?.shortName ?? '').localeCompare(items[b]?.shortName ?? ''))
            .map((itemId, index) => ({
                id: itemId,
                saveCount: savesById[itemId],
                name: items[itemId]?.shortName,
                rank: index + 1
            }))
        listStats.topItems = listName === 'recordedLocks'
            ? topItems.slice(0, 300)
            : topItems.slice(0, 25)
        delete listStats.savesById
    })

    if (collectionStatsCurrent.listUserIds) delete collectionStatsCurrent.listUserIds
    if (collectionStatsCurrent.listStats?.allLists?.userIds) {
        delete collectionStatsCurrent.listStats.allLists.userIds
    }

    return collectionStatsCurrent
}

export async function collectionAnalyzer({blackBeltOnly, date, backupDir, items}) {
    const backupFile = path.join(backupDir, 'archive', `backup_${date}.json`)
    const backup = JSON.parse(await fs.readFile(backupFile, 'utf8'))
    const collectionData = backup?.__collections__?.lockcollections
    if (!collectionData || typeof collectionData !== 'object') {
        throw new Error(`Invalid lockcollections backup: ${backupFile}`)
    }
    return analyzeProfiles({collectionData, items, blackBeltOnly})
}

async function analyzeCollectionDate({
    date,
    backupDir,
    dailyDir,
    apiDir,
    publicDataDir,
    items,
    runDate
}) {
    const allUsers = await collectionAnalyzer({
        blackBeltOnly: false,
        date,
        backupDir,
        items
    })
    const sortedSavesById = Object.entries(allUsers.totalSavesById ?? {})
        .sort((a, b) => b[1] - a[1])
        .map(([id, count]) => ({
            id,
            name: items[id]?.itemName,
            totalSaves: count,
            ownCount: allUsers.ownSavesById?.[id],
            scorecardCount: allUsers.scorecardSavesById?.[id],
            wishlistCount: allUsers.wishlistSavesById?.[id]
        }))

    const collectionStatsById = {
        metadata: {
            updatedDateTime: runDate.toISOString(),
            source: 'generated-summary'
        },
        data: {locks: sortedSavesById}
    }

    delete allUsers.ownSavesById
    delete allUsers.scorecardSavesById
    delete allUsers.allSavesById

    const blackBeltOnly = await collectionAnalyzer({
        blackBeltOnly: true,
        date,
        backupDir,
        items
    })
    const collectionStatsCurrent = {
        metadata: {updatedDateTime: runDate.toISOString()},
        allUsers,
        blackBeltOnly
    }

    await Promise.all([
        writeJsonFileAtomic(
            path.join(apiDir, 'collectionStatsByIdFull.json'),
            collectionStatsById
        ),
        writeJsonFileAtomic(
            path.join(dailyDir, `collectionStats_${date}.json`),
            collectionStatsCurrent
        ),
        writeJsonFileAtomic(
            path.join(publicDataDir, 'collectionStatsCurrent.json'),
            collectionStatsCurrent
        )
    ])

    return {collectionStatsById, collectionStatsCurrent}
}

function datesFromFiles(files, pattern) {
    return files
        .map(file => file.match(pattern)?.[1])
        .filter(Boolean)
}

export async function runCollectionAnalysis({
    backupDir,
    dailyDir,
    apiDir,
    publicDataDir,
    itemDetailsLoader = itemDetails,
    now = () => new Date()
}) {
    const runDate = now()
    const archiveDir = path.join(backupDir, 'archive')
    const [backupFiles, statsFiles] = await Promise.all([
        fs.readdir(archiveDir),
        readDirIfExists(dailyDir)
    ])
    const backupDates = datesFromFiles(backupFiles, backupFilePattern)
    const statsDates = new Set(datesFromFiles(statsFiles, statsFilePattern))
    const today = dayjs(runDate).format('YYYY-MM-DD')
    const datesToProcess = backupDates
        .filter(date => !statsDates.has(date) || date === today)
        .sort()

    if (datesToProcess.length === 0) {
        return Object.freeze({processedDates: [], latestDate: null})
    }

    const items = await itemDetailsLoader()

    for (const date of datesToProcess) {
        await analyzeCollectionDate({
            date,
            backupDir,
            dailyDir,
            apiDir,
            publicDataDir,
            items,
            runDate
        })
    }

    return Object.freeze({
        processedDates: datesToProcess,
        latestDate: datesToProcess.at(-1) ?? null
    })
}

export async function collectionAnalyzerMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment,
    itemDetailsLoader = itemDetails,
    now = () => new Date()
} = {}) {
    loadCollectionEnvironment({env, loadEnvironment})
    const config = loadExportJobConfig({
        env,
        requirePublicDataDir: true,
        requireDailyDir: true,
        requireApiDir: true
    })
    const summary = exportJobConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const result = await runCollectionAnalysis({
        backupDir: config.backupDir,
        dailyDir: config.dailyDir,
        apiDir: config.apiDir,
        publicDataDir: config.publicDataDir,
        itemDetailsLoader,
        now
    })
    if (!argv.includes('cron')) writeOutput('Collection analysis complete', result)
    return result
}

if (isDirectRun(import.meta.url)) {
    await collectionAnalyzerMain()
}
