#!/usr/bin/env node

import {spawn} from 'node:child_process'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import isDirectRun from '../src/util/isDirectRun.js'
import {loadRuntimeEnvironment} from '../src/util/runtimeEnvironment.js'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const collectionsDir = path.resolve(projectRoot, 'src/projects/collections')

export const jobs = [
    {script: path.resolve(collectionsDir, 'collectionsExport.js')},
    {script: path.resolve(collectionsDir, 'awardsEvidenceExport.js')},
    {script: path.resolve(collectionsDir, 'collectionAnalyzer.js')},
    {script: path.resolve(collectionsDir, 'collectionStatsProcess.js')},
    {script: path.resolve(collectionsDir, 'leaderboardStatsProcess.js')},
    {script: path.resolve(projectRoot, 'src/projects/lockStatistics/lockStats.js')},
    {script: path.resolve(collectionsDir, 'raflCollectionUtils.js')},
    {script: path.resolve(projectRoot, 'src/projects/redditBelts/runGetRedditBelts.js')},
    {script: path.resolve(collectionsDir, 'discordBeltCountsDownload.js')},
    {script: path.resolve(collectionsDir, 'exportAllProcessor.js')}
]

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
    writeOutput = console.log
} = {}) {
    const {environment, envPath, childEnv} = loadRunnerEnvironment({env, loadEnvironment})
    const runnerArgs = argv.includes('cron') ? ['cron'] : []
    const cronRun = runnerArgs.length > 0
    if (!cronRun) {
        writeOutput(`Running collection export and analysis for ${environment}`)
        writeOutput(`Loaded configuration from ${envPath}`)
    }

    for (const job of jobs) {
        if (!cronRun) writeOutput(`\nRunning ${path.relative(projectRoot, job.script)}`)
        await runJobFn(job, childEnv, runnerArgs)
    }
}

if (isDirectRun(import.meta.url)) {
    runCollectionExportAnalysis().catch(error => {
        console.error(error.message)
        process.exitCode = 1
    })
}
