#!/usr/bin/env node

import {spawn} from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import isDirectRun from '../src/util/isDirectRun.js'
import {loadRuntimeEnvironment} from '../src/util/runtimeEnvironment.js'
import {loadExportJobConfig, exportJobConfigSummary} from '../src/projects/collections/exportJobConfig.js'
import {loadRedditBeltsConfig, redditBeltsConfigSummary} from '../src/projects/redditBelts/redditBeltsConfig.js'
import {loadDiscordBeltCountsConfig} from '../src/projects/collections/discordBeltCountsDownload.js'
import {
    catalogFilenames,
    catalogRefreshConfigSummary,
    loadCatalogArray,
    loadCatalogDataConfig,
    loadCatalogRefreshConfig
} from '../src/util/catalogData.js'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const collectionsDir = path.resolve(projectRoot, 'src/projects/collections')
const pipelineLockName = '.collection-export-analysis.lock'

export const jobs = [
    {
        script: path.resolve(collectionsDir, 'catalogSnapshotDownload.js'),
        optionalRefresh: 'catalog'
    },
    {script: path.resolve(collectionsDir, 'collectionsExport.js')},
    {script: path.resolve(collectionsDir, 'awardsEvidenceExport.js')},
    {script: path.resolve(collectionsDir, 'collectionAnalyzer.js')},
    {script: path.resolve(collectionsDir, 'collectionStatsProcess.js')},
    {script: path.resolve(collectionsDir, 'leaderboardStatsProcess.js')},
    {script: path.resolve(projectRoot, 'src/projects/lockStatistics/lockStats.js')},
    {script: path.resolve(collectionsDir, 'raflCollectionUtils.js')},
    {
        script: path.resolve(projectRoot, 'src/projects/redditBelts/runGetRedditBelts.js'),
        optionalRefresh: 'reddit'
    },
    {
        script: path.resolve(collectionsDir, 'discordBeltCountsDownload.js'),
        optionalRefresh: 'discord'
    },
    {script: path.resolve(collectionsDir, 'exportAllProcessor.js')}
]

export function selectJobs(env) {
    return jobs.filter(job => {
        if (job.optionalRefresh === 'catalog') {
            return env.LPU_CATALOG_REFRESH_ENABLED === 'true'
        }
        if (job.optionalRefresh === 'reddit') return env.REDDIT_BELTS_ENABLED === 'true'
        if (job.optionalRefresh === 'discord') {
            return env.DISCORD_BELT_COUNTS_REFRESH_ENABLED === 'true'
        }
        return true
    })
}

async function readAndValidateJson(filePath, validator, label) {
    let value
    try {
        value = JSON.parse(await fs.readFile(filePath, 'utf8'))
    } catch (cause) {
        const error = new Error(`Unable to load required pipeline input ${label}: ${filePath}`)
        error.cause = cause
        throw error
    }
    if (!validator(value)) throw new Error(`Invalid required pipeline input ${label}: ${filePath}`)
}

export async function preflightCollectionPipeline(env) {
    const exportConfig = loadExportJobConfig({
        env,
        requirePublicDataDir: true,
        requireDailyDir: true,
        requireApiDir: true
    })
    const catalogConfig = loadCatalogDataConfig(env)
    const catalogRefreshConfig = loadCatalogRefreshConfig(env)
    const redditConfig = loadRedditBeltsConfig({env})
    const discordConfig = loadDiscordBeltCountsConfig(env)

    if (redditConfig.enabled && redditConfig.outputDir !== exportConfig.publicDataDir) {
        throw new Error('REDDIT_BELTS_OUTPUT_DIR must match COLLECTION_PUBLIC_DATA_DIR for the combined pipeline')
    }

    if (catalogRefreshConfig.enabled && catalogConfig.source !== 'filesystem') {
        throw new Error('LPU_CATALOG_SOURCE must be filesystem when catalog refresh is enabled')
    }
    if (!catalogRefreshConfig.enabled) {
        await Promise.all(catalogFilenames.map(filename =>
            loadCatalogArray(filename, {config: catalogConfig})))
    }

    const objectWithCounts = value => value && typeof value === 'object'
        && !Array.isArray(value)
        && Object.keys(value).length > 0
        && Object.values(value).every(count => Number.isFinite(count) && count >= 0)
    const requiredInputs = [
        {
            filename: 'unclaimedEvidence.json',
            validator: Array.isArray,
            label: 'unclaimed evidence'
        },
        ...(!redditConfig.enabled ? [{
            filename: 'redditBeltCounts.json',
            validator: objectWithCounts,
            label: 'Reddit belt counts'
        }] : []),
        ...(!discordConfig.enabled ? [{
            filename: 'discordBeltCounts.json',
            validator: objectWithCounts,
            label: 'Discord belt counts'
        }] : [])
    ]
    await Promise.all(requiredInputs.map(input => readAndValidateJson(
        path.join(exportConfig.publicDataDir, input.filename),
        input.validator,
        input.label
    )))

    return Object.freeze({
        exportConfig,
        catalogConfig,
        catalogRefreshConfig,
        redditConfig,
        discordConfig
    })
}

