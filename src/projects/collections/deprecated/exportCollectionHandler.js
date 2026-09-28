import fs from 'node:fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'

import {logFirebaseActivity} from '../../logFirebaseActivity/logFirebaseActivity.js'
import postFirebaseActivity from '../../../util/postFirebaseActivity.js'
import {pathToFileURL} from 'url'
import {getDeprecatedKeysDir, loadDeprecatedKeysModule} from '../../../util/deprecatedKeys.js'

const {localUser, prodUser} = await loadDeprecatedKeysModule('users.js')

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
const isCron = !!process.argv[2] && process.argv[2] === 'cron'

const production = process.env.USER !== localUser
const keysDir = getDeprecatedKeysDir()
const serviceAccount = JSON.parse(await fs.promises.readFile(`${keysDir}/service-account.json`, 'utf8'))

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config)

export default async function exportCollection({collection, devDb=false}) {


    const db = !devDb ? getFirestore(firebaseApp) : getFirestore(firebaseApp, 'lpubelts-dev')

    const backupDir = production
        ? `/home/${prodUser}/collectionExports`
        : `/Users/${localUser}/Documents/LOCKPICK/LPU-Belt-Explorer/collectionExports`

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, {recursive: true})
    }

    const collectionData = await db.collection(collection).get()

    const messages = [{
        type: 'READ',
        count: collectionData.docs.length,
        source: `collectionsExport_${collection}`,
        id: '',
        displayName: 'cronjob'
    }]

    try {
        if (isDirectRun || isCron) await postFirebaseActivity({activityData: messages})
        else await logFirebaseActivity(messages)
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
    const jsonString = JSON.stringify({metadata, data})

    fs.writeFile(`${backupDir}/${collection}.json`, jsonString, function (err) {
        if (err) {
            console.log(err)
        }
    })

    return {metadata, data}
}
