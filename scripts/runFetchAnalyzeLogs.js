#!/usr/bin/env node

import {spawn} from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import isDirectRun from '../src/util/isDirectRun.js'
import {loadRuntimeEnvironment} from '../src/util/runtimeEnvironment.js'
import {loadCatalogArray, loadCatalogDataConfig} from '../src/util/catalogData.js'
import {
    loadLogAnalysisConfig,
    logAnalysisConfigSummary
} from '../src/projects/logAnalysis/logAnalysisConfig.js'

const projectRoot = path.resolve(import.meta.dirname, '..')
const logAnalysisDir = path.join(projectRoot, 'src/projects/logAnalysis')
const pipelineLockName = '.fetch-analyze-logs.lock'

export const jobs = Object.freeze([
    {script: path.join(logAnalysisDir, 'ftpFetchGodaddy.js')},
    {script: path.join(logAnalysisDir, 'lpubeltsLogAnalyzer.js')},
    {script: path.join(logAnalysisDir, 'lpubeltsLogDataProcessor.js')}
])

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

export async function preflightLogAnalysisPipeline(env) {
    const config = loadLogAnalysisConfig(env)
    if (!config.ftp.enabled) {
        const error = new Error('FTP log refresh is disabled; set LOG_ANALYSIS_FTP_ENABLED=true')
        error.code = 'log_analysis_ftp_disabled'
        throw error
    }
    const catalogConfig = loadCatalogDataConfig(env)
    await loadCatalogArray('data.json', {config: catalogConfig})
    await Promise.all([
        fs.mkdir(config.logsDir, {recursive: true}),
        fs.mkdir(config.dailyDataDir, {recursive: true}),
        fs.mkdir(config.outputDir, {recursive: true})
    ])
    return Object.freeze({config, catalogConfig})
}

export async function acquirePipelineLock(dailyDataDir) {
    const lockDir = path.join(dailyDataDir, pipelineLockName)
    await fs.mkdir(dailyDataDir, {recursive: true})
    try {
        await fs.mkdir(lockDir)
    } catch (error) {
        if (error.code === 'EEXIST') {
            const lockError = new Error(`Log fetch and analysis is already running: ${lockDir}`)
            lockError.code = 'log_analysis_pipeline_locked'
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

export function runJob(job, env = process.env, runnerArgs = []) {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [job.script, ...runnerArgs], {
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

export async function runFetchAnalyzeLogs({
    env = process.env,
    argv = process.argv,
    loadEnvironment,
    runJobFn = runJob,
    preflightFn = preflightLogAnalysisPipeline,
    acquireLockFn = acquirePipelineLock,
    writeOutput = console.log
} = {}) {
    const {environment, envPath, childEnv} = loadRunnerEnvironment({env, loadEnvironment})
    const config = loadLogAnalysisConfig(childEnv)
    const catalogConfig = loadCatalogDataConfig(childEnv)
    const summary = {
        ...logAnalysisConfigSummary(config),
        catalog: catalogConfig,
        jobs: jobs.map(job => path.relative(projectRoot, job.script))
    }
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const preflight = await preflightFn(childEnv)
    const releaseLock = await acquireLockFn(preflight.config.dailyDataDir)
    const runnerArgs = argv.includes('cron') ? ['cron'] : []
    const cronRun = runnerArgs.length > 0
    if (!cronRun) {
        writeOutput(`Running log fetch and analysis for ${environment}`)
        writeOutput(`Loaded configuration from ${envPath}`)
    }

    try {
        for (const job of jobs) {
            if (!cronRun) writeOutput(`\nRunning ${path.relative(projectRoot, job.script)}`)
            await runJobFn(job, childEnv, runnerArgs)
        }
    } finally {
        await releaseLock()
    }
}

if (isDirectRun(import.meta.url)) {
    runFetchAnalyzeLogs().catch(error => {
        console.error(error.message)
        process.exitCode = 1
    })
}
