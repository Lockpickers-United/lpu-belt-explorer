import {spawn} from 'node:child_process'
import {createRequire} from 'node:module'
import {dirname, join} from 'node:path'

// Start both watchers together; sequential npm workspace scripts block on the first watcher.
const children = ['web', 'api'].map(workspace => {
    const directory = new URL(`../apps/${workspace}/`, import.meta.url)
    const require = createRequire(new URL('package.json', directory))
    const cli = join(dirname(require.resolve('vitest/package.json')), 'vitest.mjs')
    const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
        cwd: directory,
        stdio: 'inherit'
    })
    child.on('error', error => {
        console.error(`Unable to start ${workspace} tests:`, error)
        process.exitCode ||= 1
    })
    child.on('exit', (code, signal) => {
        if (code !== 0 || signal) process.exitCode ||= 1
    })
    return child
})

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => {
        for (const child of children) child.kill(signal)
        process.exitCode = signal === 'SIGINT' ? 130 : 143
    })
}
