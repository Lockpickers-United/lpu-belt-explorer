import fs from 'node:fs/promises'
import path from 'node:path'
import {setDeepAdd} from '../../util/setDeep.js'
import {itemDetails} from '../../util/getItemDetails.js'
import {uniqueBelts} from '../../util/belts.js'
import isDirectRun from '../../util/isDirectRun.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'

async function writeJsonFileAtomic(filePath, data) {
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    const tempFile = `${filePath}.tmp-${process.pid}-${Date.now()}`
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2))
    await fs.rename(tempFile, filePath)
}

function validateExportData(exportDocument, filePath, exportName) {
    if (!Array.isArray(exportDocument?.data)) {
        throw new Error(`Invalid ${exportName} export: ${filePath}`)
    }
    return exportDocument.data
}

function validateBeltCounts(beltCounts, filePath, platform) {
    if (!beltCounts || typeof beltCounts !== 'object' || Array.isArray(beltCounts)) {
        throw new Error(`Invalid ${platform} belt counts: ${filePath}`)
    }
    return beltCounts
}

function cleanBeltCounts(beltCounts) {
    return Object.entries(beltCounts).reduce((acc, [belt, count]) => {
        acc[belt.replace(/ Belt/, '')] = count
        return acc
    }, {})
}

function awardEvidenceByUserAndAward(awardsData) {
    return awardsData.reduce((acc, award) => {
        const key = `${award.userId}:${award.awardId}`
        if (!acc.has(key)) acc.set(key, award)
        return acc
    }, new Map())
}

export function buildScorecardStats({
    lockcollections,
    awardsData,
    allItemDetails,
    redditBeltCounts,
    discordBeltCounts,
    runDate
}) {
    const awardEvidence = awardEvidenceByUserAndAward(awardsData)
    const scorecardStats = lockcollections.reduce((acc, user) => {
        const awards = Array.isArray(user.awards) ? user.awards : []
        const recordedLocks = Array.isArray(user.recordedLocks) ? user.recordedLocks : []
        const maxRank = awards.reduce((rank, awardId) => {
            const award = allItemDetails[awardId]
            return award?.awardType === 'belt' && rank < award.rank ? award.rank : rank
        }, 0)
        const belt = maxRank > 0 ? uniqueBelts[maxRank - 1] : 'NoBelts'
        const dan = belt === 'Black'
            ? user.danLevel > 1
                ? user.danLevel
                : 1
            : undefined

        setDeepAdd(acc, ['userCounts', 'totalUsers'], 1)
        setDeepAdd(acc, ['userCounts', 'scorecardUsers'], recordedLocks.length > 0 ? 1 : 0)
        setDeepAdd(acc, ['userCounts', 'beltedUsers'], belt !== 'NoBelts' ? 1 : 0)
        if (belt !== 'NoBelts') setDeepAdd(acc, ['userCounts', 'belts', belt], 1)
        if (dan) setDeepAdd(acc, ['userCounts', 'dans', dan], 1)

        new Set(recordedLocks).forEach(id => {
            setDeepAdd(acc, ['lockCountsByUserBelt', id, 'scorecardPicks', belt], 1)
            setDeepAdd(acc, ['lockCountsByUserBelt', id, 'scorecardPicks', 'All Belts'], 1)

            const entry = allItemDetails[id]
            if (entry?.belt && entry.lockingMechanisms) {
                const lockingMechanism = entry.lockingMechanisms.length === 1
                    ? entry.lockingMechanisms[0]
                    : 'Multiple'
                setDeepAdd(acc, ['byBeltByMechanism', belt, lockingMechanism], 1)
                setDeepAdd(acc, ['byBelt', entry.belt], 1)
                setDeepAdd(acc, ['byMechanism', lockingMechanism], 1)
            }
        })

        awards.forEach(awardId => {
            const award = awardEvidence.get(`${user.docId}:${awardId}`)
            if (award?.awardUrl?.includes('discord')) {
                setDeepAdd(acc, ['awardSources', 'discord'], 1)
            } else if (award?.awardUrl?.includes('reddit')) {
                setDeepAdd(acc, ['awardSources', 'reddit'], 1)
            }
        })

        return acc
    }, {})

    scorecardStats.platformBeltCounts = {
        discord: cleanBeltCounts(discordBeltCounts),
        reddit: cleanBeltCounts(redditBeltCounts)
    }
    scorecardStats.metadata = {date: runDate.toISOString()}

    return scorecardStats
}

export async function runExportAllProcessor({
    exportDir,
    publicDataDir,
    itemDetailsLoader = itemDetails,
    now = () => new Date()
}) {
    const lockcollectionsFile = path.join(exportDir, 'lockcollections.json')
    const awardsFile = path.join(exportDir, 'awards.json')
    const redditBeltCountsFile = path.join(publicDataDir, 'redditBeltCounts.json')
    const discordBeltCountsFile = path.join(publicDataDir, 'discordBeltCounts.json')
    const [lockcollectionsDocument, awardsDocument, redditCounts, discordCounts] =
        await Promise.all([
            fs.readFile(lockcollectionsFile, 'utf8').then(JSON.parse),
            fs.readFile(awardsFile, 'utf8').then(JSON.parse),
            fs.readFile(redditBeltCountsFile, 'utf8').then(JSON.parse),
            fs.readFile(discordBeltCountsFile, 'utf8').then(JSON.parse)
        ])
    const lockcollections = validateExportData(
        lockcollectionsDocument,
        lockcollectionsFile,
        'lockcollections'
    )
    const awardsData = validateExportData(awardsDocument, awardsFile, 'awards')
    const redditBeltCounts = validateBeltCounts(
        redditCounts,
        redditBeltCountsFile,
        'Reddit'
    )
    const discordBeltCounts = validateBeltCounts(
        discordCounts,
        discordBeltCountsFile,
        'Discord'
    )
    const allItemDetails = await itemDetailsLoader()
    if (!allItemDetails || typeof allItemDetails !== 'object' || Array.isArray(allItemDetails)) {
        throw new Error('Invalid item details')
    }

    const scorecardStats = buildScorecardStats({
        lockcollections,
        awardsData,
        allItemDetails,
        redditBeltCounts,
        discordBeltCounts,
        runDate: now()
    })
    const outputFile = path.join(publicDataDir, 'scorecardStats.json')
    await writeJsonFileAtomic(outputFile, scorecardStats)

    return Object.freeze({outputFile, scorecardStats})
}

export default async function processExportAll(options) {
    const result = await runExportAllProcessor(options)
    return result.scorecardStats
}

export async function exportAllProcessorMain({
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

    const result = await runExportAllProcessor({
        exportDir: config.exportDir,
        publicDataDir: config.publicDataDir,
        itemDetailsLoader,
        now
    })
    if (!argv.includes('cron')) {
        writeOutput('Export-all processing complete', {
            totalUsers: result.scorecardStats.userCounts?.totalUsers ?? 0,
            outputFile: result.outputFile
        })
    }
    return result
}

if (isDirectRun(import.meta.url)) {
    await exportAllProcessorMain()
}
