import fs from 'node:fs/promises'
import path from 'node:path'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore, Timestamp} from 'firebase-admin/firestore'
import {setDeep} from '../../util/setDeep.js'

import {localUser, prodUser} from '../../../keys/users.js'
import dayjs from 'dayjs'
import {logFirebaseActivity} from '../logFirebaseActivity/logFirebaseActivity.js'
import {pathToFileURL} from 'url'
import postFirebaseActivity from '../../util/postFirebaseActivity.js'

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
const isCron = !!process.argv[2] && process.argv[2] === 'cron'
const production = process.env.USER !== localUser

const keysDir = production
    ? `/home/${prodUser}/explore-lpubelts-com-node/keys`
    : `/Users/${localUser}/Documents/GitHub/explore-lpubelts-com-node/keys`

const serviceAccount = JSON.parse(await fs.readFile(`${keysDir}/service-account.json`, 'utf8'))

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)
const dbProd = getFirestore(firebaseApp)

const backupDir = production
    ? `/home/${prodUser}/firebase`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`

const exportDir = production
    ? `/home/${prodUser}/collectionExports`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/collectionExports`

const collectionName = 'lockcollections'
const changeIndexCollectionName = 'lockcollectionsChangeIndex'
const exportFile = `${exportDir}/${collectionName}.json`
const exportStateFile = `${exportDir}/${collectionName}.exportState.json`
const lookbackMs = Number(process.env.COLLECTIONS_EXPORT_LOOKBACK_MS ?? 5 * 60 * 1000)
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

function timestampMinusLookback(value) {
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

async function logReadActivity(messages) {
    try {
        if (isDirectRun || isCron) await postFirebaseActivity({activityData: messages})
        else await logFirebaseActivity(messages)
    } catch (err) {
        console.log('Logging Error', err)
    }
}

async function getChangedUsersSince(watermark, processedChangeKeys) {
    const lowerBound = timestampMinusLookback(watermark)
    const changes = await dbProd
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

        const userId = change.userId ?? changeDoc.id
        const key = changeKey(userId, changedAt)
        observedChanges.push({userId, changedAt, key})

        if (!processedChangeKeys.has(key) || compareTimestamps(changedAt, watermark) > 0) {
            changedUserIds.add(userId)
        }
        maxChangedAt = maxTimestamp(maxChangedAt, changedAt)
    })

    const nextLowerBound = timestampMinusLookback(maxChangedAt)
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

async function fetchLockcollectionDocs(userIds) {
    const docs = []
    for (let idx = 0; idx < userIds.length; idx += getAllChunkSize) {
        const chunk = userIds.slice(idx, idx + getAllChunkSize)
        const refs = chunk.map(userId => dbProd.collection(collectionName).doc(userId))
        docs.push(...await dbProd.getAll(...refs))
    }
    return docs
}

async function getExistingOrBootstrapData() {
    const previousExport = await readJsonFile(exportFile)
    if (Array.isArray(previousExport?.data)) {
        return {
            data: previousExport.data,
            bootstrapped: false,
            bootstrapReadCount: 0
        }
    }

    const lockcollections = await dbProd.collection(collectionName).get()
    return {
        data: lockcollections.docs.map(doc => ({docId: doc.id, ...doc.data()})),
        bootstrapped: true,
        bootstrapReadCount: lockcollections.docs.length
    }
}

async function writeExportFiles(data, metadata) {
    const fullDb = exportDataToFullDb(data)
    const backupArchiveFile = `${backupDir}/archive/backup.json`
    const backupDailyFile = `${backupDir}/archive/backup_${dayjs().format('YYYY-MM-DD')}.json`

    await writeJsonFileAtomic(`${backupDir}/backup.json`, fullDb)
    await writeJsonFileAtomic(backupArchiveFile, fullDb)
    await writeJsonFileAtomic(backupDailyFile, fullDb)
    await writeJsonFileAtomic(exportFile, {metadata, data})

    return fullDb
}

async function getIncrementalData() {
    const state = await readJsonFile(exportStateFile, {})
    const previousWatermark = timestampFromState(state.lastSuccessfulExportChangedAt)
    const processedChangeKeys = new Set(state.processedChangeKeys ?? [])
    const existing = await getExistingOrBootstrapData()
    const userMap = exportDataToUserMap(existing)
    const changed = await getChangedUsersSince(previousWatermark, processedChangeKeys)
    const changedDocs = await fetchLockcollectionDocs(changed.changedUserIds)
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
        date: new Date().toISOString(),
        docCount: data.length,
        incremental: true,
        bootstrapped: existing.bootstrapped,
        changedDocCount: changed.changedUserIds.length,
        deletedDocCount: deletedDocIds.length,
        changeIndexReadCount: changed.changeIndexReadCount,
        lockcollectionReadCount: existing.bootstrapReadCount + changedDocs.length,
        previousWatermark: timestampForState(previousWatermark),
        newWatermark: timestampForState(changed.maxChangedAt),
        lookbackMs
    }

    const fullDb = await writeExportFiles(data, metadata)

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
            trigger: isCron ? 'cronjob' : 'manual'
        },
        {
            type: 'READ',
            count: existing.bootstrapReadCount + changedDocs.length,
            source: 'collectionsExport_lockcollections',
            id: '',
            trigger: isCron ? 'cronjob' : 'manual'
        }
    ])

    !isCron && console.log('Incremental collection export complete', metadata)

    return fullDb
}

await getIncrementalData().then()
