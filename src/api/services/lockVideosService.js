import {fileURLToPath} from 'node:url'
import path, {dirname, resolve} from 'node:path'
import {readJsonCached} from '../util/readJsonCache.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const fixtureLockVideosPath = resolve(currentDir, '../../data/lockVideos.json')

export function getLockVideosPath(env = process.env) {
    const configuredDir = env.COLLECTION_API_DIR?.trim()
    if (configuredDir) {
        if (!path.isAbsolute(configuredDir)) {
            const error = new Error('COLLECTION_API_DIR must be an absolute path')
            error.code = 'lock_videos_path_invalid'
            throw error
        }
        return path.join(path.normalize(configuredDir), 'lockVideos.json')
    }
    if (env.NODE_ENV === 'production') {
        const error = new Error('COLLECTION_API_DIR is required in production')
        error.code = 'lock_videos_path_missing'
        throw error
    }
    return fixtureLockVideosPath
}

function createLockVideosNotFoundError() {
    const error = new Error('Lock videos not found')
    error.status = 404
    error.code = 'lock_videos_not_found'
    return error
}

function publicVideo(video) {
    return {
        userId: video.userId,
        pickerName: video.pickerName,
        pickerIsBlackBelt: video.pickerIsBlackBelt,
        url: video.url
    }
}

export async function getLockVideosResponse(
    lockId,
    env = process.env,
    now = () => new Date()
) {
    const source = await readJsonCached(getLockVideosPath(env))
    const videos = source.lockVideos?.[lockId]
    if (!Array.isArray(videos)) throw createLockVideosNotFoundError()

    return {
        metadata: {
            source: 'generated-summary',
            fetchedDateTime: now().toISOString()
        },
        data: {
            lockId,
            videos: videos.map(publicVideo)
        }
    }
}
