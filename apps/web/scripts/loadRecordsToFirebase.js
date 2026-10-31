import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import {getAuth} from 'firebase-admin/auth'
import dayjs from 'dayjs'

const COLLECTION_NAME = 'records'
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

