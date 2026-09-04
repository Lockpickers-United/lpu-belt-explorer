import {getFirestoreDb} from './firebaseAdmin.js'

const profileCollection = 'lockcollections'
const profileCacheTtlMs = 60_000
const missingProfileCacheTtlMs = 10_000
const maxProfileCacheEntries = 1_000
const profileCache = new Map()

const summaryCollections = {
    safelocksOwn: 'safelocksOwn',
    scorecard: 'recordedLocks',
    own: 'own',
    wishlist: 'wishlist',
    picked: 'picked',
}

function createUserProfileNotFoundError() {
    const err = new Error('User profile not found')
    err.status = 404
    err.code = 'user_profile_not_found'
    return err
}

function pruneProfileCache(now = Date.now()) {
    for (const [userId, entry] of profileCache.entries()) {
        if (entry.expiresAt <= now) {
            profileCache.delete(userId)
        }
    }

    while (profileCache.size > maxProfileCacheEntries) {
        const oldestUserId = profileCache.keys().next().value
        profileCache.delete(oldestUserId)
    }
}

function setProfileCacheEntry(userId, entry) {
    profileCache.set(userId, entry)
    pruneProfileCache()
}

async function getRawUserProfile(userId) {
    const now = Date.now()
    const cached = profileCache.get(userId)
    if (cached && cached.expiresAt > now) {
        if (cached.notFound) throw createUserProfileNotFoundError()
        return cached.profile
    }

    if (cached) profileCache.delete(userId)

    const db = await getFirestoreDb()
    const profile = await db.collection(profileCollection).doc(userId).get()

    if (!profile.exists) {
        setProfileCacheEntry(userId, {
            notFound: true,
            expiresAt: now + missingProfileCacheTtlMs
        })
        throw createUserProfileNotFoundError()
    }

    const profileData = profile.data() || {}
    setProfileCacheEntry(userId, {
        profile: profileData,
        expiresAt: now + profileCacheTtlMs
    })

    return profileData
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
    const {displayName} = profile

    Object.entries(summaryCollections).forEach(([responseName, profileName]) => {
        collections[responseName] = listValue(profile[profileName])
    })

    return {
        metadata: firebaseMetadata(),
        data: {
            userId,
            displayName,
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

export function clearUserProfileCache() {
    profileCache.clear()
}

export function getUserProfileCacheStats() {
    pruneProfileCache()
    return {
        size: profileCache.size,
        ttlMs: profileCacheTtlMs,
        missingTtlMs: missingProfileCacheTtlMs,
        maxEntries: maxProfileCacheEntries
    }
}
