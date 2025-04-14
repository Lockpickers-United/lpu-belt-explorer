import fs from 'node:fs/promises'
import {initializeApp, cert} from 'firebase-admin/app'
import {Timestamp, getFirestore} from 'firebase-admin/firestore'
import {setDeepPush} from '../util/setDeep.js'
import {localUser, prodUser} from '../../keys/users.js'
import dayjs from 'dayjs'
import {awardDetails, lockDetails, projectDetails, safelockDetails} from '../util/getItemDetails.js'
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

const backupDir = production
    ? `/home/${prodUser}/firebase`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`

const collectionData = JSON.parse(await fs.readFile(`${backupDir}/backup.json`, 'utf8'))['__collections__']['lockcollections']


async function getAllData() {

    const startAwards = new Timestamp(Math.floor(dayjs().subtract(15, 'day').valueOf() / 1000), 0)
    const startEvidence = new Timestamp(Math.floor(dayjs().subtract(15, 'day').valueOf() / 1000), 0)

    const awards = await dbProd.collection('awards').where('awardCreatedAt', '>=', startAwards).get()
    const evidence = await dbProd.collection('evidence').where('evidenceCreatedAt', '>=', startEvidence).get()

    const messages = [{
        activity: 'READ',
        activityCount: awards.docs.length,
        source: 'awardsEvidenceExport - awards',
        id: '',
        displayName: 'cronjob',
    },{
        activity: 'READ',
        activityCount: evidence.docs.length,
        source: 'awardsEvidenceExport - evidence',
        id: '',
        displayName: 'cronjob',
    }]

    try {
        await logToFirebaseLog(messages)
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
            awardName: award.name,
            displayName: collectionData[doc.data().userId]?.displayName ? collectionData[doc.data().userId].displayName : 'no display name',
            date
        })
    })
    evidence.forEach((doc) => {
        const lock = lockData[doc.data().projectId]
        const safelock = safelockDdata[doc.data().projectId]
        const project = projectData[doc.data().projectId]
        const entry = lock || safelock || project
        const belt = entry.belt || null
        const date = dayjs(doc.data().evidenceCreatedAt.toDate()).format('YYYY-MM-DD')
        setDeepPush(fullDb, ['evidence'], {
            ...doc.data(),
            evidenceName: entryName(entry, 'short'),
            belt,
            displayName: collectionData[doc.data().userId]?.displayName ? collectionData[doc.data().userId].displayName : 'no display name',
            date
        })
    })

    fullDb.metadata = {updatedDateTime: dayjs().format('YYYY-MM-DD HH:mm')}

    await fs.writeFile(`${serverDir}/recentAwardsEvidence.json`, JSON.stringify(fullDb, null, 2), function (err) {
        if (err) {
            console.log(err)
        }
    })

    return fullDb

}

await getAllData().then()