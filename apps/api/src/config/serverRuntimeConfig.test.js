import {describe, expect, it} from 'vitest'
import {loadServerRuntimeConfig} from './serverRuntimeConfig.js'

function validEnv(overrides = {}) {
    return {
        NODE_ENV: 'development',
        LPU_JOB_ENV: 'development',
        API_PORT: '8081',
        HOST: '127.0.0.1',
        CORS_ORIGIN: 'https://dev.example.com',
        TRUST_PROXY: 'loopback',
        COLLECTION_API_DIR: '/srv/lpubelts/shared/generated-data',
        ...overrides
    }
}

describe('loadServerRuntimeConfig', () => {
    it('normalizes a complete configuration', () => {
        expect(loadServerRuntimeConfig(validEnv())).toEqual({
            environment: 'development',
            port: 8081,
            host: '127.0.0.1',
            corsOrigin: ['https://dev.example.com'],
            trustProxy: ['loopback'],
            collectionApiDir: '/srv/lpubelts/shared/generated-data',
            collectionStatsPath: '/srv/lpubelts/shared/generated-data/collectionStatsByIdFull.json',
            lockVideosPath: '/srv/lpubelts/shared/generated-data/lockVideos.json'
        })
    })

    it.each([undefined, '', '0', '65536', '8.5', 'port'])(
        'rejects invalid API_PORT %s',
        API_PORT => {
            expect(() => loadServerRuntimeConfig(validEnv({API_PORT}))).toThrow(/API_PORT/)
        }
    )

    it('requires an explicit production CORS allowlist', () => {
        expect(() => loadServerRuntimeConfig(validEnv({
            NODE_ENV: 'production',
            LPU_JOB_ENV: 'production',
            CORS_ORIGIN: ''
        }))).toThrow(/CORS_ORIGIN is required/)
    })

    it('requires an explicit listen host', () => {
        expect(() => loadServerRuntimeConfig(validEnv({HOST: ''}))).toThrow(/HOST/)
        expect(() => loadServerRuntimeConfig(validEnv({HOST: 'https://127.0.0.1'})))
            .toThrow(/HOST must be a hostname or IP address/)
    })

    it.each(['*', 'example.com', 'https://example.com/path', 'https://user@example.com'])(
        'rejects unsafe CORS origin %s',
        CORS_ORIGIN => {
            expect(() => loadServerRuntimeConfig(validEnv({CORS_ORIGIN}))).toThrow(/CORS_ORIGIN/)
        }
    )

    it('permits open development CORS when no allowlist is configured', () => {
        expect(loadServerRuntimeConfig(validEnv({CORS_ORIGIN: undefined})).corsOrigin).toBe(true)
    })

    it('rejects contradictory runtime and data environments', () => {
        expect(() => loadServerRuntimeConfig(validEnv({LPU_JOB_ENV: 'production'})))
            .toThrow(/must match NODE_ENV/)
    })

    it('requires an absolute collection API directory', () => {
        expect(() => loadServerRuntimeConfig(validEnv({COLLECTION_API_DIR: 'generated-data'})))
            .toThrow(/COLLECTION_API_DIR must be an absolute path/)
    })
})
