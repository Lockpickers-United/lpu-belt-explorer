const { initializeApp, cert } = require("firebase-admin/app")
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')

const config = {
    credential: cert(serviceAccount)
}
const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp)


// SET USER ID & DATE AWARDED

const userId = '4qqxB0nW8dczUws5XuAyhEkgZEj2'
const approvedDate = '2024-08-18'

addBlackBelt()
//removeBlackBelt()


//update profile
function addBlackBelt() {
    const dateStr = approvedDate + 'T00:00:00.000Z'
    const data = {
        awardedBelt: 'Black',
        blackBeltAwardedAt: Timestamp.fromDate(new Date(dateStr)),
        tabClaimed: `(new black belt: ${userId})`
    }
    const ref = db.doc(`/lockcollections/${userId}`)
    ref.update(data)
}

function removeBlackBelt() {
    const ref = db.doc(`/lockcollections/${userId}`)
    ref.update({blackBeltAwardedAt: FieldValue.delete(), tabClaimed: FieldValue.delete(), awardedBelt: FieldValue.delete()})
}