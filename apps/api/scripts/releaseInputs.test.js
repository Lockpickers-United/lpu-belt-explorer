import {describe, expect, it} from 'vitest'
import {createReleaseInputs, resolvePackage} from './releaseInputs.js'

function fixture() {
    const api = {name: 'lpubeltsapiserver', version: '1.0.0', packageManager: 'npm@11.19.0', dependencies: {example: '^1.0.0'}, devDependencies: {testTool: '^1.0.0'}}
    const root = {workspaces: ['apps/web', 'apps/api'], packageManager: api.packageManager, overrides: {'gaxios@6.7.1': {uuid: '11.1.1'}}}
    const lock = {lockfileVersion: 3, packages: {
        'apps/api': {...api},
        'apps/api/node_modules/example': {version: '1.0.0', dependencies: {child: '^2.0.0'}},
        'apps/api/node_modules/child': {version: '2.0.0'},
        'apps/api/node_modules/testTool': {version: '1.0.0', dev: true},
        'apps/web/node_modules/frontend': {version: '9.0.0'}
    }}
    return {api, root, lock}
}

describe('standalone npm release projection', () => {
    it('retains exact API package versions, nesting and effective overrides without sibling packages', () => {
        const {api, root, lock} = fixture()
        const output = createReleaseInputs(root, lock, api)
        expect(output.manifest.overrides).toEqual(root.overrides)
        expect(output.lock.name).toBe(api.name)
        expect(output.lock.packages['node_modules/example'].version).toBe('1.0.0')
        expect(output.lock.packages['node_modules/child'].version).toBe('2.0.0')
        expect(Object.keys(output.lock.packages)).not.toContain('apps/web/node_modules/frontend')
        expect(Object.keys(output.lock.packages)).not.toContain('node_modules/frontend')
        expect(api).not.toHaveProperty('overrides')
    })

    it('rejects a lock that requires a dependency hoisted outside the app', () => {
        const {api, root, lock} = fixture()
        delete lock.packages['apps/api/node_modules/child']
        lock.packages['node_modules/child'] = {version: '2.0.0'}
        expect(() => createReleaseInputs(root, lock, api)).toThrow('hoisted outside the release: child')
    })

    it('rejects uncommitted manifest dependency drift', () => {
        const {api, root, lock} = fixture()
        api.dependencies = {example: '^2.0.0'}
        expect(() => createReleaseInputs(root, lock, api)).toThrow('workspace lock mismatch: dependencies')
    })

    it('rejects workspace links inside runtime dependencies', () => {
        const {api, root, lock} = fixture()
        lock.packages['apps/api/node_modules/child'] = {link: true, resolved: '../web'}
        expect(() => createReleaseInputs(root, lock, api)).toThrow('must not link outside')
    })

    it('allows absent platform-optional packages but preserves their locked metadata', () => {
        const {api, root, lock} = fixture()
        lock.packages['apps/api/node_modules/example'].optionalDependencies = {platform: '1.0.0'}
        expect(() => createReleaseInputs(root, lock, api)).not.toThrow()
    })

    it('resolves a dependency through the correct nested Node module ancestors', () => {
        const packages = new Set(['node_modules/example', 'node_modules/parent/node_modules/example'])
        expect(resolvePackage('node_modules/parent/node_modules/child', 'example', packages)).toBe('node_modules/parent/node_modules/example')
        expect(resolvePackage('node_modules/other', 'example', packages)).toBe('node_modules/example')
        expect(resolvePackage('', 'missing', packages)).toBeNull()
    })
})
