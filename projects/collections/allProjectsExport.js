import fs from 'node:fs/promises'
import {initializeApp, cert} from 'firebase-admin/app'
import {Timestamp, getFirestore} from 'firebase-admin/firestore'
import {setDeepPush} from '../util/setDeep.js'
import {localUser, prodUser} from '../../keys/users.js'
import dayjs from 'dayjs'
import {projectDetails} from '../util/getItemDetails.js'
import entryName from '../util/entryName.js'

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

async function getAllData() {

    const backupDir = production
        ? `/home/${prodUser}/firebase`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`

    const collectionData = JSON.parse(await fs.readFile(`${backupDir}/backup.json`, 'utf8'))['__collections__']['lockcollections']
    const unclaimedEvidence = await dbProd.collection('unclaimed-evidence').get()
    const scorecardEvidence = await dbProd.collection('evidence').get()
    const allEvidence = [...scorecardEvidence.docs, ...unclaimedEvidence.docs]
    const projectData = await projectDetails()

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
        setDeepPush(fullDb, ['evidence'], {
            ...doc.data(),
            evidenceName: entryName(entry, 'short'),
            displayName,
            belt,
            date
        })
        return acc

    }, {})


    fullDb.metadata = {updatedDateTime: dayjs().format('YYYY-MM-DD HH:mm')}

    const jsonString = JSON.stringify(fullDb, null, 2)
    await fs.writeFile(`${serverDir}/allProjects.json`, jsonString, function (err) {
        if (err) {
            console.log(err)
        }
    })

    return fullDb

}

await getAllData().then()
