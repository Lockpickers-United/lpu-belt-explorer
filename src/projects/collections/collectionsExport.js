import fs from 'node:fs/promises'
import path from 'node:path'
import {Timestamp} from 'firebase-admin/firestore'
import {setDeep} from '../../util/setDeep.js'
import dayjs from 'dayjs'
import isDirectRun from '../../util/isDirectRun.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'
import {getExportFirestore} from './exportFirebase.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'

const collectionName = 'lockcollections'
const changeIndexCollectionName = 'lockcollectionsChangeIndex'
const getAllChunkSize = 300

async function readJsonFile(filePath, fallback = null) {
    try {
        return JSON.parse(await fs.readFile(filePath, 'utf8'))
    } catch (err) {
        if (err.code === 'ENOENT') {
            return fallback
        }
        throw err
    }
}

async function ensureWriteDir(filePath) {
    await fs.mkdir(path.dirname(filePath), {recursive: true})
}

async function writeJsonFileAtomic(filePath, data) {
    await ensureWriteDir(filePath)
    const tempFile = `${filePath}.tmp-${process.pid}-${Date.now()}`
    await fs.writeFile(tempFile, JSON.stringify(data))
    await fs.rename(tempFile, filePath)
}

function timestampFromState(value) {
    if (!value) return null
    if (Number.isInteger(value.seconds)) {
        return new Timestamp(value.seconds, value.nanoseconds ?? 0)
    }
    if (value.iso) {
        return Timestamp.fromDate(new Date(value.iso))
    }
    return null
}

function timestampForState(value) {
    if (!value) return null
    return {
        seconds: value.seconds,
        nanoseconds: value.nanoseconds,
        iso: value.toDate().toISOString()
    }
}

function maxTimestamp(a, b) {
    if (!a) return b
    if (!b) return a
    if (b.seconds > a.seconds) return b
    if (b.seconds === a.seconds && b.nanoseconds > a.nanoseconds) return b
    return a
}

function compareTimestamps(a, b) {
    if (!a && !b) return 0
    if (!a) return -1
    if (!b) return 1
    if (a.seconds !== b.seconds) return a.seconds - b.seconds
    return a.nanoseconds - b.nanoseconds
}

function timestampMinusLookback(value, lookbackMs) {
    if (!value) return Timestamp.fromMillis(0)
    return Timestamp.fromMillis(Math.max(0, value.toMillis() - lookbackMs))
}

function changeKey(userId, changedAt) {
    return `${userId}:${changedAt.seconds}:${changedAt.nanoseconds}`
}

function exportDataToUserMap(exportData) {
    return new Map((exportData?.data ?? []).map(user => [user.docId, user]))
}

function userMapToExportData(userMap) {
    return [...userMap.values()].sort((a, b) => a.docId.localeCompare(b.docId))
}

function exportDataToFullDb(data) {
    const fullDb = {}
    data.forEach(user => {
        const {docId, ...userData} = user
        setDeep(fullDb, ['__collections__', collectionName, docId], userData)
    })
    return fullDb
}

async function logReadActivity(messages, activityLogger) {
    try {
        await activityLogger(messages)
    } catch (err) {
        console.error('Logging Error', err)
    }
}

async function getChangedUsersSince({db, watermark, processedChangeKeys, lookbackMs}) {
    const lowerBound = timestampMinusLookback(watermark, lookbackMs)
    const changes = await db
        .collection(changeIndexCollectionName)
        .where('changedAt', '>', lowerBound)
        .orderBy('changedAt')
        .get()

    const changedUserIds = new Set()
    const observedChanges = []
    let maxChangedAt = watermark

    changes.docs.forEach(changeDoc => {
        const change = changeDoc.data()
        const changedAt = change.changedAt
        if (!changedAt || typeof changedAt.toMillis !== 'function') return

        const userId = change.docId ?? change.userId ?? changeDoc.id
        const key = changeKey(userId, changedAt)
        observedChanges.push({userId, changedAt, key})

        if (!processedChangeKeys.has(key) || compareTimestamps(changedAt, watermark) > 0) {
            changedUserIds.add(userId)
        }
        maxChangedAt = maxTimestamp(maxChangedAt, changedAt)
    })

    const nextLowerBound = timestampMinusLookback(maxChangedAt, lookbackMs)
    const nextProcessedChangeKeys = observedChanges
        .filter(change => compareTimestamps(change.changedAt, nextLowerBound) > 0)
        .map(change => change.key)

    return {
        changedUserIds: [...changedUserIds],
        changeIndexReadCount: changes.docs.length,
        maxChangedAt,
        processedChangeKeys: nextProcessedChangeKeys
    }
}

async function fetchLockcollectionDocs(db, userIds) {
    const docs = []
    for (let idx = 0; idx < userIds.length; idx += getAllChunkSize) {
        const chunk = userIds.slice(idx, idx + getAllChunkSize)
        const refs = chunk.map(userId => db.collection(collectionName).doc(userId))
        docs.push(...await db.getAll(...refs))
    }
    return docs
}

