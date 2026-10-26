import fs from 'node:fs/promises'
import {setDeepAdd, setDeepPush} from '../../util/setDeep.js'
import dayjs from 'dayjs'
import {projectDetails, lockDetails} from '../../util/getItemDetails.js'
import entryName from '../../util/entryName.js'
import isDirectRun from '../../util/isDirectRun.js'
import {writeJsonFileAtomic} from '../../util/writeJsonFileAtomic.js'
import {exportJobConfigSummary, loadExportJobConfig} from './exportJobConfig.js'
import {loadCollectionEnvironment} from './collectionEnvironment.js'

const allUnclaimedEvidenceFile = new URL('../../data/allUnclaimedEvidence.json', import.meta.url)

function evidenceDate(value) {
    if (!value) return '---'
    if (typeof value.toDate === 'function') return dayjs(value.toDate()).format('YYYY-MM-DD')
    if (Number.isInteger(value._seconds)) return dayjs.unix(value._seconds).format('YYYY-MM-DD')
    if (Number.isInteger(value.seconds)) return dayjs.unix(value.seconds).format('YYYY-MM-DD')
    return dayjs(value).format('YYYY-MM-DD')
}

function evidenceDisplayName(evidence, collectionData) {
    if (evidence.userId) return collectionData[evidence.userId]?.displayName ?? 'unknown'
    return evidence.tabName ?? 'unknown'
}

function evidenceDetails(evidence, entry, collectionData) {
    return {
        ...evidence,
        evidenceName: entryName(entry, 'short'),
        displayName: evidenceDisplayName(evidence, collectionData),
        belt: entry.belt || null,
        blackBelt: !!collectionData[evidence.userId]?.blackBeltAwardedAt,
        date: evidenceDate(evidence.evidenceCreatedAt)
    }
}

function deduplicateEvidenceByDocId(evidenceItems) {
    const deduplicated = []
    const indexByDocId = new Map()

    evidenceItems.forEach(evidence => {
        if (typeof evidence.docId !== 'string' || !evidence.docId) {
            deduplicated.push(evidence)
            return
        }

        const existingIndex = indexByDocId.get(evidence.docId)
        if (existingIndex === undefined) {
            indexByDocId.set(evidence.docId, deduplicated.length)
            deduplicated.push(evidence)
            return
        }

        deduplicated[existingIndex] = evidence
    })

    return deduplicated
}

export async function runAllEvidenceExport({
    backupDir,
    exportDir,
    publicDataDir,
    apiDir,
    trigger = 'manual',
    projectDetailsLoader = projectDetails,
    lockDetailsLoader = lockDetails,
    unclaimedEvidenceFile = allUnclaimedEvidenceFile,
    now = () => new Date()
}) {
    const [collectionBackup, evidenceExport, unclaimedEvidence] = await Promise.all([
        fs.readFile(`${backupDir}/backup.json`, 'utf8').then(JSON.parse),
        fs.readFile(`${exportDir}/evidence.json`, 'utf8').then(JSON.parse),
        fs.readFile(unclaimedEvidenceFile, 'utf8').then(JSON.parse)
    ])
    const collectionData = collectionBackup['__collections__']['lockcollections']
    const exportedEvidence = evidenceExport.data
    if (!Array.isArray(exportedEvidence)) throw new Error('Invalid evidence export data')
    if (!Array.isArray(unclaimedEvidence)) throw new Error('Invalid unclaimed evidence data')

    const scorecardEvidence = deduplicateEvidenceByDocId(exportedEvidence)

    const allEvidence = [...scorecardEvidence, ...unclaimedEvidence]
    const [projectData, lockData] = await Promise.all([
        projectDetailsLoader(),
        lockDetailsLoader()
    ])

    const fullDb = {}
    allEvidence.reduce((acc, evidence) => {
        const entry = projectData[evidence.projectId]
        if (!entry) return acc

        const details = evidenceDetails(evidence, entry, collectionData)
        const evInfo = [evidence.projectId, details.date, evidence.evidenceUrl].join('|')
        if (acc[evInfo]) return acc
        acc[evInfo] = true

        setDeepPush(fullDb, ['projects'], details)
        return acc
    }, {})

    const lockVideos = scorecardEvidence.reduce((acc, evidence) => {
        const lock = lockData[evidence.projectId]
        if (!lock) return acc
        const details = evidenceDetails(evidence, lock, collectionData)
        const lockId = lock.id
        const videoEntry = {
            userId: evidence.userId,
            pickerName: details.displayName,
            pickerIsBlackBelt: !!details.blackBelt,
            url: evidence.evidenceUrl,
            date: details.date
        }
        if (evidence.evidenceUrl.toLowerCase().includes('youtu')
            && !acc[lockId]?.some(({userId, url}) => {
                return userId === evidence.userId && url === evidence.evidenceUrl
            })) {
            setDeepPush(acc, [lockId], videoEntry)
        }
        return acc
    }, {})

    const pickStats = scorecardEvidence.reduce((acc, evidence) => {
        const project = projectData[evidence.projectId]
        const lock = lockData[evidence.projectId]
        const entry = lock || project
        if (!entry) return acc

        const details = evidenceDetails(evidence, entry, collectionData)
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

    const metadata = {updatedDateTime: dayjs(now()).format('YYYY-MM-DD HH:mm')}
    fullDb.metadata = metadata

    await Promise.all([
        writeJsonFileAtomic(`${publicDataDir}/allProjects.json`, fullDb),
        writeJsonFileAtomic(`${publicDataDir}/pickStats.json`, pickStats),
        writeJsonFileAtomic(`${apiDir}/lockVideos.json`, {metadata, lockVideos})
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

    const config = loadExportJobConfig({
        env,
        requirePublicDataDir: true,
        requireApiDir: true
    })
    const summary = exportJobConfigSummary(config)
    if (argv.includes('--check-config')) {
        writeOutput(JSON.stringify(summary, null, 2))
        return summary
    }

    const trigger = argv.includes('cron') ? 'cronjob' : 'manual'
    return runAllEvidenceExport({
        backupDir: config.backupDir,
        exportDir: config.exportDir,
        publicDataDir: config.publicDataDir,
        apiDir: config.apiDir,
        trigger
    })
}

if (isDirectRun(import.meta.url)) {
    await allEvidenceExportMain()
}
