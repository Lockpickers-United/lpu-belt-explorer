import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'

import loadRecords from './loadRecords.json' with {type: 'json'}
import dayjs from 'dayjs'

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

console.log(`${loadRecords.length} records to load\n`)

const _testRecord = {
    id: '00011122',
    name: 'John Doe',
    email: 'john.doe@example.com',
    belt: 'White',
    date: dayjs().format('YYYY-MM-DD')
}

if (!DRY_RUN) {
    loadRecords.forEach(async (record) => {
        await db.collection(COLLECTION_NAME).doc(record.id).set(record)
    })
    console.log(`${loadRecords.length} records loaded`)

} else {
    console.log('DRY_RUN: Skipping write to Firestore')
}