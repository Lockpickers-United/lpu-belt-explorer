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
        'web-import.js.yml'
    ])('keeps %s manual and restricted to main after migration', async filename => {
        const workflow = await readRootFile(`../../.github/workflows/${filename}`)

        expect(workflow).toMatch(/^on:\n {2}workflow_dispatch:/m)
        expect(workflow).not.toMatch(/^ {2}(push|pull_request|workflow_run|schedule):/m)
        expect(workflow).toContain("if: ${{ github.ref == 'refs/heads/main' }}")
        expect(workflow).not.toContain('if: ${{ false }}')
    })

    it('publishes web only from main and successful same-repository main Import completion', async () => {
        const workflow = await readRootFile('../../.github/workflows/web-build.js.yml')
        const condition = workflow.match(/^ {4}if: >-\n((?: {6}.+\n)+)/m)?.[1]

        expect(condition).toBeDefined()
        expect(workflow).toContain("workflows: ['Web - Import']")
        const expression = condition.trim().replace(/^\$\{\{\s*/, '').replace(/\s*\}\}$/, '')
        const permits = new Function('github', `return (${expression})`)
        const repository = 'Lockpickers-United/lpu-belt-explorer'
        const successfulImport = {
            conclusion: 'success',
            head_branch: 'main',
            head_repository: {full_name: repository}
        }
        const cases = [
            ['main push', 'push', 'refs/heads/main', null, true],
            ['main dispatch', 'workflow_dispatch', 'refs/heads/main', null, true],
            ['feature push', 'push', 'refs/heads/feature', null, false],
            ['feature dispatch', 'workflow_dispatch', 'refs/heads/feature', null, false],
            ['successful main Import', 'workflow_run', 'refs/heads/main', successfulImport, true],
            ['failed Import', 'workflow_run', 'refs/heads/main', {...successfulImport, conclusion: 'failure'}, false],
            ['cancelled Import', 'workflow_run', 'refs/heads/main', {...successfulImport, conclusion: 'cancelled'}, false],
            ['feature Import', 'workflow_run', 'refs/heads/main', {...successfulImport, head_branch: 'feature'}, false],
            ['fork Import', 'workflow_run', 'refs/heads/main', {...successfulImport, head_repository: {full_name: 'fork/repository'}}, false],
            ['missing source repository', 'workflow_run', 'refs/heads/main', {...successfulImport, head_repository: null}, false],
            ['non-main workflow ref', 'workflow_run', 'refs/heads/feature', successfulImport, false],
            ['unrelated event', 'pull_request', 'refs/heads/main', null, false]
        ]

        for (const [name, event, ref, run, expected] of cases) {
            expect(Boolean(permits({repository, ref, event_name: event, event: {workflow_run: run}})), name).toBe(expected)
        }
    })
})
