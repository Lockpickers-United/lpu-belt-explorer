import {execFileSync} from 'node:child_process'
import {mkdtemp, copyFile, writeFile, symlink, rm, realpath} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {afterAll, beforeAll, describe, expect, it} from 'vitest'

const webRoot = process.cwd()
let fixtureRoot

beforeAll(async () => {
    fixtureRoot = await realpath(await mkdtemp(path.join(tmpdir(), 'lpu-web-env-')))
    await copyFile(path.join(webRoot, 'vite.config.js'), path.join(fixtureRoot, 'vite.config.js'))
    await symlink(path.join(webRoot, 'node_modules'), path.join(fixtureRoot, 'node_modules'), 'dir')
    await writeFile(path.join(fixtureRoot, 'package.json'), '{"type":"module"}')
    await writeFile(path.join(fixtureRoot, '.env'), 'VITE_CONFIG_BASE=base\nVITE_CONFIG_LAYER=base\n')
    await writeFile(path.join(fixtureRoot, '.env.local'), 'VITE_CONFIG_LOCAL=local\nVITE_CONFIG_LAYER=local\n')
    await writeFile(path.join(fixtureRoot, '.env.keys'), [
        'VITE_CONFIG_KEY=synthetic-client-key',
        'VITE_CONFIG_PRIORITY=key-file',
        'CONFIG_PRIVATE_KEY=synthetic-private-key'
    ].join('\n'))
    for (const mode of ['development', 'dev', 'test', 'production']) {
        await writeFile(path.join(fixtureRoot, `.env.${mode}`), `VITE_CONFIG_MODE=${mode}\nVITE_CONFIG_LAYER=mode\n`)
        await writeFile(path.join(fixtureRoot, `.env.${mode}.local`), 'VITE_CONFIG_LAYER=mode-local\n')
    }
    await writeFile(path.join(fixtureRoot, 'probe.mjs'), `
        import {resolveConfig} from 'vite'
        const config = await resolveConfig({
            root: ${JSON.stringify(fixtureRoot)},
            configFile: ${JSON.stringify(path.join(fixtureRoot, 'vite.config.js'))},
            mode: process.argv[2]
        }, 'build')
        console.log(JSON.stringify({
            envDir: config.envDir,
            base: config.env.VITE_CONFIG_BASE,
            local: config.env.VITE_CONFIG_LOCAL,
            mode: config.env.VITE_CONFIG_MODE,
            layer: config.env.VITE_CONFIG_LAYER,
            priority: config.env.VITE_CONFIG_PRIORITY,
            key: config.env.VITE_CONFIG_KEY ?? null,
            privateLoaded: process.env.CONFIG_PRIVATE_KEY === 'synthetic-private-key',
            privateExposed: Object.hasOwn(config.env, 'CONFIG_PRIVATE_KEY')
        }))
    `)
})

afterAll(async () => {
    if (fixtureRoot) await rm(fixtureRoot, {recursive: true, force: true})
})

describe('web environment configuration', () => {
    it.each(['development', 'dev', 'test', 'production'])('loads app-local %s configuration with existing precedence', mode => {
        const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('VITE_') && key !== 'CONFIG_PRIVATE_KEY'))
        const output = execFileSync(process.execPath, [path.join(fixtureRoot, 'probe.mjs'), mode], {
            cwd: path.resolve(webRoot, '../..'),
            env: {...env, VITE_CONFIG_PRIORITY: 'shell'},
            encoding: 'utf8'
        })

        expect(JSON.parse(output.trim())).toEqual({
            envDir: fixtureRoot,
            base: 'base',
            local: 'local',
            mode,
            layer: 'mode-local',
            priority: 'shell',
            key: mode === 'test' ? null : 'synthetic-client-key',
            privateLoaded: mode !== 'test',
            privateExposed: false
        })
    })
})
