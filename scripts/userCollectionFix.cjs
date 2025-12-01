const admin = require('firebase-admin')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})
const db = admin.firestore(app)

//
// For changelog migrations, see processChangelog.js
//

// Update these variables to restore a user's data
const userId = ''
const data = {

}

const ref = db.doc(`/lockcollections/${userId}`)
ref.set(data)
