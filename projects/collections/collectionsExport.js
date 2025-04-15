import fs from 'node:fs/promises'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {setDeep} from '../util/setDeep.js'

import {localUser, prodUser} from '../../keys/users.js'
import dayjs from 'dayjs'
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

const backupDir = production
    ? `/home/${prodUser}/firebase`
    : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/lpu-belt-explorer-analytics/Collections/lpuBeltsBackups`

async function getAllData() {

    const lockcollections = await dbProd.collection('lockcollections').get()

    const messages = [{
        activity: 'READ',
        activityCount: lockcollections.docs.length,
        source: 'collectionsExport_lockcollections',
        id: '',
        displayName: 'cronjob',
    }]
    try {
        await logToFirebaseLog(messages)
    } catch (err) {
        console.log('Logging Error', err)
    }

    const fullDb = new Map()

    lockcollections.forEach((doc) => {
        setDeep(fullDb, ['__collections__', 'lockcollections', doc.id], doc.data())
    })

    const jsonString = JSON.stringify(fullDb, null, 2)

    await fs.writeFile(`${backupDir}/backup.json`, jsonString, function (err) {
        if (err) {
            console.log(err)
        }
    })
    await fs.writeFile(`${backupDir}/archive/backup.json`, jsonString, function (err) {
        if (err) {
            console.log(err)
        }
    })

    const today = dayjs().format('YYYY-MM-DD')
    await fs.writeFile(`${backupDir}/archive/backup_${today}.json`, jsonString, function (err) {
        if (err) {
            console.log(err)
        }
    })

    return fullDb

}

await getAllData().then()
