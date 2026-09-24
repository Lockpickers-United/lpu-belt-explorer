#!/usr/bin/env node

import {randomUUID} from 'node:crypto'
import {createReadStream, createWriteStream} from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import {pipeline} from 'node:stream/promises'
import {createGunzip} from 'node:zlib'
import {Client} from 'basic-ftp'
import isDirectRun from '../../util/isDirectRun.js'
import {loadRuntimeEnvironment} from '../../util/runtimeEnvironment.js'
import {loadLogAnalysisConfig, logAnalysisConfigSummary} from './logAnalysisConfig.js'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthName(date) {
    return `${months[date.getMonth()]}-${date.getFullYear()}`
}

export async function fetchGodaddyLog({
    logsDir,
    ftpConfig,
    now = () => new Date(),
    clientFactory = () => new Client()
}) {
    const runDate = now()
    const currentMonth = monthName(runDate)
    const previousDate = new Date(runDate.getTime() - 24 * 60 * 60 * 1000)
    const previousMonth = monthName(previousDate)
    const filename = `images.lpubelts.com-ssl_log-${currentMonth}.gz`
    const compressedFile = path.join(logsDir, filename)
    const temporarySuffix = `${process.pid}-${randomUUID()}`
    const compressedTemp = `${compressedFile}.tmp-${temporarySuffix}`
    const outputFile = compressedFile.slice(0, -3)
    const outputTemp = `${outputFile}.tmp-${temporarySuffix}`
    const client = clientFactory()

    await fs.mkdir(logsDir, {recursive: true})
    try {
        await client.access({
            host: ftpConfig.host,
            port: ftpConfig.port,
            user: ftpConfig.user,
            password: ftpConfig.password,
            secure: ftpConfig.secure
        })
        await client.cd(ftpConfig.remoteDir)
        await client.downloadTo(compressedTemp, filename)
        await pipeline(
            createReadStream(compressedTemp),
            createGunzip(),
            createWriteStream(outputTemp, {flags: 'wx'})
        )
        await fs.rename(outputTemp, outputFile)
        if (previousMonth !== currentMonth) {
            await fs.rm(path.join(logsDir, `images.lpubelts.com-ssl_log-${previousMonth}`), {
                force: true
            })
        }
        return Object.freeze({filename, outputFile})
    } finally {
        client.close()
        await Promise.all([
            fs.rm(compressedTemp, {force: true}),
            fs.rm(outputTemp, {force: true})
        ])
    }
}

export async function ftpFetchGodaddyMain({
    env = process.env,
    argv = process.argv,
    loadEnvironment,
    writeOutput = console.log,
    clientFactory,
    now
} = {}) {
    loadRuntimeEnvironment({env, envDir: path.resolve(import.meta.dirname, '../../..'), loadEnvironment})
    const config = loadLogAnalysisConfig(env)
    const summary = logAnalysisConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }
    if (!config.ftp.enabled) {
        const error = new Error('FTP log refresh is disabled; set LOG_ANALYSIS_FTP_ENABLED=true')
        error.code = 'log_analysis_ftp_disabled'
        throw error
    }
    return fetchGodaddyLog({logsDir: config.logsDir, ftpConfig: config.ftp, clientFactory, now})
}

if (isDirectRun(import.meta.url)) {
    ftpFetchGodaddyMain().catch(error => {
        console.error(error.message)
        process.exitCode = 1
    })
}
