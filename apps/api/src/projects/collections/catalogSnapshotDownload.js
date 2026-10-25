import fs from 'node:fs/promises'
import path from 'node:path'
import isDirectRun from '../../util/isDirectRun.js'
import {
    catalogFilenames,
    catalogRefreshConfigSummary,
    loadCatalogArray,
    loadCatalogRefreshConfig
} from '../../util/catalogData.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'

function refreshDisabledError() {
    const error = new Error('Catalog snapshot refresh is disabled')
    error.code = 'catalog_refresh_disabled'
    return error
}

export async function runCatalogSnapshotDownload({
    catalogDir,
    remoteConfig,
    catalogLoader = loadCatalogArray
}) {
    const catalogs = await Promise.all(catalogFilenames.map(async filename => ({
        filename,
        data: await catalogLoader(filename, {config: remoteConfig})
    })))

    await fs.mkdir(catalogDir, {recursive: true})
    const temporaryFiles = catalogs.map(({filename}) => ({
        filename,
        temporaryPath: path.join(
            catalogDir,
            `.${filename}.tmp-${process.pid}-${Date.now()}`
        ),
        outputPath: path.join(catalogDir, filename)
    }))

    try {
        await Promise.all(catalogs.map(({data}, index) =>
            fs.writeFile(temporaryFiles[index].temporaryPath, `${JSON.stringify(data, null, 2)}\n`)))
        for (const file of temporaryFiles) {
            await fs.rename(file.temporaryPath, file.outputPath)
        }
    } catch (error) {
        await Promise.all(temporaryFiles.map(file =>
            fs.rm(file.temporaryPath, {force: true})))
        throw error
    }

    return Object.freeze({
        catalogDir,
        files: temporaryFiles.map(file => file.outputPath)
    })
}

export async function catalogSnapshotDownloadMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment,
    catalogLoader = loadCatalogArray
} = {}) {
    loadCollectionEnvironment({env, loadEnvironment})
    const config = loadCatalogRefreshConfig(env)
    const summary = catalogRefreshConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }
    if (!config.enabled) throw refreshDisabledError()

    const result = await runCatalogSnapshotDownload({
        catalogDir: config.catalogDir,
        remoteConfig: config.remoteConfig,
        catalogLoader
    })
    if (!argv.includes('cron')) {
        writeOutput('Catalog snapshot refresh complete', {
            catalogDir: result.catalogDir,
            fileCount: result.files.length
        })
    }
    return result
}

if (isDirectRun(import.meta.url)) {
    await catalogSnapshotDownloadMain()
}
