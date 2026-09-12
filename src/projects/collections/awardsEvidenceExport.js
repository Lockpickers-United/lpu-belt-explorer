import fs from 'node:fs/promises'
import path from 'node:path'
import {Timestamp} from 'firebase-admin/firestore'
import {setDeepPush} from '../../util/setDeep.js'
import dayjs from 'dayjs'
import {awardDetails, lockDetails, projectDetails, safelockDetails} from '../../util/getItemDetails.js'
import entryName from '../../util/entryName.js'
import isDirectRun from '../../util/isDirectRun.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'
import {getExportFirestore} from './exportFirebase.js'

const getAllChunkSize = 300

function getIncrementalCollections(exportDir) {
    return [
        {
            collection: 'awards',
            changeIndexCollection: 'awardsChangeIndex',
            exportFile: `${exportDir}/awards.json`,
            stateFile: `${exportDir}/awards.exportState.json`
        },
        {
            collection: 'evidence',
            changeIndexCollection: 'evidenceChangeIndex',
            exportFile: `${exportDir}/evidence.json`,
            stateFile: `${exportDir}/evidence.exportState.json`
        }
    ]
}

async function readJsonFile(filePath, fallback=null) {
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

function changeKey(docId, changedAt) {
    return `${docId}:${changedAt.seconds}:${changedAt.nanoseconds}`
}

function firestoreDateToDayjs(value) {
    if (!value) return null
    if (typeof value.toDate === 'function') {
        return dayjs(value.toDate())
    }
    if (Number.isInteger(value._seconds)) {
        return dayjs.unix(value._seconds)
    }
    if (Number.isInteger(value.seconds)) {
        return dayjs.unix(value.seconds)
    }
    return dayjs(value)
}

function exportDataToDocMap(exportData) {
    return new Map((exportData?.data ?? []).map(doc => [doc.docId, doc]))
}

function docMapToExportData(docMap) {
    return [...docMap.values()].sort((a, b) => a.docId.localeCompare(b.docId))
}

async function getChangedDocIdsSince({db, collectionConfig, watermark, processedChangeKeys, lookbackMs}) {
    const lowerBound = timestampMinusLookback(watermark, lookbackMs)
    const changes = await db
        .collection(collectionConfig.changeIndexCollection)
        .where('changedAt', '>', lowerBound)
        .orderBy('changedAt')
        .get()

    const changedDocIds = new Set()
    const observedChanges = []
    let maxChangedAt = watermark

    changes.docs.forEach(changeDoc => {
        const change = changeDoc.data()
        const changedAt = change.changedAt
        if (!changedAt || typeof changedAt.toMillis !== 'function') return

        const docId = change.docId ?? changeDoc.id
        const key = changeKey(docId, changedAt)
        observedChanges.push({docId, changedAt, key})

        if (!processedChangeKeys.has(key) || compareTimestamps(changedAt, watermark) > 0) {
            changedDocIds.add(docId)
        }
        maxChangedAt = maxTimestamp(maxChangedAt, changedAt)
    })

    const nextLowerBound = timestampMinusLookback(maxChangedAt, lookbackMs)
    const nextProcessedChangeKeys = observedChanges
        .filter(change => compareTimestamps(change.changedAt, nextLowerBound) > 0)
        .map(change => change.key)

    return {
        changedDocIds: [...changedDocIds],
        changeIndexReadCount: changes.docs.length,
        maxChangedAt,
        processedChangeKeys: nextProcessedChangeKeys
    }
}

async function fetchSourceDocs(db, collection, docIds) {
    const docs = []
    for (let idx = 0; idx < docIds.length; idx += getAllChunkSize) {
        const chunk = docIds.slice(idx, idx + getAllChunkSize)
        const refs = chunk.map(docId => db.collection(collection).doc(docId))
        docs.push(...await db.getAll(...refs))
    }
    return docs
}

async function getExistingOrBootstrapData(db, collectionConfig) {
    const previousExport = await readJsonFile(collectionConfig.exportFile)
    if (Array.isArray(previousExport?.data)) {
        return {
            data: previousExport.data,
            bootstrapped: false,
            bootstrapReadCount: 0
        }
    }

    const snapshot = await db.collection(collectionConfig.collection).get()
    return {
        data: snapshot.docs.map(doc => ({docId: doc.id, ...doc.data()})),
        bootstrapped: true,
        bootstrapReadCount: snapshot.docs.length
    }
}

async function prepareIncrementalCollection({db, collectionConfig, lookbackMs, runDate}) {
    const state = await readJsonFile(collectionConfig.stateFile, {})
    const previousWatermark = timestampFromState(state.lastSuccessfulExportChangedAt)
    const processedChangeKeys = new Set(state.processedChangeKeys ?? [])
    const existing = await getExistingOrBootstrapData(db, collectionConfig)
    const docMap = exportDataToDocMap(existing)
    const changed = await getChangedDocIdsSince({
        db,
        collectionConfig,
        watermark: previousWatermark,
        processedChangeKeys,
        lookbackMs
    })
    const changedDocs = await fetchSourceDocs(db, collectionConfig.collection, changed.changedDocIds)
    const deletedDocIds = []

    changedDocs.forEach(doc => {
        if (doc.exists) {
            docMap.set(doc.id, {docId: doc.id, ...doc.data()})
        } else {
            docMap.delete(doc.id)
            deletedDocIds.push(doc.id)
        }
    })

    const data = docMapToExportData(docMap)
    const metadata = {
        collection: collectionConfig.collection,
        date: runDate.toISOString(),
        docCount: data.length,
        incremental: true,
        bootstrapped: existing.bootstrapped,
        changedDocCount: changed.changedDocIds.length,
        deletedDocCount: deletedDocIds.length,
        changeIndexReadCount: changed.changeIndexReadCount,
        sourceReadCount: existing.bootstrapReadCount + changedDocs.length,
        previousWatermark: timestampForState(previousWatermark),
        newWatermark: timestampForState(changed.maxChangedAt),
        lookbackMs
    }

    const stateData = changed.maxChangedAt
        ? {
            collection: collectionConfig.collection,
            changeIndexCollection: collectionConfig.changeIndexCollection,
            lastSuccessfulExportChangedAt: timestampForState(changed.maxChangedAt),
            lastExportedAt: metadata.date,
            processedChangeKeys: changed.processedChangeKeys,
            lastRun: metadata
        }
        : null

    return {
        ...collectionConfig,
        data,
        metadata,
        stateData
    }
}

async function logActivity(messages, activityLogger) {
    try {
        await activityLogger(messages)
    } catch (err) {
        console.error('Logging Error', err)
    }
}

function displayNameForUser(collectionData, userId) {
    return collectionData?.[userId]?.displayName
        ? collectionData[userId].displayName
        : 'no display name'
}

function buildRecentAwardsEvidence({
    awards,
    evidence,
    collectionData,
    lockData,
    safelockData,
    projectData,
    awardData,
    recentCutoff,
    runDate
}) {
    const fullDb = {}

    awards.forEach(doc => {
        const {docId, ...docData} = doc
        const awardCreatedAt = firestoreDateToDayjs(doc.awardCreatedAt)
        if (!awardCreatedAt || awardCreatedAt.isBefore(recentCutoff)) return

        const award = awardData[doc.awardId]
        if (!award) return

        setDeepPush(fullDb, ['awards'], {
            ...docData,
            id: docId,
            awardName: award.name,
            displayName: displayNameForUser(collectionData, doc.userId),
            date: awardCreatedAt.format('YYYY-MM-DD')
        })
    })

    evidence.forEach(doc => {
        const {docId, ...docData} = doc
        const evidenceCreatedAt = firestoreDateToDayjs(doc.evidenceCreatedAt)
        if (!evidenceCreatedAt || evidenceCreatedAt.isBefore(recentCutoff)) return

        const lock = lockData[doc.projectId]
        const safelock = safelockData[doc.projectId]
        const project = projectData[doc.projectId]
        const entry = lock || safelock || project
        if (!entry) return

        const belt = entry?.belt || null
        setDeepPush(fullDb, ['evidence'], {
            ...docData,
            id: docId,
            evidenceName: entryName(entry, 'short'),
            belt,
            displayName: displayNameForUser(collectionData, doc.userId),
            date: evidenceCreatedAt.format('MM/DD/YY')
        })
    })

    fullDb.metadata = {updatedDateTime: dayjs(runDate).format('YYYY-MM-DD HH:mm')}
    return fullDb
}

function buildAllProjectsEvidence({evidence, unclaimedEvidence, collectionData, projectData, runDate}) {
    const allProjects = {}

    evidence.forEach(doc => {
        const {docId, ...docData} = doc
        const project = projectData[doc.projectId]
        if (!project) return

        const evidenceCreatedAt = firestoreDateToDayjs(doc.evidenceCreatedAt)
        const date = evidenceCreatedAt
            ? evidenceCreatedAt.format('YYYY-MM-DD')
            : dayjs(runDate).format('YYYY-MM-DD')
        const discipline = project.name.match(/(.+),/)?.[1]

        setDeepPush(allProjects, ['evidence'], {
            ...docData,
            id: docId,
            discipline,
            tier: project.tier,
            displayName: displayNameForUser(collectionData, doc.userId),
            tabClaimed: collectionData[doc.userId]?.tabClaimed,
            date
        })
    })

    unclaimedEvidence.forEach(doc => {
        const project = projectData[doc.projectId]
        if (!project) return
        if (allProjects.evidence?.find(
            p => (p.projectId === doc.projectId) && p.tabClaimed === doc.tabName)
        ) return

        const date = dayjs(doc.evidenceCreatedAt).format('YYYY-MM-DD')
        const discipline = project.name.match(/(.+),/)?.[1]
        setDeepPush(allProjects, ['evidence'], {
            ...doc,
            unclaimed: true,
            discipline,
            tier: project.tier,
            displayName: collectionData[doc.userId]?.displayName
                ? collectionData[doc.userId].displayName
                : undefined,
            date
        })
    })

    allProjects.metadata = {updatedDateTime: dayjs(runDate).format('YYYY-MM-DD HH:mm')}
    return allProjects
}

async function writePreparedCollection(preparedCollection) {
    await writeJsonFileAtomic(preparedCollection.exportFile, {
        metadata: preparedCollection.metadata,
        data: preparedCollection.data
    })
}

async function writePreparedCollectionState(preparedCollection) {
    if (preparedCollection.stateData) {
        await writeJsonFileAtomic(preparedCollection.stateFile, preparedCollection.stateData)
    }
}

export async function runAwardsEvidenceExport({
    db,
    publicDataDir,
    backupDir,
    exportDir,
    lookbackMs,
    trigger = 'manual',
    activityLogger = async () => {},
    itemDetailLoaders = {awardDetails, lockDetails, projectDetails, safelockDetails},
    now = () => new Date()
}) {
    const runDate = now()
    const recentCutoff = dayjs(runDate).subtract(15, 'day')
    const incrementalCollections = getIncrementalCollections(exportDir)
    const [awardsSnapshot, evidenceSnapshot] = await Promise.all(
        incrementalCollections.map(collectionConfig => prepareIncrementalCollection({
            db,
            collectionConfig,
            lookbackMs,
            runDate
        }))
    )

    const collectionData = JSON.parse(
        await fs.readFile(`${backupDir}/backup.json`, 'utf8')
    )['__collections__']['lockcollections']
    const unclaimedEvidence = JSON.parse(await fs.readFile(`${publicDataDir}/unclaimedEvidence.json`, 'utf8'))

    const [lockData, safelockData, projectData, awardData] = await Promise.all([
        itemDetailLoaders.lockDetails(),
        itemDetailLoaders.safelockDetails(),
        itemDetailLoaders.projectDetails(),
        itemDetailLoaders.awardDetails()
    ])

    const recentAwardsEvidence = buildRecentAwardsEvidence({
        awards: awardsSnapshot.data,
        evidence: evidenceSnapshot.data,
        collectionData,
        lockData,
        safelockData,
        projectData,
        awardData,
        recentCutoff,
        runDate
    })
    const allProjectsEvidence = buildAllProjectsEvidence({
        evidence: evidenceSnapshot.data,
        unclaimedEvidence,
        collectionData,
        projectData,
        runDate
    })

    await Promise.all([
        writePreparedCollection(awardsSnapshot),
        writePreparedCollection(evidenceSnapshot),
        writeJsonFileAtomic(`${publicDataDir}/recentAwardsEvidence.json`, recentAwardsEvidence),
        writeJsonFileAtomic(`${publicDataDir}/allProjectsEvidence.json`, allProjectsEvidence)
    ])

    await Promise.all([
        writePreparedCollectionState(awardsSnapshot),
        writePreparedCollectionState(evidenceSnapshot)
    ])

    await logActivity([
        {
            type: 'READ',
            count: awardsSnapshot.metadata.changeIndexReadCount,
            source: 'awardsEvidenceExport_awardsChangeIndex',
            id: '',
            trigger
        },
        {
            type: 'READ',
            count: awardsSnapshot.metadata.sourceReadCount,
            source: 'awardsEvidenceExport_awards',
            id: '',
            trigger
        },
        {
            type: 'READ',
            count: evidenceSnapshot.metadata.changeIndexReadCount,
            source: 'awardsEvidenceExport_evidenceChangeIndex',
            id: '',
            trigger
        },
        {
            type: 'READ',
            count: evidenceSnapshot.metadata.sourceReadCount,
            source: 'awardsEvidenceExport_evidence',
            id: '',
            trigger
        }
    ], activityLogger)

    if (trigger !== 'cronjob') {
        console.log('Incremental awards/evidence export complete', {
            awards: awardsSnapshot.metadata,
            evidence: evidenceSnapshot.metadata
        })
    }

    return recentAwardsEvidence
}

export async function awardsEvidenceExportMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log
} = {}) {
    const config = loadExportJobConfig({env, requirePublicDataDir: true})
    const summary = exportJobConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const db = await getExportFirestore(config)
    const {default: postFirebaseActivity} = await import('../../util/postFirebaseActivity.js')
    const trigger = argv.includes('cron') ? 'cronjob' : 'manual'
    return runAwardsEvidenceExport({
        db,
        publicDataDir: config.publicDataDir,
        backupDir: config.backupDir,
        exportDir: config.exportDir,
        lookbackMs: config.lookbackMs,
        trigger,
        activityLogger: messages => postFirebaseActivity({activityData: messages})
    })
}

if (isDirectRun(import.meta.url)) {
    await awardsEvidenceExportMain()
}
