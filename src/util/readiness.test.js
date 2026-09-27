import {describe, expect, it, vi} from 'vitest'
import {createReadinessController} from './readiness.js'

function response() {
    const res = {
        status: vi.fn(() => res),
        json: vi.fn(value => value)
    }
    return res
}

const releaseMetadata = {releaseId: 'release-1', gitSha: 'a'.repeat(40)}

describe('createReadinessController', () => {
    it('reports startup and shutdown states with the release identity', async () => {
        const controller = createReadinessController({releaseMetadata, environment: 'development'})
        const startingResponse = response()
        await controller.handler({}, startingResponse)
        expect(startingResponse.status).toHaveBeenCalledWith(503)
        expect(startingResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            ready: false,
            reason: 'starting',
            releaseId: 'release-1'
        }))

        controller.markReady()
        const readyResponse = response()
        await controller.handler({}, readyResponse)
        expect(readyResponse.json).toHaveBeenCalledWith({
            ready: true,
            releaseId: 'release-1',
            gitSha: 'a'.repeat(40),
            environment: 'development'
        })

        controller.markNotReady()
        const shutdownResponse = response()
        await controller.handler({}, shutdownResponse)
        expect(shutdownResponse.status).toHaveBeenCalledWith(503)
        expect(shutdownResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            ready: false,
            reason: 'shutting_down'
        }))
    })

    it('fails readiness when a required local file is unreadable', async () => {
        const controller = createReadinessController({
            releaseMetadata,
            environment: 'production',
            requiredFiles: ['/generated/collectionStatsByIdFull.json'],
            accessFile: vi.fn().mockRejectedValue(new Error('missing'))
        })
        controller.markReady()
        const res = response()
        await controller.handler({}, res)
        expect(res.status).toHaveBeenCalledWith(503)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            ready: false,
            reason: 'required_file_unavailable',
            releaseId: 'release-1'
        }))
    })
})
