import fs from 'node:fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'

import {localUser, prodUser} from '../../keys/users.js'
import {logToFirebaseLog} from '../logFirebaseActivity/logFirebaseActivity.js'
import postFirebaseActivity from '../util/postFirebaseActivity.js'

const production = process.env.USER !== localUser

const keysDir = production
    ? `/home/${prodUser}/explore-lpubelts-com-node/keys`
    : `/Users/${localUser}/Documents/GitHub/explore-lpubelts-com-node/keys`

const serviceAccount = JSON.parse(await fs.promises.readFile(`${keysDir}/service-account.json`, 'utf8'))

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)

export default async function exportCollection({collection, devDb=false, desinationDir=''}) {


    const db = !devDb ? getFirestore(firebaseApp) : getFirestore(firebaseApp, 'lpubelts-dev')

    const backupDir = production
        ? `/home/${prodUser}/collectionExports`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/collectionExports`

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, {recursive: true})
    }

    const collectionData = await db.collection(collection).get()

    const messages = [{
        activity: 'READ',
        activityCount: collectionData.docs.length,
        source: `collectionsExport_${collection}`,
        id: '',
        displayName: 'cronjob'
    }]

    try {
        if (production) {
            await logToFirebaseLog(messages)
        } else {
            await postFirebaseActivity({activityData: messages})
        }
    } catch (err) {
        console.log('Logging Error', err)
    }

    const data = collectionData.docs.map(doc => {
        return {docId: doc.id, ...doc.data()}
    })
    const metadata = {
        collection: collection,
        date: new Date().toISOString(),
        docCount: data.length
    }
    const jsonString = JSON.stringify({metadata, data}, null, 2)

    await fs.writeFile(`${backupDir}/${collection}.json`, jsonString, function (err) {
        if (err) {
            console.log(err)
        }
    })

    return {metadata, data}
}
