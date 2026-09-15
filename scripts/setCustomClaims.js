import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json'))
const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

// change to (default) and true for production
// const db = getFirestore(app, 'lpubelts-dev')

const db = getFirestore(app)

const WRITE_TO_DB = true

// Custom claims to set
const _allClaims = {
    admin: true,
    raflAdmin: true,
    qaUser:true,
    dataAdmin:true    // can write to firebase: data-cache
}
//const newClaims = {raflAdmin:true, dataAdmin:true}
const newClaims = {}
const removeClaims = ['qaUser']

const users = [
    {uid: '4qqxB0nW8dczUws5XuAyhEkgZEj2', name: 'mgtest'},
]

const _allUsers = [
    {uid: 'GGplAdctTfVDLVvYsfIADJmfp8f2', name: 'mgsecure'},
    {uid: '4qqxB0nW8dczUws5XuAyhEkgZEj2', name: 'mgtest'},
    {uid: 'WMSvvuutyShfvBBYB3PmDe4fmeS2', name: 'NiXXeD'},
    {uid: 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3', name: 'tonysansan'},
    {uid: 'mZyfQIARjCP1uJJJc7ioMAALV9v2', name: 'peace'},
    {uid: 'XoUDXU5McjTuVnPA1xfmzytcKuy2', name: 'Red Wanderer'},
    {uid: '84dULJFIN4bHIC1LxCiuvBCSqT43', name: 'todd'},
    {uid: 'Hqww5ljRCfQjMppspbvFZsZ5xQI2', name: 'CorrectJeans'},

]

async function updateCustomClaimsForUsers() {
    for (const user of users) {
        const {uid, name} = user
        try {
            const userRecord = await getAuth().getUser(uid)
            const currentClaims = userRecord.customClaims || {}
            for (const claim of removeClaims) {
                delete currentClaims[claim]
            }
            delete currentClaims.lpuMod
            const updatedClaims = {...currentClaims, ...newClaims}
            if (WRITE_TO_DB) await getAuth().setCustomUserClaims(uid, updatedClaims)

            const ref = db.doc(`/user-claims-info/${uid}`)
            await ref.set({...updatedClaims, name})

            console.log(`${WRITE_TO_DB ? 'Updated' :'WRITE_TO_DB is off, not saving'} custom claims for user ${uid} (${userRecord.displayName})`, updatedClaims)
        } catch (error) {
            console.error(`Error updating custom claims for user ${uid}:`, error)
        }
    }
    console.log('Finished updating custom claims for all users.')
    process.exit(0)
}

async function getCustomClaimsForUsers() {
    for (const user of users) {
        const {uid, name} = user
        await getAuth().getUser(uid)
            .then(userRecord => {
                console.log('Custom claims for user', uid, `(${name})`, userRecord.customClaims)
            })
            .catch(error => {
                console.error('Error fetching user data:', error)
            })
    }
    console.log('Finished logging custom claims for all users.')
    process.exit(0)
}

updateCustomClaimsForUsers().then(() => {
    getCustomClaimsForUsers().then()
})


