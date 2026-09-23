import fs from 'node:fs/promises'
import path from 'node:path'
import {Timestamp} from 'firebase-admin/firestore'
import {setDeepAdd, setDeepPush} from '../../util/setDeep.js'
import dayjs from 'dayjs'
import {projectDetails, lockDetails} from '../../util/getItemDetails.js'
import entryName from '../../util/entryName.js'
import isDirectRun from '../../util/isDirectRun.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'
import {getExportFirestore} from './exportFirebase.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'

async function ensureWriteDir(filePath) {
    await fs.mkdir(path.dirname(filePath), {recursive: true})
}

async function writeJsonFileAtomic(filePath, data) {
    await ensureWriteDir(filePath)
    const tempFile = `${filePath}.tmp-${process.pid}-${Date.now()}`
    await fs.writeFile(tempFile, JSON.stringify(data))
    await fs.rename(tempFile, filePath)
}

async function logReadActivity(messages, activityLogger) {
    try {
        await activityLogger(messages)
    } catch (err) {
        console.error('Logging Error', err)
    }
}

function evidenceDate(value) {
    if (!value) return '---'
    return dayjs(value instanceof Timestamp ? value.toDate() : value).format('YYYY-MM-DD')
}

function evidenceDisplayName(evidence, collectionData) {
    if (evidence.userId) return collectionData[evidence.userId]?.displayName ?? 'unknown'
    return evidence.tabName ?? 'unknown'
}

function evidenceDetails(doc, entry, collectionData) {
    const evidence = doc.data()
    return {
        docId: doc.id,
        ...evidence,
        evidenceName: entryName(entry, 'short'),
        displayName: evidenceDisplayName(evidence, collectionData),
        belt: entry.belt || null,
        blackBelt: !!collectionData[evidence.userId]?.blackBeltAwardedAt,
        date: evidenceDate(evidence.evidenceCreatedAt)
    }
}

export async function runAllEvidenceExport({
    db,
    backupDir,
    publicDataDir,
    trigger = 'manual',
    activityLogger = async () => {},
    projectDetailsLoader = projectDetails,
    lockDetailsLoader = lockDetails,
    now = () => new Date()
}) {
    const collectionBackup = JSON.parse(await fs.readFile(`${backupDir}/backup.json`, 'utf8'))
    const collectionData = collectionBackup['__collections__']['lockcollections']
    const [unclaimedEvidence, scorecardEvidence] = await Promise.all([
        db.collection('unclaimed-evidence').get(),
        db.collection('evidence').get()
    ])

    await logReadActivity([{
        type: 'READ',
        count: unclaimedEvidence.docs.length,
        source: 'allEvidenceExport - unclaimed-evidence',
        id: '',
        trigger
    }, {
        type: 'READ',
        count: scorecardEvidence.docs.length,
        source: 'allEvidenceExport - scorecardEvidence',
        id: '',
        trigger
    }], activityLogger)

    const allEvidence = [...scorecardEvidence.docs, ...unclaimedEvidence.docs]
    const [projectData, lockData] = await Promise.all([
        projectDetailsLoader(),
        lockDetailsLoader()
    ])

    const fullDb = {}
    allEvidence.reduce((acc, doc) => {
        const evidence = doc.data()
        const entry = projectData[evidence.projectId]
        if (!entry) return acc

        const details = evidenceDetails(doc, entry, collectionData)
        const evInfo = [evidence.projectId, details.date, evidence.evidenceUrl].join('|')
        if (acc[evInfo]) return acc
        acc[evInfo] = true

        setDeepPush(fullDb, ['projects'], details)
        return acc
    }, {})

    const pickStats = scorecardEvidence.docs.reduce((acc, doc) => {
        const evidence = doc.data()
        const project = projectData[evidence.projectId]
        const lock = lockData[evidence.projectId]
        const entry = lock || project
        if (!entry) return acc

        const details = evidenceDetails(doc, entry, collectionData)
        if (evidence.modifier) {
            setDeepPush(fullDb, ['modifiers'], details)
        }

        if (lock && details.belt && lock.lockingMechanisms) {
            const lockingMechanism = lock.lockingMechanisms.length === 1
                ? lock.lockingMechanisms[0]
                : 'Multiple'
            setDeepAdd(acc, ['byBeltByMechanism', details.belt, lockingMechanism], 1)
            setDeepAdd(acc, ['byBelt', details.belt], 1)
            setDeepAdd(acc, ['byMechanism', lockingMechanism], 1)
            setDeepAdd(acc, ['byLock', evidence.projectId], 1)
        }
        return acc
    }, {})

    pickStats.lockDetails = Object.keys(pickStats.byLock ?? {})
        .map(id => {
            const lock = lockData[id]
            if (!lock) return null
            const lockingMechanism = lock.lockingMechanisms.length === 1
                ? lock.lockingMechanisms[0]
                : 'Multiple'

            return {
                id,
                name: entryName(lock, 'short'),
                belt: lock.belt.replace(/ \d/, ''),
                fullBelt: lock.belt,
                lockingMechanism,
                pickCount: pickStats.byLock[id]
            }
        })
        .filter(Boolean)
        .sort((a, b) => b.pickCount - a.pickCount)

    fullDb.metadata = {updatedDateTime: dayjs(now()).format('YYYY-MM-DD HH:mm')}

    const allScorecardEvidence = scorecardEvidence.docs
        .map(doc => {
            const evidence = doc.data()
            const entry = lockData[evidence.projectId] || projectData[evidence.projectId]
            return entry ? evidenceDetails(doc, entry, collectionData) : null
        })
        .filter(Boolean)

    const allUnclaimedEvidence = unclaimedEvidence.docs
        .map(doc => {
            const evidence = doc.data()
            const entry = lockData[evidence.projectId] || projectData[evidence.projectId]
            return entry ? evidenceDetails(doc, entry, collectionData) : null
        })
        .filter(Boolean)

    await Promise.all([
        writeJsonFileAtomic(`${publicDataDir}/allProjects.json`, fullDb),
        writeJsonFileAtomic(`${publicDataDir}/pickStats.json`, pickStats),
        writeJsonFileAtomic(`${publicDataDir}/allScorecardEvidence.json`, allScorecardEvidence),
        writeJsonFileAtomic(`${publicDataDir}/allUnclaimedEvidence.json`, allUnclaimedEvidence)
    ])

    if (trigger !== 'cronjob') console.log('All evidence export complete')

    return fullDb
}

export default runAllEvidenceExport

export async function allEvidenceExportMain({
    env = process.env,
    argv = process.argv,
    writeOutput = console.log,
    loadEnvironment
} = {}) {
    loadCollectionEnvironment({env, loadEnvironment})

    const config = loadExportJobConfig({env, requirePublicDataDir: true})
    const summary = exportJobConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const db = await getExportFirestore(config)
    const {default: postFirebaseActivity} = await import('../../util/postFirebaseActivity.js')
    const trigger = argv.includes('cron') ? 'cronjob' : 'manual'
    return runAllEvidenceExport({
        db,
        backupDir: config.backupDir,
        publicDataDir: config.publicDataDir,
        trigger,
        activityLogger: messages => postFirebaseActivity({activityData: messages})
    })
}

if (isDirectRun(import.meta.url)) {
    await allEvidenceExportMain()
}
