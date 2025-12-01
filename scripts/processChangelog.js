import fs from 'fs'
import admin from 'firebase-admin'
import {getFirestore} from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json'))
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

////////////////////////////////////////////////
// change to (default) and true for production

//const db = getFirestore(app, 'lpubelts-dev')
const db = getFirestore(app)

const WRITE_TO_DB = true

// set to desired id mapping
// { 'old ID': 'new ID' }

const newIdFromOld = {
    '82ae66ad': 'dd6a3683',
}
////////////////////////////////////////////////


// update old => new projectIds in evidence collection 

const evidDocs = await db.collection('evidence').where('projectId', 'in', Object.keys(newIdFromOld)).get()
let impactedUsers = []
const evidBatch = db.batch()
evidDocs.forEach(rec => {
    const oldId = rec.data().projectId
    const newId = newIdFromOld[oldId]
    impactedUsers.push(rec.data().userId)
    console.log(`user ${rec.data().userId} evidence ${rec.ref.id} projectId: ${oldId} => ${newId}`)
    evidBatch.update(rec.ref, {projectId: newId})    
})
if (WRITE_TO_DB) {
    await evidBatch.commit()
}

// clear all impacted users from the query cache

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

// update old => new projectIds in the various collection arrays

// Note that while it is simple to collapse this loop into a 
// single query and batch update, firestore has a max limit of 
// 30 disjunctions. We therefore choose to scale by number of 
// id changes, rather than collection types x id changes, which 
// would quickly reach the maximum.

const collectionTypes = ['own', 'picked', 'recorded', 'recordedLocks', 'wishlist']
for (let idx=0; idx < collectionTypes.length; idx++) {
    const type = collectionTypes[idx]  
    const collectDocs = await db.collection('lockcollections').where(type, 'array-contains-any', Object.keys(newIdFromOld)).get()
    const collectBatch = db.batch()
    collectDocs.forEach(rec => {
        const newCollection = rec.data()[type].map(id => newIdFromOld[id] ? newIdFromOld[id] : id)
        console.log(`lockcollections ${rec.ref.id} ${type} updated`)
        collectBatch.update(rec.ref, {[type]: newCollection})
    })
    if (WRITE_TO_DB) {
        await collectBatch.commit()
    }
}
