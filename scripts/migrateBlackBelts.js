import fs from 'fs'
import admin from 'firebase-admin'
import {getFirestore, FieldValue} from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json'))
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

////////////////////////////////////////////////
// change to (default) and true for production

const db = getFirestore(app, 'lpubelts-dev')
const WRITE_TO_DB = true

const blackBeltAwardId = 'da7759a9'

////////////////////////////////////////////////

let impactedUsers = []

const awardBatch = db.batch()
const earlyBBs = await db.collection('lockcollections').where('blackBeltAwardedAt', '!=', 0).get()
earlyBBs.forEach(rec => {
    const ref = db.collection('awards').doc(btoa(rec.id + blackBeltAwardId))
    const awardTime = rec.data().blackBeltAwardedAt

    console.log(`blackbelt ${rec.id} ${awardTime.toDate().toJSON()}`)
    impactedUsers.push(rec.id)
    awardBatch.set(ref, {
        userId: rec.id,
        awardId: blackBeltAwardId,
        awardUrl: 'admin',
        awardCreatedAt: awardTime
    })
})

const cacheKeys = [...new Set(impactedUsers)].map(id => `activity: userId == ${id}`)
const cacheBatch = db.batch()
cacheKeys.forEach(key => {
    const ref = db.collection('query-cache').doc(key)
    console.log(`query-cache clear ${key}`)
    cacheBatch.delete(ref)
})

if (WRITE_TO_DB) {
    await awardBatch.commit()
    await cacheBatch.commit()
}

const userBatch = db.batch()
const cruftBBs = await db.collection('lockcollections').where('awardedBelt', '==', 'Black').get()
cruftBBs.forEach(rec => {
    const ref = db.collection('lockcollections').doc(rec.id)

    console.log(`awardedBelt ${rec.id}`)
    userBatch.update(ref, {awardedBelt: FieldValue.delete()})
})
if (WRITE_TO_DB) {
    userBatch.commit()
}
