import {createRequire} from 'node:module'
import {describe, expect, it} from 'vitest'
import {getApps, initializeApp} from 'firebase-admin/app'
import {getAuth} from 'firebase-admin/auth'
import {getFirestore, Timestamp} from 'firebase-admin/firestore'

const require = createRequire(import.meta.url)

describe('Firebase Admin dependency contracts', () => {
    it('loads the modular APIs without initializing a Firebase app', () => {
        expect(initializeApp).toBeTypeOf('function')
        expect(getAuth).toBeTypeOf('function')
        expect(getFirestore).toBeTypeOf('function')
        expect(Timestamp.fromMillis(1_000).toMillis()).toBe(1_000)
        expect(getApps()).toEqual([])
    })

    it('provides UUID 11 to Gaxios 6 through the package-scoped resolution', () => {
        const storageRequire = createRequire(require.resolve('@google-cloud/storage'))
        const gaxiosPackagePath = storageRequire.resolve('gaxios/package.json')
        const gaxiosRequire = createRequire(gaxiosPackagePath)
        const gaxiosPackage = gaxiosRequire('./package.json')
        const uuidPackage = gaxiosRequire('uuid/package.json')
        const {Gaxios} = gaxiosRequire('gaxios')
        const {v4, validate, version} = gaxiosRequire('uuid')
        const id = v4()

        expect(gaxiosPackage.version).toBe('6.7.1')
        expect(uuidPackage.version).toBe('11.1.1')
        expect(new Gaxios()).toBeInstanceOf(Gaxios)
        expect(validate(id)).toBe(true)
        expect(version(id)).toBe(4)
    })
})
