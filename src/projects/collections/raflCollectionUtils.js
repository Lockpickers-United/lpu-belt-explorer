import fs from 'node:fs/promises'
import path from 'node:path'
import {setDeep, setDeepAdd, setDeepMax} from '../../util/setDeep.js'
import isDirectRun from '../../util/isDirectRun.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'

async function writeJsonFileAtomic(filePath, data) {
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    const tempFile = `${filePath}.tmp-${process.pid}-${Date.now()}`
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2))
    await fs.rename(tempFile, filePath)
}

export function buildRaflCollectionDetails(profiles) {
    const raffleWatchlists = Object.values(profiles)
        .map(profile => profile.raffleWatchlist)
        .filter(watchlist => Array.isArray(watchlist) && watchlist.length > 0)

    const watchlistDetails = raffleWatchlists.reduce((acc, raffleWatchlist) => {
        raffleWatchlist.forEach(potId => {
            setDeepAdd(acc, ['potWatches', potId], 1)
            setDeepAdd(acc, ['allPotWatches'], 1)
        })
        setDeepMax(acc, ['potWatchMax'], raffleWatchlist.length)
        setDeepAdd(acc, ['potWatchCounts', raffleWatchlist.length], 1)
        return acc
    }, {})

    const raffleWatchlistUsers = raffleWatchlists.length
    setDeep(watchlistDetails, ['raffleWatchlistUsers'], raffleWatchlistUsers)
    setDeep(
        watchlistDetails,
        ['raffleWatchlistAverage'],
        raffleWatchlistUsers > 0
            ? watchlistDetails.allPotWatches / raffleWatchlistUsers
            : 0
    )

    return watchlistDetails
}

export async function runRaflCollectionUtils({backupDir, publicDataDir}) {
    const backupFile = path.join(backupDir, 'backup.json')
    const backup = JSON.parse(await fs.readFile(backupFile, 'utf8'))
    const profiles = backup?.__collections__?.lockcollections
    if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) {
        throw new Error(`Invalid lockcollections backup: ${backupFile}`)
    }

    const raflCollectionDetails = buildRaflCollectionDetails(profiles)
    const outputFile = path.join(publicDataDir, 'raflCollectionDetails.json')
    await writeJsonFileAtomic(outputFile, raflCollectionDetails)

    return Object.freeze({
        watchlistUserCount: raflCollectionDetails.raffleWatchlistUsers,
        outputFile,
        raflCollectionDetails
    })
}

export const raflCollectionUtils = runRaflCollectionUtils

export async function raflCollectionUtilsMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment
} = {}) {
    loadCollectionEnvironment({env, loadEnvironment})
    const config = loadExportJobConfig({env, requirePublicDataDir: true})
    const summary = exportJobConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const result = await runRaflCollectionUtils({
        backupDir: config.backupDir,
        publicDataDir: config.publicDataDir
    })
    if (!argv.includes('cron')) {
        writeOutput('RAFL collection processing complete', {
            watchlistUserCount: result.watchlistUserCount,
            outputFile: result.outputFile
        })
    }
    return result
}

if (isDirectRun(import.meta.url)) {
    await raflCollectionUtilsMain()
}
