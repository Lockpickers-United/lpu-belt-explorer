import {execFile} from 'node:child_process'
import {randomUUID} from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import {promisify} from 'node:util'
import {logger} from '../../logger/logger.js'

const execFileAsync = promisify(execFile)
const log = logger.child({module: 'reddit-belts-refresh'})
const outputFilenames = Object.freeze({
    userFlairs: 'redditUserFlairs.json',
    beltCounts: 'redditBeltCounts.json'
})

function refreshError(code, message, status = 500, cause) {
    const error = new Error(message)
    error.code = code
    error.status = status
    if (cause) error.cause = cause
    return error
}

function validateFlairs(flairs) {
    if (!Array.isArray(flairs)) {
        throw refreshError('reddit_flairs_invalid', 'Reddit flair output must be an array', 502)
    }

    flairs.forEach((flair, index) => {
        if (!flair || typeof flair.user !== 'string' || typeof flair.flair_text !== 'string') {
            throw refreshError(
                'reddit_flairs_invalid',
                `Reddit flair output contains an invalid entry at index ${index}`,
                502
            )
        }
    })

    return flairs
}

function extractBeltName(flairText) {
    return flairText.match(/^.*?Belt/)?.[0] ?? null
}

export function transformRedditFlairs(flairs) {
    const validatedFlairs = validateFlairs(flairs)
    const beltCounts = new Map()
    const redditUserFlairs = new Map()

    validatedFlairs.forEach(({user, flair_text: flairText}) => {
        const beltName = extractBeltName(flairText)
        const countName = beltName === 'Legendary Black Belt' ? 'Black Belt' : beltName
        if (countName) beltCounts.set(countName, (beltCounts.get(countName) || 0) + 1)
        redditUserFlairs.set(user, beltName)
    })

    return {
        beltCounts: Object.fromEntries(beltCounts),
        redditUserFlairs: Object.fromEntries(redditUserFlairs)
    }
}

async function removeStagedFiles(fileSystem, filenames) {
    await Promise.allSettled(filenames.map(filename => fileSystem.rm(filename, {force: true})))
}

async function publishRedditFiles({outputDir, beltCounts, redditUserFlairs, fileSystem}) {
    const suffix = `.tmp-${process.pid}-${randomUUID()}`
    const files = [
        {name: outputFilenames.userFlairs, data: redditUserFlairs},
        {name: outputFilenames.beltCounts, data: beltCounts}
    ].map(file => ({
        ...file,
        destination: path.join(outputDir, file.name),
        staged: path.join(outputDir, `${file.name}${suffix}`)
    }))

    try {
        const writeResults = await Promise.allSettled(files.map(file => {
            return fileSystem.writeFile(file.staged, JSON.stringify(file.data, null, 2), 'utf8')
        }))
        const writeFailure = writeResults.find(result => result.status === 'rejected')
        if (writeFailure) throw writeFailure.reason

        for (const file of files) {
            await fileSystem.rename(file.staged, file.destination)
        }
    } finally {
        await removeStagedFiles(fileSystem, files.map(file => file.staged))
    }
}

export async function runRedditBeltsRefresh({
    scriptPath,
    credentialsPath,
    outputDir,
    pythonExecutable = 'python3',
    timeoutMs = 120_000,
    maxOutputBytes = 10 * 1024 * 1024,
    executeFile = execFileAsync,
    fileSystem = fs,
    jobLogger = log
}) {
    if (!scriptPath || !path.isAbsolute(scriptPath)) {
        throw refreshError('reddit_belts_script_invalid', 'Reddit flair script path must be absolute')
    }
    if (!credentialsPath || !path.isAbsolute(credentialsPath)) {
        throw refreshError('reddit_belts_credentials_invalid', 'Reddit credentials path must be absolute')
    }
    if (!outputDir || !path.isAbsolute(outputDir)) {
        throw refreshError('reddit_belts_output_invalid', 'Reddit belt output directory must be absolute')
    }

    jobLogger.info('fetching Reddit flair data')
    let stdout
    try {
        const result = await executeFile(
            pythonExecutable,
            [scriptPath, credentialsPath],
            {encoding: 'utf8', timeout: timeoutMs, maxBuffer: maxOutputBytes}
        )
        stdout = result.stdout
    } catch (cause) {
        throw refreshError('reddit_flairs_fetch_failed', 'Unable to fetch Reddit flair data', 502, cause)
    }

    let flairs
    try {
        flairs = JSON.parse(stdout)
    } catch (cause) {
        throw refreshError('reddit_flairs_parse_failed', 'Unable to parse Reddit flair output', 502, cause)
    }

    const {beltCounts, redditUserFlairs} = transformRedditFlairs(flairs)
    await fileSystem.mkdir(outputDir, {recursive: true})
    await publishRedditFiles({outputDir, beltCounts, redditUserFlairs, fileSystem})
    jobLogger.info({flairCount: flairs.length}, 'Reddit flair data published')

    return {beltCounts, flairCount: flairs.length}
}

export function createGetRedditBeltsHandler({
    runRefresh = runRedditBeltsRefresh,
    runtimeEnvironment = 'local',
    ...runOptions
}) {
    let inFlight

    return async function getRedditBelts(req, res) {
        try {
            if (!inFlight) {
                const currentRun = Promise.resolve().then(() => runRefresh(runOptions))
                inFlight = currentRun
                currentRun.then(() => {
                    if (inFlight === currentRun) inFlight = undefined
                }, () => {
                    if (inFlight === currentRun) inFlight = undefined
                })
            }

            const result = await inFlight
            log.info({requestId: req.id, flairCount: result.flairCount}, 'Reddit belt refresh completed')
            return res.status(200).json({
                message: 'Reddit flair data fetched and saved',
                data: result.beltCounts
            })
        } catch (error) {
            log.error({err: error, requestId: req.id}, 'Reddit belt refresh failed')
            if (res.headersSent) return
            const status = typeof error?.status === 'number' ? error.status : 500
            return res.status(status).json({
                status,
                code: error?.code,
                message: error?.message || 'Reddit belt refresh failed',
                stack: runtimeEnvironment !== 'production' ? error?.stack : undefined
            })
        }
    }
}

export default async function getRedditBelts(req, res) {
    const {getDefaultRedditBeltsHandler} = await import('./redditBeltsRuntime.js')
    return (await getDefaultRedditBeltsHandler())(req, res)
}