export async function acquirePipelineLock(exportDir) {
    const lockDir = path.join(exportDir, pipelineLockName)
    await fs.mkdir(exportDir, {recursive: true})
    try {
        await fs.mkdir(lockDir)
    } catch (error) {
        if (error.code === 'EEXIST') {
            const lockError = new Error(`Collection export and analysis is already running: ${lockDir}`)
            lockError.code = 'collection_pipeline_locked'
            throw lockError
        }
        throw error
    }

    try {
        await fs.writeFile(path.join(lockDir, 'owner.json'), JSON.stringify({
            pid: process.pid,
            hostname: os.hostname(),
            startedAt: new Date().toISOString()
        }, null, 2))
    } catch (error) {
        await fs.rm(lockDir, {recursive: true, force: true})
        throw error
    }

    let released = false
    return async () => {
        if (released) return
        released = true
        await fs.rm(lockDir, {recursive: true, force: true})
    }
}

export function loadRunnerEnvironment({
    env = process.env,
    loadEnvironment
} = {}) {
    const childEnv = {...env}
    const result = loadRuntimeEnvironment({
        env: childEnv,
        envDir: projectRoot,
        loadEnvironment,
        override: false
    })
    return {...result, childEnv}
}

export function runJob(job, env = process.env, runnerArgs = []) {
    return new Promise((resolve, reject) => {
        const child = spawn(
            process.execPath,
            [job.script, ...(job.args ?? []), ...runnerArgs],
            {
                cwd: projectRoot,
                env,
                stdio: 'inherit'
            }
        )

        child.on('error', reject)
        child.on('exit', (code, signal) => {
            if (signal) {
                reject(new Error(`${path.basename(job.script)} exited after signal ${signal}`))
                return
            }
            if (code !== 0) {
                reject(new Error(`${path.basename(job.script)} exited with code ${code}`))
                return
            }
            resolve()
        })
    })
}

export async function runCollectionExportAnalysis({
    env = process.env,
    argv = process.argv,
    loadEnvironment,
    runJobFn = runJob,
    preflightFn = preflightCollectionPipeline,
    acquireLockFn = acquirePipelineLock,
    writeOutput = console.log
} = {}) {
    const {environment, envPath, childEnv} = loadRunnerEnvironment({env, loadEnvironment})
    const selectedJobs = selectJobs(childEnv)
    if (argv.includes('--check-config')) {
        const exportConfig = loadExportJobConfig({
            env: childEnv,
            requirePublicDataDir: true,
            requireDailyDir: true,
            requireApiDir: true
        })
        const summary = {
            ...exportJobConfigSummary(exportConfig),
            catalog: loadCatalogDataConfig(childEnv),
            catalogRefresh: catalogRefreshConfigSummary(loadCatalogRefreshConfig(childEnv)),
            reddit: redditBeltsConfigSummary(loadRedditBeltsConfig({env: childEnv})),
            discord: loadDiscordBeltCountsConfig(childEnv),
            jobs: selectedJobs.map(job => path.relative(projectRoot, job.script))
        }
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }
    const preflight = await preflightFn(childEnv)
    const releaseLock = await acquireLockFn(preflight.exportConfig.exportDir)
    const runnerArgs = argv.includes('cron') ? ['cron'] : []
    const cronRun = runnerArgs.length > 0
    if (!cronRun) {
        writeOutput(`Running collection export and analysis for ${environment}`)
        writeOutput(`Loaded configuration from ${envPath}`)
    }

    try {
        for (const job of selectedJobs) {
            if (!cronRun) writeOutput(`\nRunning ${path.relative(projectRoot, job.script)}`)
            await runJobFn(job, childEnv, runnerArgs)
        }
    } finally {
        await releaseLock()
    }
}

if (isDirectRun(import.meta.url)) {
    runCollectionExportAnalysis().catch(error => {
        console.error(error.message)
        process.exitCode = 1
    })
}
