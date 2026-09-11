import {fileURLToPath} from 'node:url'
import {dirname, resolve} from 'node:path'
import {readJsonCached} from '../util/readJsonCache.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const collectionStatsPath = resolve(currentDir, '../../data/collectionStatsByIdFull.json')

async function getCollectionStats() {
    return readJsonCached(collectionStatsPath)
}

function withLocks(source, locks) {
    return {
        metadata: source.metadata,
        data: {
            locks
        }
    }
}

export async function getAllLockCollectionStats() {
    return getCollectionStats()
}

export async function getOwnLockCollectionStats() {
    const source = await getCollectionStats()
    const locks = source.data.locks.map(lock => ({
        id: lock.id,
        name: lock.name,
        ownCount: lock.ownCount
    }))
    return withLocks(source, locks)
}

export async function getScorecardLockCollectionStats() {
    const source = await getCollectionStats()
    const locks = source.data.locks.map(lock => ({
        id: lock.id,
        name: lock.name,
        scorecardCount: lock.scorecardCount
    }))
    return withLocks(source, locks)
}

export async function getWishlistLockCollectionStats() {
    const source = await getCollectionStats()
    const locks = source.data.locks.map(lock => ({
        id: lock.id,
        name: lock.name,
        wishlistCount: lock.wishlistCount
    }))
    return withLocks(source, locks)
}
