import fs from 'node:fs/promises'
import {initializeApp, cert} from 'firebase-admin/app'
import {Timestamp, getFirestore} from 'firebase-admin/firestore'
import {setDeepAdd, setDeepPush} from '../util/setDeep.js'
import {localUser, prodUser} from '../../keys/users.js'
import dayjs from 'dayjs'
import {projectDetails, lockDetails} from '../util/getItemDetails.js'
import entryName from '../util/entryName.js'
import {logToFirebaseLog} from '../logFirebaseActivity/logFirebaseActivity.js'

const production = process.env.USER !== localUser

const keysDir = production
    ? `/home/${prodUser}/explore-lpubelts-com-node/keys`
    : `/Users/${localUser}/Documents/GitHub/explore-lpubelts-com-node/keys`

const serviceAccount = JSON.parse(await fs.readFile(`${keysDir}/service-account.json`, 'utf8'))

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)
//const dbDev = getFirestore(firebaseApp, 'lpubelts-dev')
const dbProd = getFirestore(firebaseApp)

const serverDir = production
    ? `/home/${prodUser}/explore.lpubelts.com/public/data`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections`

export default async function getAllEvidence() {

    console.log('Running getAllEvidence()')

    const backupDir = production
        ? `/home/${prodUser}/firebase`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`

    const collectionData = JSON.parse(await fs.readFile(`${backupDir}/backup.json`, 'utf8'))['__collections__']['lockcollections']
    const unclaimedEvidence = await dbProd.collection('unclaimed-evidence').get()
    const scorecardEvidence = await dbProd.collection('evidence').get()

    const messages = [{
        activity: 'READ',
        activityCount: unclaimedEvidence.docs.length,
        source: 'allEvidenceExport - unclaimed-evidence',
        id: '',
        displayName: 'cronjob'
    }, {
        activity: 'READ',
        activityCount: scorecardEvidence.docs.length,
        source: 'allEvidenceExport - scorecardEvidence',
        id: '',
        displayName: 'cronjob'
    }]

    try {
        await logToFirebaseLog(messages)
    } catch (err) {
        console.log('Logging Error', err)
    }

    const allEvidence = [...scorecardEvidence.docs, ...unclaimedEvidence.docs]
    const projectData = await projectDetails()
    const lockData = await lockDetails()

    const fullDb = new Map()
    allEvidence.reduce((acc, doc) => {
        acc = acc ? acc : {}
        const entry = projectData[doc.data().projectId]
        if (!entry) {
            return acc
        }

        const displayName = doc.data().userId
            ? collectionData[doc.data().userId].displayName
            : doc.data().tabName
                ? doc.data().tabName
                : 'unknown'
        const belt = entry.belt || null
        const blackBelt = !!collectionData[doc.data().userId]?.blackBeltAwardedAt
        const evidenceName = entryName(entry, 'short')
        const date = doc.data().evidenceCreatedAt
            ? doc.data().evidenceCreatedAt instanceof Timestamp
                ? dayjs(doc.data().evidenceCreatedAt.toDate()).format('YYYY-MM-DD')
                : dayjs(doc.data().evidenceCreatedAt).format('YYYY-MM-DD')
            : '---'

        const evInfo = [doc.data().projectId, date, doc.data().evidenceUrl].join('|')
        if (acc[evInfo]) {
            return acc
        }
        acc[evInfo] = true

        setDeepPush(fullDb, ['projects'], {
            ...doc.data(),
            evidenceName,
            displayName,
            belt,
            blackBelt,
            date
        })
        return acc
    }, {})

    const pickStats = scorecardEvidence.docs.reduce((acc, doc) => {
        acc = acc ? acc : {}
        const project = projectData[doc.data().projectId]
        const lock = lockData[doc.data().projectId]
        const entry = lock || project

        if (!entry) {
            return acc
        }

        const displayName = doc.data().userId
            ? collectionData[doc.data().userId]?.displayName
            : doc.data().tabName
                ? doc.data().tabName
                : 'unknown'
        const belt = entry.belt || null
        const evidenceName = entryName(entry, 'short')
        const blackBelt = !!collectionData[doc.data().userId]?.blackBeltAwardedAt
        const date = doc.data().evidenceCreatedAt
            ? doc.data().evidenceCreatedAt instanceof Timestamp
                ? dayjs(doc.data().evidenceCreatedAt.toDate()).format('YYYY-MM-DD')
                : dayjs(doc.data().evidenceCreatedAt).format('YYYY-MM-DD')
            : '---'

        if (doc.data().modifier) {
            setDeepPush(fullDb, ['modifiers'], {
                ...doc.data(),
                evidenceName,
                displayName,
                belt,
                blackBelt,
                date
            })
        }

        if (lock && belt && lock.lockingMechanisms) {
            const lockingMechanism = lock.lockingMechanisms.length === 1
                ? lock.lockingMechanisms[0]
                : 'Multiple'
            setDeepAdd(acc, ['byBeltByMechanism', belt, lockingMechanism], 1)
            setDeepAdd(acc, ['byBelt', belt], 1)
            setDeepAdd(acc, ['byMechanism', lockingMechanism], 1)
            setDeepAdd(acc, ['byLock', doc.data().projectId], 1)
        }
        return acc
    }, {})

    pickStats.lockDetails = Object.keys(pickStats.byLock).map(id => {
        const lock = lockData[id]
        if (!lock) return
        const name = entryName(lock, 'short')
        const lockingMechanism = lock.lockingMechanisms.length === 1
            ? lock.lockingMechanisms[0]
            : 'Multiple'

        return {
            id,
            name,
            belt: lock.belt.replace(/ \d/, ''),
            fullBelt: lock.belt,
            lockingMechanism,
            pickCount: pickStats.byLock[id]
        }
    }).sort((a, b) => b.pickCount - a.pickCount)

    fullDb.metadata = {updatedDateTime: dayjs().format('YYYY-MM-DD HH:mm')}

    try {
        await fs.writeFile(`${serverDir}/allProjects.json`, JSON.stringify(fullDb, null, 2))
    } catch (err) {
        console.log(err)
    }

    try {
        await fs.writeFile(`${serverDir}/pickStats.json`, JSON.stringify(pickStats, null, 2))
    } catch (err) {
        console.log(err)
    }


    const allScorecardEvidence = scorecardEvidence.docs.map(doc => {
        const project = projectData[doc.data().projectId]
        const lock = lockData[doc.data().projectId]
        const entry = lock || project
        if (!entry) {
            return
        }

        const displayName = doc.data().userId
            ? collectionData[doc.data().userId].displayName
            : doc.data().tabName
                ? doc.data().tabName
                : 'unknown'
        const belt = entry.belt || null
        const blackBelt = !!collectionData[doc.data().userId]?.blackBeltAwardedAt
        const evidenceName = entryName(entry, 'short')
        const date = doc.data().evidenceCreatedAt
            ? doc.data().evidenceCreatedAt instanceof Timestamp
                ? dayjs(doc.data().evidenceCreatedAt.toDate()).format('YYYY-MM-DD')
                : dayjs(doc.data().evidenceCreatedAt).format('YYYY-MM-DD')
            : '---'

        return {
            ...doc.data(),
            evidenceName,
            displayName,
            belt,
            blackBelt,
            date
        }
    }).filter(x => x)

    const allUnclaimedEvidence = unclaimedEvidence.docs.map(doc => {
        const project = projectData[doc.data().projectId]
        const lock = lockData[doc.data().projectId]
        const entry = lock || project
        if (!entry) {
            return
        }

        const displayName = doc.data().userId
            ? collectionData[doc.data().userId].displayName
            : doc.data().tabName
                ? doc.data().tabName
                : 'unknown'
        const belt = entry.belt || null
        const blackBelt = !!collectionData[doc.data().userId]?.blackBeltAwardedAt
        const evidenceName = entryName(entry, 'short')
        const date = doc.data().evidenceCreatedAt
            ? doc.data().evidenceCreatedAt instanceof Timestamp
                ? dayjs(doc.data().evidenceCreatedAt.toDate()).format('YYYY-MM-DD')
                : dayjs(doc.data().evidenceCreatedAt).format('YYYY-MM-DD')
            : '---'

        return {
            ...doc.data(),
            evidenceName,
            displayName,
            belt,
            blackBelt,
            date
        }
    })


    try {
        await fs.writeFile(`${serverDir}/allScorecardEvidence.json`, JSON.stringify(allScorecardEvidence, null, 2))
    } catch (err) {
        console.log(err)
    }

    try {
        await fs.writeFile(`${serverDir}/allUnclaimedEvidence.json`, JSON.stringify(allUnclaimedEvidence, null, 2))
    } catch (err) {
        console.log(err)
    }

    return fullDb

}

await getAllEvidence().then()
