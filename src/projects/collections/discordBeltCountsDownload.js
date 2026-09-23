import fs from 'node:fs/promises'
import path from 'node:path'
import fetch from 'node-fetch'
import isDirectRun from '../../util/isDirectRun.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'

export const discordBeltCountsUrl =
    'http://explore.lpubelts.com/data/discordBeltCounts.json'

async function writeJsonFileAtomic(filePath, data) {
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    const tempFile = `${filePath}.tmp-${process.pid}-${Date.now()}`
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2))
    await fs.rename(tempFile, filePath)
}

function validateDiscordBeltCounts(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Invalid Discord belt counts response')
    }
    return data
}

export async function runDiscordBeltCountsDownload({
    publicDataDir,
    fetchImpl = fetch
}) {
    const response = await fetchImpl(discordBeltCountsUrl)
    if (!response.ok) {
        throw new Error(`Unable to download Discord belt counts: HTTP ${response.status}`)
    }

    const discordBeltCounts = validateDiscordBeltCounts(await response.json())
    const outputFile = path.join(publicDataDir, 'discordBeltCounts.json')
    await writeJsonFileAtomic(outputFile, discordBeltCounts)

    return Object.freeze({outputFile, discordBeltCounts})
}

export async function discordBeltCountsDownloadMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment,
    fetchImpl = fetch
} = {}) {
    loadCollectionEnvironment({env, loadEnvironment})
    const config = loadExportJobConfig({env, requirePublicDataDir: true})
    const summary = exportJobConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const result = await runDiscordBeltCountsDownload({
        publicDataDir: config.publicDataDir,
        fetchImpl
    })
    if (!argv.includes('cron')) {
        writeOutput('Discord belt counts download complete', {
            outputFile: result.outputFile
        })
    }
    return result
}

if (isDirectRun(import.meta.url)) {
    await discordBeltCountsDownloadMain()
}
