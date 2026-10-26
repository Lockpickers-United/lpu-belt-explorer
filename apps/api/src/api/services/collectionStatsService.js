import {fileURLToPath} from 'node:url'
import path, {dirname, resolve} from 'node:path'
import {readJsonCached} from '../util/readJsonCache.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const fixtureCollectionStatsPath = resolve(currentDir, '../../data/collectionStatsByIdFull.json')

export function getCollectionStatsPath(env = process.env) {
    const configuredDir = env.COLLECTION_API_DIR?.trim()
    if (configuredDir) {
        if (!path.isAbsolute(configuredDir)) {
            const error = new Error('COLLECTION_API_DIR must be an absolute path')
            error.code = 'collection_stats_path_invalid'
            throw error
        }
        return path.join(path.normalize(configuredDir), 'collectionStatsByIdFull.json')
    }
    if (env.NODE_ENV === 'production') {
        const error = new Error('COLLECTION_API_DIR is required in production')
        error.code = 'collection_stats_path_missing'
        throw error
    }
    return fixtureCollectionStatsPath
}

async function getCollectionStats(env) {
    return readJsonCached(getCollectionStatsPath(env))
}

function withLocks(source, locks) {
    return {
        metadata: source.metadata,
        data: {
            locks
        }
    }
}

export async function getAllLockCollectionStats(env) {
    return getCollectionStats(env)
}

export async function getOwnLockCollectionStats(env) {
    const source = await getCollectionStats(env)
    const locks = source.data.locks.map(lock => ({
        id: lock.id,
        name: lock.name,
        ownCount: lock.ownCount
    }))
    return withLocks(source, locks)
}

export async function getScorecardLockCollectionStats(env) {
    const source = await getCollectionStats(env)
    const locks = source.data.locks.map(lock => ({
        id: lock.id,
        name: lock.name,
        scorecardCount: lock.scorecardCount
    }))
    return withLocks(source, locks)
}

export async function getWishlistLockCollectionStats(env) {
    const source = await getCollectionStats(env)
    const locks = source.data.locks.map(lock => ({
        id: lock.id,
        name: lock.name,
        wishlistCount: lock.wishlistCount
    }))
    return withLocks(source, locks)
}
