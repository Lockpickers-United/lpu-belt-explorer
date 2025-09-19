import fs from 'fs'
import {setDeep} from '../src/util/setDeep.js'


import admin from 'firebase-admin'
import {getFirestore} from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(fs.readFileSync('/Users/nealbayless/Documents/GitHub/keys/lpu-belt-explorer-firebase-adminsdk.json', 'utf8'))
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})
const db = getFirestore(app, 'lpubelts-dev')

const allScorecardEvidence = JSON.parse(fs.readFileSync('./allScorecardEvidence.json', 'utf8'))

const userNotes = allScorecardEvidence.reduce((acc, evidence) => {
    if (evidence.evidenceNotes && evidence.evidenceNotes.trim() !== '' && evidence.userId === 'GGplAdctTfVDLVvYsfIADJmfp8f2') {
        setDeep(acc, [evidence.userId, evidence.projectId], evidence.evidenceNotes)
    }
    return acc
}, {})

console.log('userNotes', userNotes)
console.log('users', Object.keys(userNotes).length)

process.exit(0)

Object.keys(userNotes).forEach(async (userId) => {
    await db.collection('lockcollections').doc(userId)
        .update({
            userLockNotes: userNotes[userId],
        })

})