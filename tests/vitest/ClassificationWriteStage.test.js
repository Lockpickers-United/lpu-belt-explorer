import {afterEach, describe, expect, it, vi} from 'vitest'

afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
})

describe('classification frontend write stages', () => {
    it.each([
        ['read', false, false, false],
        ['vote', true, false, false],
        ['action', true, true, false],
        ['publish', true, true, true],
        ['invalid', false, false, false]
    ])('%s permits only its stage and earlier stages', async (stage, vote, action, publish) => {
        vi.stubEnv('VITE_CLASSIFICATION_WRITE_STAGE', stage)
        vi.resetModules()
        const permissions = await import('../../src/classification/writeStage.js')
        expect(permissions.canWriteVotes).toBe(vote)
        expect(permissions.canWriteActions).toBe(action)
        expect(permissions.canPublishClassification).toBe(publish)
    })
})
