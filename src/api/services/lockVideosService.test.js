import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it} from 'vitest'
import {
    getLockVideosPath,
    getLockVideosResponse
} from './lockVideosService.js'

const temporaryDirectories = []

afterEach(async () => {
    await Promise.all(temporaryDirectories.splice(0).map(directory =>
        fs.rm(directory, {recursive: true, force: true})))
})

async function createFixture(data) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'lock-videos-'))
    temporaryDirectories.push(directory)
    await fs.writeFile(path.join(directory, 'lockVideos.json'), JSON.stringify(data))
    return {NODE_ENV: 'development', COLLECTION_API_DIR: directory}
}

describe('lock videos generated-data contract', () => {
    it('returns the requested lock videos with Firebase response metadata', async () => {
        const env = await createFixture({
            metadata: {updatedDateTime: '2026-09-28 15:15'},
            lockVideos: {
                '19573781': [{
                    userId: 'user-1',
                    pickerName: 'Picker One',
                    pickerIsBlackBelt: true,
                    url: 'https://youtu.be/example'
                }]
            }
        })

        await expect(getLockVideosResponse(
            '19573781',
            env,
            () => new Date('2026-09-28T22:15:46.730Z')
        )).resolves.toEqual({
            metadata: {
                source: 'generated-summary',
                fetchedDateTime: '2026-09-28T22:15:46.730Z'
            },
            data: {
                lockId: '19573781',
                videos: [{
                    userId: 'user-1',
                    pickerName: 'Picker One',
                    pickerIsBlackBelt: true,
                    url: 'https://youtu.be/example'
                }]
            }
        })
    })

    it('returns a stable not-found error for a lock without videos', async () => {
        const env = await createFixture({lockVideos: {}})

        await expect(getLockVideosResponse('missing-lock', env)).rejects.toMatchObject({
            status: 404,
            code: 'lock_videos_not_found'
        })
    })

    it('does not silently use the checked-in fixture in production', () => {
        expect(() => getLockVideosPath({NODE_ENV: 'production'}))
            .toThrow(/COLLECTION_API_DIR is required/)
    })
})
