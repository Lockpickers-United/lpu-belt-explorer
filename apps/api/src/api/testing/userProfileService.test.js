import {beforeEach, describe, expect, it, vi} from 'vitest'
import {getFirestoreDb} from '../services/firebaseAdmin.js'
import {
    clearUserProfileCache,
    getUserProfileCacheStats,
    getUserSummary,
    getUserWishlist
} from '../services/userProfileService.js'

vi.mock('../services/firebaseAdmin.js', () => ({
    getFirestoreDb: vi.fn()
}))

function mockFirestoreProfile(getMock) {
    const doc = vi.fn(() => ({get: getMock}))
    const collection = vi.fn(() => ({doc}))
    getFirestoreDb.mockResolvedValue({collection})

    return {collection, doc}
}

describe('userProfileService cache', () => {
    beforeEach(() => {
        clearUserProfileCache()
        vi.clearAllMocks()
        vi.useRealTimers()
    })

    it('reuses one Firestore document read across public user response helpers', async () => {
        const getMock = vi.fn().mockResolvedValue({
            exists: true,
            data: () => ({
                displayName: 'Test User',
                own: ['own-1'],
                recordedLocks: ['scorecard-1'],
                wishlist: ['wishlist-1'],
                picked: ['picked-1']
            })
        })
        const {collection, doc} = mockFirestoreProfile(getMock)

        const summary = await getUserSummary('user-1')
        const wishlist = await getUserWishlist('user-1')

        expect(collection).toHaveBeenCalledTimes(1)
        expect(collection).toHaveBeenCalledWith('lockcollections')
        expect(doc).toHaveBeenCalledTimes(1)
        expect(doc).toHaveBeenCalledWith('user-1')
        expect(getMock).toHaveBeenCalledTimes(1)

        expect(summary.data.displayName).toBe('Test User')
        expect(summary.data.collections.own).toEqual(['own-1'])
        expect(summary.data.collections.scorecard).toEqual(['scorecard-1'])
        expect(wishlist.data.wishlist).toEqual(['wishlist-1'])
    })

    it('refreshes a profile after the cache ttl expires', async () => {
        vi.useFakeTimers()
        vi.setSystemTime(1_000)

        const getMock = vi.fn()
            .mockResolvedValueOnce({
                exists: true,
                data: () => ({displayName: 'First', wishlist: ['first']})
            })
            .mockResolvedValueOnce({
                exists: true,
                data: () => ({displayName: 'Second', wishlist: ['second']})
            })
        mockFirestoreProfile(getMock)

        const first = await getUserWishlist('user-1')
        vi.setSystemTime(62_000)
        const second = await getUserWishlist('user-1')

        expect(getMock).toHaveBeenCalledTimes(2)
        expect(first.data.wishlist).toEqual(['first'])
        expect(second.data.wishlist).toEqual(['second'])
    })

    it('briefly caches missing profiles to reduce repeated enumeration reads', async () => {
        const getMock = vi.fn().mockResolvedValue({exists: false})
        mockFirestoreProfile(getMock)

        await expect(getUserSummary('missing-user')).rejects.toMatchObject({
            status: 404,
            code: 'user_profile_not_found'
        })
        await expect(getUserSummary('missing-user')).rejects.toMatchObject({
            status: 404,
            code: 'user_profile_not_found'
        })

        expect(getMock).toHaveBeenCalledTimes(1)
    })

    it('reports cache configuration stats', () => {
        expect(getUserProfileCacheStats()).toEqual({
            size: 0,
            ttlMs: 60_000,
            missingTtlMs: 10_000,
            maxEntries: 1_000
        })
    })
})
