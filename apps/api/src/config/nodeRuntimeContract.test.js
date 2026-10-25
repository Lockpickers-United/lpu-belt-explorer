import fs from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {describe, expect, it} from 'vitest'

const rootUrl = new URL('../../', import.meta.url)

async function readRootFile(path) {
    return fs.readFile(fileURLToPath(new URL(path, rootUrl)), 'utf8')
}

describe('Node runtime contract', () => {
    it('keeps the local pin, package engine, and CI setup aligned', async () => {
        const [nvmrc, packageJson, workflow, rootPackage, rootPin] = await Promise.all([
            readRootFile('.nvmrc'),
            readRootFile('package.json'),
            readRootFile('../../.github/workflows/api-deploy-production.yml'),
            readRootFile('../../package.json'),
            readRootFile('../../.nvmrc')
        ])
        const manifest = JSON.parse(packageJson)

        expect(nvmrc.trim()).toBe('24.21.0')
        expect(manifest.engines.node).toBe('>=24.11.0 <25')
        expect(manifest.packageManager).toBe('npm@11.19.0')
        expect(manifest.packageManager).toBe(JSON.parse(rootPackage).packageManager)
        expect(rootPin.trim()).toBe(nvmrc.trim())
        expect(workflow).toContain('node-version-file: .nvmrc')
        expect(workflow).toContain('if: ${{ false }}')
        expect(workflow).toContain('actual_node_version=$(node --version)')
    })
})
