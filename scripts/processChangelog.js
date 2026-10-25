import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json'))
const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

////////////////////////////////////////////////

const dev = true
const requireApproved = true
const WRITE_TO_DB = false

////////////////////////////////////////////////

const db = dev
    ? getFirestore(app, 'lpubelts-dev')
    : getFirestore(app)

// set to desired id mapping
// { 'old ID': 'new ID' }

const updates = {
    changes: [
        {
            approved: false,
            from: '7f0799ab',
            fromName: 'ABUS 60/30',
            to: '562e964e',
            toName: 'Master Lock #3'
        }
    ],
    deletions: [
        {
            approved: true,
            id: 'bfc7c700',
            name: 'BAB IKON P0'
        }
    ]
}

const changeIds = updates.changes
    .filter(change => change.approved || !requireApproved)
    .map(change => change.from)

const idsToDelete = updates.deletions.map(change => change.id)

///////////////////////////////////////////////////////
// update old => new projectIds in evidence collection
// note: we do not delete any evidence records

console.log('Checking for evidence updates')
if (changeIds.length > 0) {
    console.log(`- ${changeIds.length} change${changeIds.length === 1 ? '' : 's'} to process`)

    const evidDocs = await db.collection('evidence').where('projectId', 'in', changeIds).get()
    let impactedUsers = []
    const evidBatch = db.batch()
    evidDocs.forEach(rec => {
        const oldId = rec.data().projectId
        const newId = updates.changes.find(change => change.from === oldId).to
        impactedUsers.push(rec.data().userId)
        console.log(`user ${rec.data().userId} evidence ${rec.ref.id} projectId: ${oldId} => ${newId}`)
        evidBatch.update(rec.ref, {projectId: newId})
    })
    if (WRITE_TO_DB) {
        await evidBatch.commit()
    }

// clear all impacted users from the query cache

    if (impactedUsers.length > 0) {
        console.log(`- ${impactedUsers.length} user${impactedUsers.length === 1 ? '' : 's'} to process`)
        const cacheKeys = [...new Set(impactedUsers)].map(id => `activity: userId == ${id}`)
        const cacheBatch = db.batch()
        cacheKeys.forEach(key => {
            const ref = db.collection('query-cache').doc(key)
            console.log(`query-cache clear ${key}`)
            cacheBatch.delete(ref)
        })
        if (WRITE_TO_DB) {
            await cacheBatch.commit()
        }
    } else {
        console.log('- No matching evidence found')
    }
} else {
    console.log(`- No${requireApproved ? ' approved' : ''} changes to process`)
}

// update old => new projectIds in the various collection arrays

// Note that while it is simple to collapse this loop into a 
// single query and batch update, firestore has a max limit of 
// 30 disjunctions. We therefore choose to scale by number of 
// id changes, rather than collection types x id changes, which 
// would quickly reach the maximum.

console.log('\nChecking for collection updates')
console.log(`- ${changeIds.length} change${changeIds.length === 1 ? '' : 's'} to process`)
console.log(`- ${idsToDelete.length} deletion${idsToDelete.length === 1 ? '' : 's'} to process`)
console.log(' ')

const targetIds = [...changeIds, ...idsToDelete]

if (targetIds.length > 0) {

    const collectionTypes = ['own', 'picked', 'recorded', 'recordedLocks', 'wishlist']
    for (let idx = 0; idx < collectionTypes.length; idx++) {
        const type = collectionTypes[idx]
        const collectDocs = await db.collection('lockcollections').where(type, 'array-contains-any', targetIds).get()
        const collectBatch = db.batch()
        collectDocs.forEach(rec => {
            const newCollection = rec.data()[type]
                .map(id => updates.changes.find(change => change.from === id)?.to
                    ? updates.changes.find(change => change.from.id === id)?.to
                    : id)
            const newCollectionSet = new Set(newCollection.filter(id => !idsToDelete.includes(id)))
            console.log(`lockcollections ${rec.ref.id} ${type} - ${WRITE_TO_DB ? '' : 'would have been'} updated`)
            collectBatch.update(rec.ref, {[type]: [...newCollectionSet]})
        })
        if (WRITE_TO_DB) {
            await collectBatch.commit()
        }
    }

} else {
    console.log('no collection changes to make')
}