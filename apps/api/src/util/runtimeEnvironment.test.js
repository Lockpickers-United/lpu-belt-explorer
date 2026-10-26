import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {loadRuntimeEnvironment, validEnvironments} from './runtimeEnvironment.js'

const temporaryDirectories = []

async function createEnvironmentDirectory(files) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'runtime-environment-'))
    temporaryDirectories.push(directory)
    await Promise.all(Object.entries(files).map(([environment, contents]) =>
        fs.writeFile(path.join(directory, `.env.${environment}`), contents)))
    return directory
}

afterEach(async () => {
    vi.restoreAllMocks()
    await Promise.all(temporaryDirectories.splice(0).map(directory =>
        fs.rm(directory, {recursive: true, force: true})))
})

describe('loadRuntimeEnvironment', () => {
    it.each(['local', 'development', 'production'])(
        'loads the %s environment from the configured directory',
        environment => {
            const env = {NODE_ENV: environment}
            const loadEnvironment = vi.fn().mockReturnValue({parsed: {}})

            const result = loadRuntimeEnvironment({
                env,
                envDir: '/srv/lpu/app',
                loadEnvironment
            })

            expect(loadEnvironment).toHaveBeenCalledWith({
                path: path.join('/srv/lpu/app', `.env.${environment}`),
                processEnv: env,
                override: false,
                quiet: true
            })
            expect(result).toEqual({
                environment,
                envPath: path.join('/srv/lpu/app', `.env.${environment}`),
                loaded: true
            })
        }
    )

    it.each(['local', 'development', 'production'])(
        'loads only the real .env.%s file without configuration output',
        async environment => {
            const envDir = await createEnvironmentDirectory({
                local: 'LOADED_ENV=local\n',
                development: 'LOADED_ENV=development\n',
                production: 'LOADED_ENV=production\n'
            })
            const env = {NODE_ENV: environment}
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

            const result = loadRuntimeEnvironment({env, envDir})

            expect(result).toEqual({
                environment,
                envPath: path.join(envDir, `.env.${environment}`),
                loaded: true
            })
            expect(env).toMatchObject({NODE_ENV: environment, LOADED_ENV: environment})
            expect(consoleError).not.toHaveBeenCalled()
        }
    )

    it('parses supported values into the supplied environment without replacing shell values', async () => {
        const envDir = await createEnvironmentDirectory({
            local: [
                'NODE_ENV=production',
                'QUOTED_HASH="kept # value"',
                'UNQUOTED_HASH=trimmed # comment',
                'ESCAPED_MULTILINE="line one\\nline two"',
                'LITERAL_MULTILINE="line one',
                'line two"',
                'EXISTING_VALUE=file',
                'FILE_ONLY_VALUE=loaded'
            ].join('\n')
        })
        const env = {EXISTING_VALUE: 'shell'}

        const result = loadRuntimeEnvironment({env, envDir})

        expect(result.environment).toBe('local')
        expect(env.NODE_ENV).toBe('local')
        expect(env.QUOTED_HASH).toBe('kept # value')
        expect(env.UNQUOTED_HASH).toBe('trimmed')
        expect(env.ESCAPED_MULTILINE).toBe('line one\nline two')
        expect(env.LITERAL_MULTILINE).toBe('line one\nline two')
        expect(env.EXISTING_VALUE).toBe('shell')
        expect(env.FILE_ONLY_VALUE).toBe('loaded')
    })

    it('allows an explicit override while preserving the selected environment', async () => {
        const envDir = await createEnvironmentDirectory({
            development: 'NODE_ENV=production\nEXISTING_VALUE=file\n'
        })
        const env = {NODE_ENV: 'development', EXISTING_VALUE: 'shell'}

        const result = loadRuntimeEnvironment({env, envDir, override: true})

        expect(result.environment).toBe('development')
        expect(env.NODE_ENV).toBe('development')
        expect(env.EXISTING_VALUE).toBe('file')
    })

    it('rejects environments outside the supported set before loading a file', () => {
        const loadEnvironment = vi.fn()

        expect(() => loadRuntimeEnvironment({
            env: {NODE_ENV: 'test'},
            loadEnvironment
        })).toThrowError(expect.objectContaining({code: 'runtime_environment_invalid'}))
        expect(loadEnvironment).not.toHaveBeenCalled()
        expect(validEnvironments).toEqual(new Set(['local', 'development', 'production']))
    })

    it('reports a missing environment file without logging its path', async () => {
        const envDir = await createEnvironmentDirectory({})
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(() => loadRuntimeEnvironment({
            env: {NODE_ENV: 'development'},
            envDir
        })).toThrowError(expect.objectContaining({
            code: 'runtime_environment_file_unavailable',
            cause: expect.objectContaining({code: 'ENOENT'})
        }))
        expect(consoleError).not.toHaveBeenCalled()
    })
})
