import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json'))
const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

////////////////////////////////////////////////////
//
// For changelog migrations, see processChangelog.js
//
////////////////////////////////////////////////////


// change to (default) and true for production
// const db = getFirestore(app, 'lpubelts-dev')

const db = getFirestore(app, 'lpubelts-dev')

const WRITE_TO_DB = false

// Update these variables to restore a user's data
const userId = '1234'
const data = {

}

// get user profile from `/lockcollections/${userId}`

const docSnap = await db.collection('lockcollections').doc(userId).get()
if (docSnap.exists) {
    console.log('current profile:', docSnap.data())
    if (WRITE_TO_DB) {
        await db.collection('lockcollections').doc(userId).set(data)
        console.log('new profile:', data)
    } else {
        console.log('WRITE_TO_DB is false, no changes made')
    }
} else {
    console.error('no profile for:', userId)
}
