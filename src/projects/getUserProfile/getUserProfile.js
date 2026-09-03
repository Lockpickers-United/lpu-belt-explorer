import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {jsonIt} from '../../util/jsonIt.js'

const serviceAccount = JSON.parse(fs.readFileSync('../../../keys/lpu-belt-explorer-firebase-adminsdk.json'))
const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})


// change to (default) and true for production
// const db = getFirestore(app, 'lpubelts-dev')

const db = getFirestore(app)

const WRITE_TO_DB = false

// Update these variables to read a user's data
const userId = 'GGplAdctTfVDLVvYsfIADJmfp8f2'
const data = {}

async function getUserProfile({userId}) {
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

await getUserProfile({userId}).then((response) => {
    jsonIt('response:', response)
})