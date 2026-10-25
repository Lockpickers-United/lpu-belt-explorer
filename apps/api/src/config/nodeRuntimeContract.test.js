import fs from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {describe, expect, it} from 'vitest'

const rootUrl = new URL('../../', import.meta.url)

async function readRootFile(path) {
    return fs.readFile(fileURLToPath(new URL(path, rootUrl)), 'utf8')
}

describe('Node runtime contract', () => {
    it('keeps the local pin, package engine, and CI setup aligned', async () => {
        const [nvmrc, packageJson, workflow] = await Promise.all([
            readRootFile('.nvmrc'),
            readRootFile('package.json'),
            readRootFile('.github/workflows/deploy-production.yml')
        ])
        const manifest = JSON.parse(packageJson)

        expect(nvmrc.trim()).toBe('24.21.0')
        expect(manifest.engines.node).toBe('>=24.11.0 <25')
        expect(manifest.packageManager).toBe('yarn@4.18.0')
        expect(workflow).toContain('node-version-file: .nvmrc')
        //expect(workflow).toContain('corepack yarn install --immutable')
        expect(workflow).toContain('actual_node_version=$(node --version)')
    })
})
