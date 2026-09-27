import {spawn} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import {describe, expect, it} from 'vitest'

const childFixture = fileURLToPath(
    new URL('./testing/processLifecycleChild.js', import.meta.url)
)

function runChild(scenario) {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [childFixture, scenario], {
            stdio: ['ignore', 'pipe', 'pipe']
        })
        let stdout = ''
        let stderr = ''
        const timeout = setTimeout(() => {
            child.kill('SIGKILL')
            reject(new Error(`Lifecycle child timed out for ${scenario}`))
        }, 5_000)

        child.stdout.setEncoding('utf8')
        child.stderr.setEncoding('utf8')
        child.stdout.on('data', chunk => {
            stdout += chunk
        })
        child.stderr.on('data', chunk => {
            stderr += chunk
        })
        child.once('error', reject)
        child.once('close', (code, signal) => {
            clearTimeout(timeout)
            resolve({code, signal, stdout, stderr})
        })
    })
}

function outputEvents(result) {
    return result.stdout.trim().split('\n').filter(Boolean).map(JSON.parse)
}

describe('fatal process lifecycle', () => {
    it.each([
        ['uncaughtException', 'uncaught_exception'],
        ['unhandledRejection', 'unhandled_rejection'],
        ['serverError', 'server_error']
    ])('exits nonzero after %s', async (scenario, reason) => {
        const result = await runChild(scenario)
        const events = outputEvents(result)

        expect(result).toMatchObject({code: 1, signal: null, stderr: ''})
        expect(events).toContainEqual({event: 'not-ready', reason})
        expect(events).toContainEqual({
            level: 'fatal',
            message: 'fatal process error',
            reason
        })
        expect(events).toContainEqual({event: 'server-close'})
        expect(events).toContainEqual({event: 'close-idle-connections'})
        if (scenario === 'uncaughtException') {
            expect(events).toContainEqual({
                level: 'error',
                message: 'server drain timed out',
                reason
            })
        }
    })
})
