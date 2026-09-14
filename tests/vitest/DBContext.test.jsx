import React, {StrictMode, useContext} from 'react'
import {act, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'

const firestoreHarness = vi.hoisted(() => ({
    listeners: [],
    transaction: {
        get: vi.fn(),
        set: vi.fn(),
        update: vi.fn()
    },
    arrayUnion: vi.fn(value => ({arrayUnion: value})),
    arrayRemove: vi.fn(value => ({arrayRemove: value})),
    runTransaction: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    updateDoc: vi.fn(),
    setDoc: vi.fn(),
    deleteDoc: vi.fn(),
    addDoc: vi.fn(),
    enqueueSnackbar: vi.fn()
}))

vi.mock('../../src/auth/firebase', () => ({db: {name: 'test-db'}}))
vi.mock('notistack', () => ({enqueueSnackbar: firestoreHarness.enqueueSnackbar}))
vi.mock('firebase/firestore', () => ({
    doc: (_db, ...segments) => ({kind: 'doc', path: segments.join('/')}),
    collection: (_db, ...segments) => ({kind: 'collection', path: segments.join('/')}),
    query: source => ({kind: 'query', path: source.path}),
    where: (...args) => ({where: args}),
    onSnapshot: (reference, next, error) => {
        const listener = {reference, next, error, unsubscribe: vi.fn()}
        firestoreHarness.listeners.push(listener)
        return listener.unsubscribe
    },
    arrayUnion: firestoreHarness.arrayUnion,
    arrayRemove: firestoreHarness.arrayRemove,
    runTransaction: firestoreHarness.runTransaction,
    getDoc: firestoreHarness.getDoc,
    getDocs: firestoreHarness.getDocs,
    updateDoc: firestoreHarness.updateDoc,
    deleteField: vi.fn(() => ({deleteField: true})),
    writeBatch: vi.fn(() => ({delete: vi.fn(), set: vi.fn(), commit: vi.fn()})),
    addDoc: firestoreHarness.addDoc,
    setDoc: firestoreHarness.setDoc,
    deleteDoc: firestoreHarness.deleteDoc,
    Timestamp: {fromDate: vi.fn(value => value)}
}))
vi.unmock('../../src/app/DBContext.jsx')

import AuthContext from '../../src/app/AuthContext.jsx'
import DBContext, {DBProvider} from '../../src/app/DBContext.jsx'

let currentDBContext

function DBState() {
    currentDBContext = useContext(DBContext)
    return (
        <div>
            <span>Loaded: {String(currentDBContext.dbLoaded)}</span>
            <span>Profile: {currentDBContext.lockCollection.displayName || 'none'}</span>
            <button onClick={() => currentDBContext.addToLockCollection('locks', 'lock-id')}>Add lock</button>
        </div>
    )
}

const signedInAuth = {
    authLoaded: true,
    isLoggedIn: true,
    user: {uid: 'owner'},
    userClaims: []
}

const activeListener = path => {
    return firestoreHarness.listeners.find(listener => {
        return listener.reference.path === path && listener.unsubscribe.mock.calls.length === 0
    })
}

describe('DBContext', () => {
    beforeEach(() => {
        currentDBContext = undefined
        firestoreHarness.listeners.length = 0
        firestoreHarness.transaction.get.mockReset()
        firestoreHarness.transaction.set.mockReset()
        firestoreHarness.transaction.update.mockReset()
        firestoreHarness.arrayUnion.mockClear()
        firestoreHarness.arrayRemove.mockClear()
        firestoreHarness.runTransaction.mockReset()
        firestoreHarness.getDoc.mockReset()
        firestoreHarness.getDocs.mockReset()
        firestoreHarness.updateDoc.mockReset()
        firestoreHarness.setDoc.mockReset()
        firestoreHarness.deleteDoc.mockReset()
        firestoreHarness.addDoc.mockReset()
        firestoreHarness.enqueueSnackbar.mockReset()

        firestoreHarness.getDoc.mockResolvedValue({
            exists: () => true,
            data: () => ({payload: '[]'})
        })
        firestoreHarness.getDocs.mockResolvedValue({docs: []})
        firestoreHarness.runTransaction.mockImplementation(async (_db, callback) => {
            return callback(firestoreHarness.transaction)
        })
    })

    it('keeps one active subscription per source under Strict Mode and cleans up on unmount', async () => {
        const {unmount} = render(
            <StrictMode>
                <AuthContext.Provider value={signedInAuth}>
                    <DBProvider><DBState/></DBProvider>
                </AuthContext.Provider>
            </StrictMode>
        )

        const lockListener = activeListener('lockcollections/owner')
        const messageListener = activeListener('system-messages')
        expect(lockListener).toBeDefined()
        expect(messageListener).toBeDefined()
        expect(firestoreHarness.listeners.filter(listener => !listener.unsubscribe.mock.calls.length)).toHaveLength(2)

        await act(async () => {
            lockListener.next({data: () => ({displayName: 'Subscribed profile'})})
            await Promise.resolve()
        })

        await waitFor(() => expect(screen.getByText('Loaded: true')).toBeInTheDocument())
        expect(screen.getByText('Profile: Subscribed profile')).toBeInTheDocument()

        unmount()
        expect(firestoreHarness.listeners.every(listener => listener.unsubscribe.mock.calls.length === 1)).toBe(true)
    })

    it('performs collection updates through a Firestore transaction', async () => {
        const user = userEvent.setup()
        firestoreHarness.transaction.get.mockResolvedValue({exists: () => true})

        render(
            <AuthContext.Provider value={signedInAuth}>
                <DBProvider><DBState/></DBProvider>
            </AuthContext.Provider>
        )

        await user.click(screen.getByRole('button', {name: 'Add lock'}))
        await waitFor(() => expect(firestoreHarness.transaction.update).toHaveBeenCalled())

        expect(firestoreHarness.runTransaction).toHaveBeenCalledOnce()
        expect(firestoreHarness.transaction.get).toHaveBeenCalledWith({
            kind: 'doc',
            path: 'lockcollections/owner'
        })
        expect(firestoreHarness.arrayUnion).toHaveBeenCalledWith('lock-id')
        expect(firestoreHarness.transaction.update).toHaveBeenCalledWith(
            {kind: 'doc', path: 'lockcollections/owner'},
            {locks: {arrayUnion: 'lock-id'}}
        )
    })

    it('surfaces subscription permission failures through the recoverable notification', async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
        render(
            <AuthContext.Provider value={signedInAuth}>
                <DBProvider><DBState/></DBProvider>
            </AuthContext.Provider>
        )

        await act(async () => {
            await Promise.resolve()
            await Promise.resolve()
            activeListener('lockcollections/owner').error({code: 'permission-denied'})
        })

        expect(firestoreHarness.enqueueSnackbar).toHaveBeenCalledWith(
            expect.stringContaining('problem reading your collection'),
            expect.objectContaining({autoHideDuration: null})
        )
        consoleError.mockRestore()
    })
})
