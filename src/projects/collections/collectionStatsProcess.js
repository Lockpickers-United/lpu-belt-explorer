import fs from 'node:fs/promises'
import path from 'node:path'
import isDirectRun from '../../util/isDirectRun.js'
import {writeJsonFileAtomic} from '../../util/writeJsonFileAtomic.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'

const cohorts = ['allUsers', 'blackBeltOnly']
const statsFilePattern = /^collectionStats_(\d{4}-\d{2}-\d{2})\.json$/

async function readDailyStats(dailyDir) {
    const datedFiles = (await fs.readdir(dailyDir))
        .map(file => ({file, date: file.match(statsFilePattern)?.[1]}))
        .filter(file => file.date)
        .sort((a, b) => a.date.localeCompare(b.date))

    return Promise.all(datedFiles.map(async ({file, date}) => ({
        date,
        content: JSON.parse(await fs.readFile(path.join(dailyDir, file), 'utf8'))
    })))
}

function cohortStats({date, current = {}, previous}) {
    const totalProfiles = current.totalProfiles || 0
    const listUsers = current.listUsers || 0
    const totalSaves = current.totalSaves || 0
    const lockSaves = current.lockSaves || 0
    const totalAwards = current.importSummary?.totalAwards || 0
    const importUsers = current.importSummary?.importUsers || 0
    const awardUsers = current.importSummary?.awardUsers || 0
    const listStats = current.listStats
        ? Object.entries(current.listStats).map(([listName, stats]) => ({
            listName,
            userCount: stats.userCount,
            totalSaves: stats.totalSaves
        }))
        : []

    return {
        date,
        totalProfiles,
        listUsers,
        totalSaves,
        lockSaves,
        totalAwards,
        importUsers,
        awardUsers,
        listStats,
        newProfiles: previous ? totalProfiles - previous.totalProfiles : totalProfiles,
        newListUsers: previous ? listUsers - previous.listUsers : listUsers,
        newImportUsers: previous ? importUsers - previous.importUsers : importUsers
    }
}

export function buildCollectionStatsDaily(dailyData, runDate) {
    const dayData = []
    const blackBeltAcquiredDates = new Map()
    let blackBelts = {}

    dailyData.forEach(({date, content}) => {
        const currentBlackBelts = content.blackBeltOnly?.blackBelts ?? {}
        blackBelts = Object.fromEntries(Object.entries(currentBlackBelts).map(([userId, belt]) => {
            if (!blackBeltAcquiredDates.has(userId)) {
                blackBeltAcquiredDates.set(userId, date)
            }
            return [userId, {
                ...belt,
                acquired: blackBeltAcquiredDates.get(userId)
            }]
        }))

        const previousDay = dayData.at(-1)
        const day = {date}
        cohorts.forEach(cohort => {
            day[cohort] = cohortStats({
                date,
                current: content[cohort],
                previous: previousDay?.[cohort]
            })
        })
        dayData.push(day)
    })

    return {
        blackBelts,
        dayData,
        metadata: {updatedDateTime: runDate.toISOString()}
    }
}

export async function runCollectionStatsProcess({
    dailyDir,
    publicDataDir,
    now = () => new Date()
}) {
    const runDate = now()
    const dailyData = await readDailyStats(dailyDir)
    const collectionStatsDaily = buildCollectionStatsDaily(dailyData, runDate)
    const outputFile = path.join(publicDataDir, 'collectionStatsDaily.json')
    await writeJsonFileAtomic(outputFile, collectionStatsDaily)

    return Object.freeze({
        dayCount: collectionStatsDaily.dayData.length,
        outputFile,
        collectionStatsDaily
    })
}

export const collectionStatsProcess = runCollectionStatsProcess

export async function collectionStatsProcessMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment,
    now = () => new Date()
} = {}) {
    loadCollectionEnvironment({env, loadEnvironment})
    const config = loadExportJobConfig({
        env,
        requirePublicDataDir: true,
        requireDailyDir: true
    })
    const summary = exportJobConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const result = await runCollectionStatsProcess({
        dailyDir: config.dailyDir,
        publicDataDir: config.publicDataDir,
        now
    })
    if (!argv.includes('cron')) {
        writeOutput('Collection stats processing complete', {
            dayCount: result.dayCount,
            outputFile: result.outputFile
        })
    }
    return result
}

if (isDirectRun(import.meta.url)) {
    await collectionStatsProcessMain()
}
