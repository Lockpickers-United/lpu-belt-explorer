import fs from 'node:fs/promises'
import {initializeApp, cert} from 'firebase-admin/app'
import {Timestamp, getFirestore} from 'firebase-admin/firestore'
import {setDeepPush} from '../../util/setDeep.js'
import {localUser, prodUser} from '../../../keys/users.js'
import dayjs from 'dayjs'
import {awardDetails, lockDetails, projectDetails, safelockDetails} from '../../util/getItemDetails.js'
import entryName from '../../util/entryName.js'
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

const backupDir = production
    ? `/home/${prodUser}/firebase`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`

const collectionData = JSON.parse(await fs.readFile(`${backupDir}/backup.json`, 'utf8'))['__collections__']['lockcollections']
const unclaimedEvidence = JSON.parse(await fs.readFile(`${serverDir}/unclaimedEvidence.json`, 'utf8'))

async function getAllData() {

    const startAwards = new Timestamp(Math.floor(dayjs().subtract(15, 'day').valueOf() / 1000), 0)

    const awards = await dbProd.collection('awards').where('awardCreatedAt', '>=', startAwards).get()
    const allEvidence = await dbProd.collection('evidence').get()
    //const unclaimedEvidence = await dbProd.collection('unclaimed-evidence').get()

    const messages = [{
        activity: 'READ',
        activityCount: awards.docs.length,
        source: 'awardsEvidenceExport_awards',
        id: '',
        displayName: 'cronjob'
    }, {
        activity: 'READ',
        activityCount: allEvidence.docs.length,
        source: 'awardsEvidenceExport_evidence',
        id: '',
        displayName: 'cronjob'
    }]

    try {
        production && await logToFirebaseLog(messages)
    } catch (err) {
        console.log('Logging Error', err)
    }

    const lockData = await lockDetails()
    const safelockDdata = await safelockDetails()
    const projectData = await projectDetails()
    const awardData = await awardDetails()

    const fullDb = new Map()

    awards.forEach((doc) => {
        const award = awardData[doc.data().awardId]
        const date = dayjs(doc.data().awardCreatedAt.toDate()).format('YYYY-MM-DD')
        setDeepPush(fullDb, ['awards'], {
            ...doc.data(),
            id: doc.id,
            awardName: award.name,
            displayName: collectionData[doc.data().userId]?.displayName ? collectionData[doc.data().userId].displayName : 'no display name',
            date
        })
    })
    allEvidence.forEach((doc) => {
        if (!doc.data().evidenceCreatedAt || dayjs(doc.data().evidenceCreatedAt.toDate()).isBefore(dayjs().subtract(15, 'day'))) return
        const lock = lockData[doc.data().projectId]
        const safelock = safelockDdata[doc.data().projectId]
        const project = projectData[doc.data().projectId]
        const entry = lock || safelock || project
        if (!entry) return
        const belt = entry?.belt || null
        const date = dayjs(doc.data().evidenceCreatedAt.toDate()).format('MM/DD/YY')
        setDeepPush(fullDb, ['evidence'], {
            ...doc.data(),
            id: doc.id,
            evidenceName: entryName(entry, 'short'),
            belt,
            displayName: collectionData[doc.data().userId]?.displayName ? collectionData[doc.data().userId].displayName : 'no display name',
            date
        })
    })

    //console.log('evidence', fullDb.evidence.sort((a,b) => Math.floor(dayjs(a.date).valueOf() / 3600 * 24) - Math.floor(dayjs(b.date).valueOf() / 3600 * 24)))

    fullDb.metadata = {updatedDateTime: dayjs().format('YYYY-MM-DD HH:mm')}
    await fs.writeFile(`${serverDir}/recentAwardsEvidence.json`, JSON.stringify(fullDb, null, 2), function (err) {
        if (err) {
            console.log(err)
        }
    })

    const allProjects = {}

    allEvidence.forEach((doc) => {
        const project = projectData[doc.data().projectId]
        if (!project) return
        const date = dayjs(doc.data().evidenceCreatedAt?.toDate()).format('YYYY-MM-DD')
        const discipline = project.name.match(/(.+),/)?.[1]
        setDeepPush(allProjects, ['evidence'], {
            ...doc.data(),
            id: doc.id,
            discipline,
            tier: project.tier,
            displayName: collectionData[doc.data().userId]?.displayName ? collectionData[doc.data().userId].displayName : 'no display name',
            tabClaimed: collectionData[doc.data().userId]?.tabClaimed,
            date
        })
    })
    unclaimedEvidence.forEach(evidence => {
        const project = projectData[evidence.projectId]
        if (!project) return
        if (allProjects.evidence?.find(
            p => (p.projectId === evidence.projectId) && p.tabClaimed === evidence.tabName)
        ) return

        const date = dayjs(evidence.evidenceCreatedAt).format('YYYY-MM-DD')
        const discipline = project.name.match(/(.+),/)?.[1]
        setDeepPush(allProjects, ['evidence'], {
            ...evidence,
            unclaimed: true,
            discipline,
            tier: project.tier,
            displayName: collectionData[evidence.userId]?.displayName ? collectionData[evidence.userId].displayName : undefined,
            date
        })
    })

    allProjects.metadata = {updatedDateTime: dayjs().format('YYYY-MM-DD HH:mm')}
    await fs.writeFile(`${serverDir}/allProjectsEvidence.json`, JSON.stringify(allProjects, null, 2), function (err) {
        if (err) {
            console.log(err)
        }
    })

    //console.log('allProjects', allProjects.evidence)

    return fullDb

}

await getAllData().then()