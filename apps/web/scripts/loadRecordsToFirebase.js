import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'

import loadRecords from './firebaseExport.json' with {type: 'json'}

const COLLECTION_NAME = 'belt-requests'
const DEV = true
const DRY_RUN = true

const serviceAccount = JSON.parse(fs.readFileSync('../../../keys/lpu-belt-explorer-firebase-adminsdk.json').toString())
const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

// change to (default) and true for production
// const db = getFirestore(app, 'lpubelts-dev')

const db = DEV ? getFirestore(app, 'lpubelts-dev') : getFirestore(app)
await loadRecordsToFirestore()

async function exportRecordsFromFirestore() {
    db.collection(COLLECTION_NAME).get().then((querySnapshot) => {
        const records = []
        querySnapshot.forEach((doc) => {
            records.push(doc.data())
        })
        console.log(`${records.length} records exported`)
        fs.writeFileSync('./firebaseExport.json', JSON.stringify(records)+'\n')

    })
}


async function loadRecordsToFirestore() {
    console.log(`${loadRecords.length} records to load\n`)

    if (!DRY_RUN) {
        loadRecords.forEach(async (record) => {
            await db.collection(COLLECTION_NAME).doc(record.id).set(record)
        })
        console.log(`${loadRecords.length} records loaded`)

    } else {
        console.log('DRY_RUN: Skipping write to Firestore')
    }
}