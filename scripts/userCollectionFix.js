import fs from 'fs'
import {initializeApp, cert} from 'firebase-admin/app'
import {getFirestore} from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json'))
const app = initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})

////////////////////////////////////////////////////
//
// For changelog migrations, see processChangelog.js
//
////////////////////////////////////////////////////


// change to (default) and true for production
// const db = getFirestore(app, 'lpubelts-dev')

const db = getFirestore(app)

const WRITE_TO_DB = false

// Update userIds to find & remove duplicate IDs
const userIds = ['1dlgPlIKx1dmCO3SH8axvWDbqZB2']
await removeDuplicates()

// Update these variables to restore a user's data
const userId = 'GGplAdctTfVDLVvYsfIADJmfp8f2'
const data = {}
// await replaceProfile()


async function removeDuplicates() {
    let hasUpdates = false
    const batch = db.batch()

    for (const userId of userIds) {
        console.log('processing user:', userId)
        const docRef = db.collection('lockcollections').doc(userId)
        const profile = await docRef.get()

        if (!profile.exists) {
            console.error('no profile for:', userId)
            return
        }

        const profileData = profile.data()
        console.log('current profile:', profileData)

        const collectionTypes = ['own', 'picked', 'wishlist']

        for (const type of collectionTypes) {
            const currentList = profileData[type]

            if (!Array.isArray(currentList)) {
                continue
            }

            const duplicateIds = getDuplicateValues(currentList)

            if (duplicateIds.length > 0) {
                console.log(`    duplicate ids found in ${type}:`, duplicateIds)
                console.log('    current count', currentList.length)
                const deduplicatedList = [...new Set(currentList)]
                console.log('    depupe count', deduplicatedList.length)
                batch.set(docRef, {[type]: deduplicatedList}, {merge: true})
                hasUpdates = true
                console.log('    duplicates removed for:', userId, type)
            }
        }
    }
    if (hasUpdates) {
        if (WRITE_TO_DB) {
            await batch.commit()
        } else {
            console.log('WRITE_TO_DB is false, no changes made')
        }
    } else {
        console.log('    no duplicates found')
    }
}

async function replaceProfile() {
    const profile = await db.collection('lockcollections').doc(userId).get()
    if (profile.exists) {
        console.log('current profile:', profile.data())
        if (WRITE_TO_DB) {
            //await db.collection('lockcollections').doc(userId).set(data)
            console.log('new profile:', data)
        } else {
            console.log('WRITE_TO_DB is false, no changes made')
        }
    } else {
        console.error('no profile for:', userId)
    }
}

export function getDuplicateValues(array) {
    const seen = new Set()
    const duplicates = new Set()

    array.forEach(value => {
        if (seen.has(value)) {
            duplicates.add(value)
        } else {
            seen.add(value)
        }
    })

    return [...duplicates]
}
