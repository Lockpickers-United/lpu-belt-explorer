import fs from 'fs'
import admin from 'firebase-admin'
import {getFirestore, Firestore} from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json'))
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})
const db = getFirestore(app, 'lpubelts-dev')

// Create evidence for each element of recorded user array,
// and copy contents of recorded array to recordedLocks array.

const docs = await db.collection('lockcollections').where('recorded', '!=', []).get()

let entries = []
docs.forEach(rec => entries.push({userId: rec.ref.id, recorded: rec.data().recorded}))

for (let idx=0; idx < entries.length; idx++) {
    const rec = entries[idx]

    if (rec.recorded && rec.recorded.length > 0) {
        console.log(`migrating user id ${rec.userId}`)

        const newDocs = rec.recorded.map(id => {
            return {
                userId: rec.userId,
                projectId: id,
                evidenceNotes: '',
                evidenceUrl: '',
                modifier: ''
            }
        })

        const batch = db.batch()
        newDocs.forEach(newDoc => {
            const evidRef = db.collection('evidence').doc()
            batch.set(evidRef, newDoc)
        })
        await batch.commit()

        await db.collection('lockcollections').doc(rec.userId)
            .update({
                recordedLocks: rec.recorded,
                public: Firestore.FieldValue.delete()
            })
    }
}
