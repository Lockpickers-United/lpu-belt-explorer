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
        expect(workflow).toContain('actual_node_version=$(node --version)')
    })

    it('keeps API deployment manual, confirmed and restricted to main after authority transfer', async () => {
        const workflow = await readRootFile('../../.github/workflows/api-deploy-production.yml')

        expect(workflow).toMatch(/^on:\n {2}workflow_dispatch:/m)
        expect(workflow).not.toMatch(/^ {2}(push|pull_request|workflow_run|schedule):/m)
        expect(workflow).toMatch(/confirmation:[\s\S]*?required: true[\s\S]*?options:\n {10}- deploy-production/)
        expect(workflow).toContain('if [[ "$GITHUB_REF" != "refs/heads/main" ]]')
        expect(workflow).toContain('name: api-production')
        expect(workflow).toMatch(/^ {2}deploy:\n {4}name: Upload and activate release$/m)
        expect(workflow).not.toContain('if: ${{ false }}')
    })

    it.each([
        'build.js.yml',
        'import.js.yml',
        'publish-classification-catalog-dev.yml'
    ])('retains the migration hold in %s during API-only authority transfer', async filename => {
        const workflow = await readRootFile(`../../.github/workflows/${filename}`)

        expect(workflow).toMatch(/^ {4}if: \$\{\{ false \}\}$/m)
    })
})
