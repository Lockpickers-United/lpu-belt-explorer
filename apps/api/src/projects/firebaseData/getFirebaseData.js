import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {jsonIt} from '../../util/jsonIt.js'
import {getDeprecatedKeyPath} from '../../util/deprecatedKeys.js'

const serviceAccount = JSON.parse(fs.readFileSync(
    getDeprecatedKeyPath('lpu-belt-explorer-firebase-adminsdk.json'),
    'utf8'
))
const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})


// change to (default) and true for production
// const db = getFirestore(app, 'lpubelts-dev')
const db = getFirestore(app)

const userId = 'GGplAdctTfVDLVvYsfIADJmfp8f2'

async function getFirebaseData({userId}) {
    const profile = await db.collection('lockcollections').doc(userId).get()
    const response = {userId}
    if (profile.exists) {
        response.profile = profile.data()
    } else {
        console.error('no profile for:', userId)
        response.profile = {}

    }
    return response
}

await getFirebaseData({userId}).then((response) => {
    jsonIt('response:', response)
})