async function getExistingOrBootstrapData({db, exportFile, fullExport}) {
    if (!fullExport) {
        const previousExport = await readJsonFile(exportFile)
        if (Array.isArray(previousExport?.data)) {
            return {
                data: previousExport.data,
                bootstrapped: false,
                bootstrapReadCount: 0
            }
        }
    }

    const lockcollections = await db.collection(collectionName).get()
    return {
        data: lockcollections.docs.map(doc => ({docId: doc.id, ...doc.data()})),
        bootstrapped: true,
        bootstrapReadCount: lockcollections.docs.length
    }
}

async function writeExportFiles({data, metadata, backupDir, exportFile, runDate}) {
    const fullDb = exportDataToFullDb(data)
    const backupArchiveFile = `${backupDir}/archive/backup.json`
    const backupDailyFile = `${backupDir}/archive/backup_${dayjs(runDate).format('YYYY-MM-DD')}.json`

    await writeJsonFileAtomic(`${backupDir}/backup.json`, fullDb)
    await writeJsonFileAtomic(backupArchiveFile, fullDb)
    await writeJsonFileAtomic(backupDailyFile, fullDb)
    await writeJsonFileAtomic(exportFile, {metadata, data})

    return fullDb
}

export async function runCollectionsExport({
    db,
    backupDir,
    exportDir,
    lookbackMs,
    trigger = 'manual',
    activityLogger = async () => {},
    now = () => new Date(),
    fullExport = false
}) {
    const exportFile = `${exportDir}/${collectionName}.json`
    const exportStateFile = `${exportDir}/${collectionName}.exportState.json`
    const runDate = now()
    const state = await readJsonFile(exportStateFile, {})
    const previousWatermark = timestampFromState(state.lastSuccessfulExportChangedAt)
    const queryWatermark = fullExport ? Timestamp.fromDate(runDate) : previousWatermark
    const processedChangeKeys = new Set(state.processedChangeKeys ?? [])
    const existing = await getExistingOrBootstrapData({db, exportFile, fullExport})
    const userMap = exportDataToUserMap(existing)
    const changed = await getChangedUsersSince({
        db,
        watermark: queryWatermark,
        processedChangeKeys,
        lookbackMs
    })
    const changedDocs = await fetchLockcollectionDocs(db, changed.changedUserIds)
    const deletedDocIds = []

    changedDocs.forEach(doc => {
        if (doc.exists) {
            userMap.set(doc.id, {docId: doc.id, ...doc.data()})
        } else {
            userMap.delete(doc.id)
            deletedDocIds.push(doc.id)
        }
    })

    const data = userMapToExportData(userMap)
    const metadata = {
        collection: collectionName,
        date: runDate.toISOString(),
        docCount: data.length,
        incremental: !fullExport,
        fullExport,
        bootstrapped: existing.bootstrapped,
        changedDocCount: changed.changedUserIds.length,
        deletedDocCount: deletedDocIds.length,
        changeIndexReadCount: changed.changeIndexReadCount,
        lockcollectionReadCount: existing.bootstrapReadCount + changedDocs.length,
        previousWatermark: timestampForState(previousWatermark),
        queryWatermark: timestampForState(queryWatermark),
        newWatermark: timestampForState(changed.maxChangedAt),
        lookbackMs
    }

    const fullDb = await writeExportFiles({data, metadata, backupDir, exportFile, runDate})

    if (changed.maxChangedAt) {
        await writeJsonFileAtomic(exportStateFile, {
            collection: collectionName,
            changeIndexCollection: changeIndexCollectionName,
            lastSuccessfulExportChangedAt: timestampForState(changed.maxChangedAt),
            lastExportedAt: metadata.date,
            processedChangeKeys: changed.processedChangeKeys,
            lastRun: metadata
        })
    }

    await logReadActivity([
        {
            type: 'READ',
            count: changed.changeIndexReadCount,
            source: 'collectionsExport_lockcollectionsChangeIndex',
            id: '',
            trigger
        },
        {
            type: 'READ',
            count: existing.bootstrapReadCount + changedDocs.length,
            source: 'collectionsExport_lockcollections',
            id: '',
            trigger
        }
    ], activityLogger)

    if (trigger !== 'cronjob') {
        console.log(fullExport ? 'Full collection baseline export complete' : 'Incremental collection export complete', metadata)
    }

    return fullDb
}

export async function collectionsExportMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment
} = {}) {
    loadCollectionEnvironment({env, loadEnvironment})

    const config = loadExportJobConfig({env})
    const summary = exportJobConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const db = await getExportFirestore(config)
    const {default: postFirebaseActivity} = await import('../../util/postFirebaseActivity.js')
    const trigger = argv.includes('cron') ? 'cronjob' : 'manual'
    const fullExport = argv.includes('--full')
    return runCollectionsExport({
        db,
        backupDir: config.backupDir,
        exportDir: config.exportDir,
        lookbackMs: config.lookbackMs,
        trigger,
        fullExport,
        activityLogger: messages => postFirebaseActivity({activityData: messages})
    })
}

if (isDirectRun(import.meta.url)) {
    await collectionsExportMain()
}
