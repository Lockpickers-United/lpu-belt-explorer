import path from 'node:path'
import dayjs from 'dayjs'
import {setDeep, setDeepAdd} from '../../util/setDeep.js'
import {itemDetails} from '../../util/getItemDetails.js'
import {loadCatalogArray} from '../../util/catalogData.js'
import isDirectRun from '../../util/isDirectRun.js'
import {writeJsonFileAtomic} from '../../util/writeJsonFileAtomic.js'
import {loadCollectionEnvironment} from '../collections/collectionEnvironment.js'
import {exportJobConfigSummary, loadExportJobConfig} from '../collections/exportJobConfig.js'

const topN = 250

export async function loadLockData(options) {
    return loadCatalogArray('data.json', options)
}

function mechanismId(mechanism) {
    return mechanism.replaceAll(/[ |/]/g, '-').toLowerCase()
}

function hasValidImage(entry) {
    return Array.isArray(entry.media) && entry.media.some(media =>
        typeof media?.fullSizeUrl === 'string' && media.fullSizeUrl.trim().length > 0
    )
}

function buildImageContributorStats(allEntries) {
    const imageContributors = Object.values(allEntries).reduce((acc, entry) => {
        if (!Array.isArray(entry.media)) return acc
        entry.media.forEach(media => {
            if (typeof media?.fullSizeUrl !== 'string' || !media.fullSizeUrl.trim()) return
            const contributor = typeof media.title === 'string'
                ? media.title.replace('By: ', '').trim()
                : undefined
            setDeep(
                acc,
                [media.fullSizeUrl],
                contributor
            )
        })
        return acc
    }, {})
    const contributorCounts = Object.values(imageContributors).reduce((acc, contributor) => {
        if (contributor) setDeepAdd(acc, [contributor], 1)
        return acc
    }, {})

    return {
        uniqueImages: Object.keys(imageContributors).length,
        contributors: Object.keys(contributorCounts).length,
        topPhotographers: Object.entries(contributorCounts)
            .map(([contributor, images]) => ({contributor, images}))
            .sort((a, b) => b.images - a.images
                || a.contributor.localeCompare(b.contributor))
    }
}

export function buildLockStats({lockData, allEntries, runDate}) {
    const lockStats = lockData.reduce((acc, lock) => {
        const segment = lock.belt === 'Unranked' ? 'Unranked' : 'Ranked'
        const belt = lock.belt.replace(/ \d/, '')
        setDeepAdd(acc, ['lockBySegmentCounts', segment], 1)
        setDeepAdd(acc, ['lockBySegmentCounts', 'All'], 1)
        setDeepAdd(acc, ['locksByBeltCounts', belt], 1)

        if (lock.lockingMechanisms) {
            const lockingMechanism = lock.lockingMechanisms.length === 1
                ? lock.lockingMechanisms[0]
                : 'Multiple'
            setDeepAdd(acc, ['locksByMechanism', lockingMechanism], 1)
            setDeepAdd(acc, ['locksByMechanismByBelt', belt, lockingMechanism], 1)
        }
        return acc
    }, {})

    const segmentCounts = lockStats.lockBySegmentCounts ?? {}
    const totalLocks = segmentCounts.All ?? 0
    lockStats.lockCounts = {
        description: 'Locks',
        data: Object.entries(segmentCounts).map(([label, value]) => ({value, label}))
    }
    lockStats.locksByBelt = Object.entries(lockStats.locksByBeltCounts ?? {})
        .map(([belt, count]) => ({
            belt,
            count,
            value: totalLocks > 0 ? count / totalLocks : 0,
            id: belt
        }))
    delete lockStats.locksByBeltCounts

    lockStats.lockingMechanisms = Object.entries(lockStats.locksByMechanism ?? {})
        .map(([mechanism, value]) => ({
            label: mechanism,
            value,
            id: mechanismId(mechanism)
        }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
    delete lockStats.locksByMechanism

    lockStats.lockingMechanismsByBelt = Object.entries(
        lockStats.locksByMechanismByBelt ?? {}
    ).reduce((acc, [belt, mechanisms]) => {
        acc[belt] = Object.entries(mechanisms)
            .map(([mechanism, value]) => ({
                label: mechanism,
                value,
                id: mechanismId(mechanism)
            }))
            .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
        return acc
    }, {})
    delete lockStats.locksByMechanismByBelt

    const photoCounts = lockData.reduce((acc, lock) => {
        if (hasValidImage(lock)) {
            setDeepAdd(acc, ['All locks'], 1)
            if (lock.belt !== 'Unranked') setDeepAdd(acc, ['Ranked locks'], 1)
        }
        return acc
    }, {})
    const topLocks = lockData
        .filter(lock => Number.isFinite(lock.views) && lock.views > 0)
        .sort((a, b) => b.views - a.views)
        .slice(0, topN)

    const rankedLocks = segmentCounts.Ranked ?? 0
    const topLockMedia = topLocks.filter(hasValidImage).length
    const rankedLockMedia = photoCounts['Ranked locks'] ?? 0
    const allLockMedia = photoCounts['All locks'] ?? 0
    const contributorStats = buildImageContributorStats(allEntries)
    lockStats.photoStats = {
        photoSegments: [
            {
                segment: `Top ${topN} locks`,
                count: topN,
                media: topLockMedia,
                coverage: `${Math.floor((topLockMedia / topN) * 100)}%`
            },
            {
                segment: 'Ranked locks',
                count: rankedLocks,
                media: rankedLockMedia,
                coverage: `${rankedLocks > 0
                    ? Math.floor((rankedLockMedia / rankedLocks) * 100)
                    : 0}%`
            },
            {
                segment: 'All locks',
                count: totalLocks,
                media: allLockMedia,
                coverage: `${totalLocks > 0
                    ? Math.floor((allLockMedia / totalLocks) * 100)
                    : 0}%`
            }
        ],
        ...contributorStats
    }
    delete lockStats.lockBySegmentCounts
    lockStats.metadata = {updatedDateTime: dayjs(runDate).format('YYYY-MM-DD HH:mm')}

    return lockStats
}

export async function runLockStats({
    publicDataDir,
    lockDataLoader = loadLockData,
    itemDetailsLoader = itemDetails,
    now = () => new Date()
}) {
    const lockData = await lockDataLoader()
    if (!Array.isArray(lockData)) throw new Error('Invalid lock data')

    const allEntries = await itemDetailsLoader()
    if (!allEntries || typeof allEntries !== 'object' || Array.isArray(allEntries)) {
        throw new Error('Invalid item details')
    }

    const lockStats = buildLockStats({lockData, allEntries, runDate: now()})
    const outputFile = path.join(publicDataDir, 'lockStats.json')
    await writeJsonFileAtomic(outputFile, lockStats)

    return Object.freeze({lockCount: lockData.length, outputFile, lockStats})
}

export async function lockStatsMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment,
    lockDataLoader = loadLockData,
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

    const result = await runLockStats({
        publicDataDir: config.publicDataDir,
        lockDataLoader,
        itemDetailsLoader,
        now
    })
    if (!argv.includes('cron')) {
        writeOutput('Lock statistics processing complete', {
            lockCount: result.lockCount,
            outputFile: result.outputFile
        })
    }
    return result
}

if (isDirectRun(import.meta.url)) {
    await lockStatsMain()
}
