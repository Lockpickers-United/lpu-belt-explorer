const admin = require('firebase-admin')
const serviceAccount = require('../../lpu-belt-explorer-firebase-adminsdk.json')
const {getFirestore} = require('firebase-admin/firestore')
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})


const prod = true


const db = prod ? getFirestore(app) : getFirestore(app, 'lpubelts-dev')

// Custom claims to set
const newClaims = {qaUser:true}

// List of user IDs to update
const users = [
    {uid: 'GGplAdctTfVDLVvYsfIADJmfp8f2', name: 'mgsecure'}
]

const team = [ // eslint-disable-line
    {uid: 'GGplAdctTfVDLVvYsfIADJmfp8f2', name: 'mgsecure'},
    {uid: '4qqxB0nW8dczUws5XuAyhEkgZEj2', name: 'mgtest'},
    {uid: 'WMSvvuutyShfvBBYB3PmDe4fmeS2', name: 'NiXXeD'},
    {uid: 'BJyWOIOsqmRDkgHZBqIEGbGnVSA3', name: 'tonysansan'},
    {uid: 'mZyfQIARjCP1uJJJc7ioMAALV9v2', name: 'peace'},
    {uid: 'XoUDXU5McjTuVnPA1xfmzytcKuy2', name: 'Red Wanderer'},

]

async function updateCustomClaimsForUsers() {
    for (const user of users) {
        const {uid, name} = user
        try {
            const userRecord = await admin.auth().getUser(uid)
            const currentClaims = userRecord.customClaims || {}
            delete currentClaims.lpuMod
            const updatedClaims = {...currentClaims, ...newClaims}
            await admin.auth().setCustomUserClaims(uid, updatedClaims)

            const ref = db.doc(`/user-claims-info/${uid}`)
            await ref.set({...updatedClaims, name})

            console.log(`Updated custom claims for user ${uid} (${userRecord.displayName})`, updatedClaims)
        } catch (error) {
            console.error(`Error updating custom claims for user ${uid}:`, error)
        }
    }
    console.log('Finished updating custom claims for all users.')
    process.exit(0) // Exit process after finishing
}

async function getCustomClaimsForUsers() {
    for (const user of users) {
        const {uid, name} = user
        await admin.auth().getUser(uid)
            .then(userRecord => {
                console.log('Custom claims for user', uid, `(${name})`, userRecord.customClaims)
            })
            .catch(error => {
                console.error('Error fetching user data:', error)
            })
    }
    console.log('Finished logging custom claims for all users.')
    process.exit(0) // Exit process after finishing
}

// Execute the functions
updateCustomClaimsForUsers().then(() => {
    getCustomClaimsForUsers().then()
})


