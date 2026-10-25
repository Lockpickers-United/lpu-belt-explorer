import fs from 'node:fs/promises'
import path from 'node:path'
import {randomUUID} from 'node:crypto'
import {parse} from 'csv-parse/sync'
import fetch from 'node-fetch'
import {
    raflSchema,
    raflCharitySchema,
    raflMediaSchema
} from './importSchemas.js'
import {logger} from '../../logger/logger.js'

const log = logger.child({module: 'rafl-preview-import'})
const maxCsvBytes = 5 * 1024 * 1024
const outputFilenames = Object.freeze({
    pots: 'raflPreviewPots.json',
    charities: 'raflPreviewCharities.json',
    version: 'raflPreviewVersion.json'
})

function importError(code, message, status = 500, cause) {
    const error = new Error(message)
    error.code = code
    error.status = status
    if (cause) error.cause = cause
    return error
}

function splitCommaValues(value) {
    if (!value) return []
    return value.replace(/\s+,|,\s+/g, ',').split(',').filter(Boolean)
}

function parseCurrency(value) {
    return parseInt(String(value ?? '').replace(/[^0-9]/g, '')) || 0
}

function createSheetUrl(sheetId, tab) {
    const url = new URL(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`)
    url.searchParams.set('tqx', 'out:csv')
    url.searchParams.set('sheet', tab)
    url.searchParams.set('headers', '1')
    return url
}

async function fetchSheetData({sheetId, tab, schema, fetchImpl, parseCsv, timeoutMs, jobLogger}) {
    jobLogger.info({tab}, 'fetching RAFL preview sheet')
    let response
    try {
        response = await fetchImpl(createSheetUrl(sheetId, tab), {
            signal: AbortSignal.timeout(timeoutMs)
        })
    } catch (cause) {
        throw importError('rafl_preview_fetch_failed', `Unable to fetch RAFL sheet: ${tab}`, 502, cause)
    }

    if (!response.ok) {
        throw importError(
            'rafl_preview_fetch_failed',
            `Unable to fetch RAFL sheet ${tab}: HTTP ${response.status}`,
            502
        )
    }

    const csv = await response.text()
    if (Buffer.byteLength(csv, 'utf8') > maxCsvBytes) {
        throw importError('rafl_preview_sheet_too_large', `RAFL sheet is too large: ${tab}`, 502)
    }

    let data
    try {
        data = parseCsv(csv, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        })
    } catch (cause) {
        throw importError('rafl_preview_parse_failed', `Unable to parse RAFL sheet: ${tab}`, 502, cause)
    }

    const validation = schema.validate(data, {abortEarly: false})
    return {
        data,
        validationError: validation.error
            ? {sheet: tab, 'Invalid data found in sheet': validation.error.details}
            : null
    }
}

function transformPots(raflData, raflMediaData) {
    const errors = []
    const pots = raflData.map(datum => ({
        id: datum['Unique ID'],
        year: +datum['Year'],
        potNumber: parseInt(datum['Pot Number']),
        title: datum['Title'],
        winnerCount: parseInt(datum['Winner Count']) || 1,
        displayName: datum['Display Name'],
        description: datum['Description'],
        descriptionContinued: datum['Description Continued'],
        potContents: datum['Pot Contents'],
        keywords: datum['Keywords'],
        contributedBy: splitCommaValues(datum['Contributed By']),
        tags: splitCommaValues(datum['Tags']),
        country: splitCommaValues(datum['Country']),
        shippingInfo: datum['Shipping Info Text'],
        splitShipping: datum['Split Shipping'] === 'TRUE' ? 'shippingNotSplit' : 'shippingSplit',
        splitShippingBoolean: datum['Split Shipping'] === 'TRUE',
        shippingType: datum['Shipping Type'],
        shipsToUS: datum['Ships To US'],
        dateAdded: datum['Date Added']
    }))

    const sortedMedia = [...raflMediaData]
    sortedMedia
        .sort((a, b) => Number(a['Sequence ID']) - Number(b['Sequence ID']))
        .forEach(item => {
            const entry = pots.find(pot => pot?.id === item['Unique ID'])
            if (!entry) {
                errors.push({
                    sheet: 'RAFL Media',
                    message: 'Entry not found while processing media',
                    uniqueId: item['Unique ID']
                })
                return
            }

            if (!entry.media) entry.media = []
            const media = {
                title: item.Title,
                subtitle: item.Subtitle,
                thumbnailUrl: item['Thumbnail URL'],
                fullUrl: item['Full URL']
            }
            if (item['Subtitle URL']) media.subtitleUrl = item['Subtitle URL']
            if (item['Full Image Direct URL']) media.fullSizeUrl = item['Full Image Direct URL']
            entry.media.push(media)
        })

    return {pots, errors}
}

function transformCharities(raflCharityData) {
    return raflCharityData.map(datum => ({
        id: datum['Unique ID'],
        name: datum['Charity Name'],
        url: datum.URL,
        donations2024: parseCurrency(datum['Donations 2024'] ?? datum['Total Donations 2024'])
    }))
}

async function removeStagedFiles(fileSystem, stagedFiles) {
    await Promise.allSettled(stagedFiles.map(file => fileSystem.rm(file, {force: true})))
}

async function publishPreviewFiles({outputDir, pots, charities, version, fileSystem}) {
    const suffix = `.tmp-${process.pid}-${randomUUID()}`
    const files = [
        {name: outputFilenames.pots, data: pots},
        {name: outputFilenames.charities, data: charities},
        {name: outputFilenames.version, data: version}
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

        // The version file is the publication marker and is replaced only after both data files.
        for (const file of files) {
            await fileSystem.rename(file.staged, file.destination)
        }
    } finally {
        await removeStagedFiles(fileSystem, files.map(file => file.staged))
    }
}

export async function runRaflDataImport({
    sheetId,
    outputDir,
    timeoutMs = 15_000,
    fetchImpl = fetch,
    parseCsv = parse,
    schemas = {
        rafl: raflSchema,
        media: raflMediaSchema,
        charities: raflCharitySchema
    },
    fileSystem = fs,
    now = () => new Date(),
    jobLogger = log
}) {
    if (!sheetId) throw importError('rafl_preview_sheet_id_missing', 'RAFL sheet ID is required')
    if (!outputDir || !path.isAbsolute(outputDir)) {
        throw importError('rafl_preview_output_invalid', 'RAFL preview output directory must be absolute')
    }

    const sheetResults = await Promise.all([
        fetchSheetData({
            sheetId,
            tab: 'RAFL',
            schema: schemas.rafl,
            fetchImpl,
            parseCsv,
            timeoutMs,
            jobLogger
        }),
        fetchSheetData({
            sheetId,
            tab: 'RAFL Media',
            schema: schemas.media,
            fetchImpl,
            parseCsv,
            timeoutMs,
            jobLogger
        }),
        fetchSheetData({
            sheetId,
            tab: 'RAFL Charities',
            schema: schemas.charities,
            fetchImpl,
            parseCsv,
            timeoutMs,
            jobLogger
        })
    ])
    const validationErrors = sheetResults.map(result => result.validationError).filter(Boolean)
    if (validationErrors.length > 0) {
        return {status: 'Errors', errors: validationErrors}
    }

    const [raflData, raflMediaData, raflCharityData] = sheetResults.map(result => result.data)
    const {pots, errors: transformationErrors} = transformPots(raflData, raflMediaData)
    if (transformationErrors.length > 0) {
        return {status: 'Errors', errors: transformationErrors}
    }
    const charities = transformCharities(raflCharityData)
    const version = {version: now()}

    await fileSystem.mkdir(outputDir, {recursive: true})
    await publishPreviewFiles({outputDir, pots, charities, version, fileSystem})
    jobLogger.info({potCount: pots.length, charityCount: charities.length}, 'RAFL preview published')
    return {status: 'All Good!'}
}

export function createImportRaflDataHandler({
    runImport = runRaflDataImport,
    runtimeEnvironment = 'local',
    ...runOptions
}) {
    let inFlight

    return async function importRaflData(req, res) {
        try {
            if (!inFlight) {
                const currentRun = Promise.resolve().then(() => runImport(runOptions))
                inFlight = currentRun
                currentRun.then(() => {
                    if (inFlight === currentRun) inFlight = undefined
                }, () => {
                    if (inFlight === currentRun) inFlight = undefined
                })
            }
            const result = await inFlight
            log.info({requestId: req.id, status: result.status}, 'RAFL preview refresh completed')
            return res.status(200).json(result)
        } catch (error) {
            log.error({err: error, requestId: req.id}, 'RAFL preview refresh failed')
            if (res.headersSent) return
            const status = typeof error?.status === 'number' ? error.status : 500
            return res.status(status).json({
                status: 'Errors',
                errors: [{
                    code: error?.code,
                    message: error?.message || 'RAFL preview refresh failed',
                    stack: runtimeEnvironment !== 'production' ? error?.stack : undefined
                }]
            })
        }
    }
}

export default async function importRaflData(req, res) {
    const {getDefaultImportRaflDataHandler} = await import('./importRaflDataRuntime.js')
    return (await getDefaultImportRaflDataHandler())(req, res)
}
