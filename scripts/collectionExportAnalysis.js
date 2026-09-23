#!/usr/bin/env node

import {spawn} from 'node:child_process'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import dotenv from 'dotenv'

const validEnvironments = new Set(['local', 'development', 'production'])
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const collectionsDir = path.resolve(projectRoot, 'src/projects/collections')

const jobs = [
    {script: path.resolve(collectionsDir, 'collectionsExport.js'), args: ['cron']},
    {script: path.resolve(collectionsDir, 'awardsEvidenceExport.js'), args: ['cron']},
    {script: path.resolve(collectionsDir, 'collectionAnalyzer.js')},
    {script: path.resolve(collectionsDir, 'collectionStatsProcess.js')},
    {script: path.resolve(collectionsDir, 'leaderboardStatsProcess.js')},
    {script: path.resolve(projectRoot, 'src/projects/lockStatistics/lockStats.js')},
    {script: path.resolve(collectionsDir, 'raflCollectionUtils.js')},
    {script: path.resolve(projectRoot, 'src/projects/redditBelts/runGetRedditBelts.js')},
    {script: path.resolve(collectionsDir, 'exportAllProcessor.js')}
]

function loadEnvironment(env = process.env) {
    const environment = env.NODE_ENV?.trim()
    if (!environment) {
        throw new Error('NODE_ENV is required (local, development, or production)')
    }
    if (!validEnvironments.has(environment)) {
        throw new Error(`Unsupported NODE_ENV: ${environment}`)
    }

    const envPath = path.resolve(collectionsDir, `.env.${environment}`)
    const childEnv = {...env}
    const result = dotenv.config({
        path: envPath,
        processEnv: childEnv,
        override: true,
        quiet: true
    })
    if (result.error) {
        throw new Error(`Unable to load environment file ${envPath}`, {cause: result.error})
    }

    childEnv.NODE_ENV = environment
    return {environment, envPath, childEnv}
}

function runJob(job, env = process.env) {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [job.script, ...(job.args ?? [])], {
            cwd: projectRoot,
            env,
            stdio: 'inherit'
        })

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

async function main() {
    const {environment, envPath, childEnv} = loadEnvironment()
    console.log(`Running collection export and analysis for ${environment}`)
    console.log(`Loaded configuration from ${envPath}`)

    for (const job of jobs) {
        console.log(`\nRunning ${path.relative(projectRoot, job.script)}`)
        await runJob(job, childEnv)
    }
}

main().catch(error => {
    console.error(error.message)
    process.exitCode = 1
})
