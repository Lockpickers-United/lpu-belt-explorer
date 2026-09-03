import {getFirestoreDb} from './firebaseAdmin.js'

const profileCollection = 'lockcollections'

const summaryCollections = {
    safelocksOwn: 'safelocksOwn',
    scorecard: 'recordedLocks',
    own: 'own',
    wishlist: 'wishlist'
}

async function getRawUserProfile(userId) {
    const db = await getFirestoreDb()
    const profile = await db.collection(profileCollection).doc(userId).get()

    if (!profile.exists) {
        const err = new Error('User profile not found')
        err.status = 404
        err.code = 'user_profile_not_found'
        throw err
    }

    return profile.data() || {}
}

function listValue(value) {
    return Array.isArray(value) ? value : []
}

function firebaseMetadata() {
    return {
        source: 'firebase',
        fetchedDateTime: new Date().toISOString()
    }
}

export async function getUserSummary(userId) {
    const profile = await getRawUserProfile(userId)
    const collections = {}

    Object.entries(summaryCollections).forEach(([responseName, profileName]) => {
        collections[responseName] = listValue(profile[profileName])
    })

    return {
        metadata: firebaseMetadata(),
        data: {
            userId,
            collections
        }
    }
}

export async function getUserWishlist(userId) {
    const profile = await getRawUserProfile(userId)
    return {
        metadata: firebaseMetadata(),
        data: {
            userId,
            wishlist: listValue(profile.wishlist)
        }
    }
}

export async function getUserProfileResponse(userId) {
    const profile = await getRawUserProfile(userId)
    return {
        metadata: firebaseMetadata(),
        data: {
            userId,
            profile
        }
    }
}
