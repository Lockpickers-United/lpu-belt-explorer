import React, {useContext} from 'react'
import {act, render, screen, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'

const authHarness = vi.hoisted(() => ({
    auth: {
        currentUser: null,
        onAuthStateChanged: vi.fn()
    },
    observer: null,
    unsubscribe: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    providerSetCustomParameters: vi.fn()
}))

vi.mock('../../src/auth/firebase', () => ({auth: authHarness.auth}))
vi.mock('firebase/auth', () => ({
    GoogleAuthProvider: class GoogleAuthProvider {
        setCustomParameters(parameters) {
            authHarness.providerSetCustomParameters(parameters)
        }
    },
    signInWithPopup: authHarness.signInWithPopup,
    signOut: authHarness.signOut
}))
vi.unmock('../../src/app/AuthContext.jsx')

import AuthContext, {AuthProvider} from '../../src/app/AuthContext.jsx'

let currentContext

function AuthState() {
    currentContext = useContext(AuthContext)
    const {authLoaded, isLoggedIn, user, userClaims, initialUser} = currentContext

    return (
        <div>
            <span>Loaded: {String(authLoaded)}</span>
            <span>Logged in: {String(isLoggedIn)}</span>
            <span>User: {user?.uid || 'none'}</span>
            <span>Claims: {userClaims.join(',') || 'none'}</span>
            <span>Initial: {initialUser || 'pending'}</span>
        </div>
    )
}

const renderAuth = () => render(<AuthProvider><AuthState/></AuthProvider>)

async function emitAuthState(user, claims = {}) {
    authHarness.auth.currentUser = user
        ? {
            ...user,
            getIdTokenResult: vi.fn().mockResolvedValue({claims})
        }
        : null

    await act(async () => {
        authHarness.observer(user)
        await Promise.resolve()
    })
}

describe('AuthContext', () => {
    beforeEach(() => {
        currentContext = undefined
        authHarness.auth.currentUser = null
        authHarness.observer = null
        authHarness.unsubscribe.mockReset()
        authHarness.signInWithPopup.mockReset()
        authHarness.signOut.mockReset()
        authHarness.providerSetCustomParameters.mockReset()
        authHarness.auth.onAuthStateChanged.mockReset()
        authHarness.auth.onAuthStateChanged.mockImplementation(observer => {
            authHarness.observer = observer
            return authHarness.unsubscribe
        })
    })

    it('observes anonymous state and unregisters on unmount', async () => {
        const {unmount} = renderAuth()

        expect(authHarness.auth.onAuthStateChanged).toHaveBeenCalledOnce()
        await emitAuthState(null)

        expect(screen.getByText('Loaded: true')).toBeInTheDocument()
        expect(screen.getByText('Logged in: false')).toBeInTheDocument()
        expect(screen.getByText('Initial: no')).toBeInTheDocument()

        unmount()
        expect(authHarness.unsubscribe).toHaveBeenCalledOnce()
    })

    it('loads and refreshes only true custom claims for a signed-in user', async () => {
        renderAuth()

        await emitAuthState({uid: 'first-user'}, {
            admin: true,
            qaUser: false,
            email_verified: true
        })

        await waitFor(() => expect(screen.getByText('Claims: admin')).toBeInTheDocument())
        expect(screen.getByText('Logged in: true')).toBeInTheDocument()
        expect(screen.getByText('User: first-user')).toBeInTheDocument()
        expect(screen.getByText('Initial: yes')).toBeInTheDocument()

        await emitAuthState({uid: 'first-user'}, {lpuAdmin: true})
        await waitFor(() => expect(screen.getByText('Claims: lpuAdmin')).toBeInTheDocument())
    })

    it('configures popup login and propagates popup failures', async () => {
        const popupError = new Error('popup blocked')
        authHarness.signInWithPopup.mockRejectedValue(popupError)
        renderAuth()

        await expect(currentContext.login()).rejects.toBe(popupError)
        expect(authHarness.providerSetCustomParameters).toHaveBeenCalledWith({prompt: 'select_account'})
        expect(authHarness.signInWithPopup).toHaveBeenCalledWith(
            authHarness.auth,
            expect.any(Object)
        )
    })

    it('returns the successful popup result', async () => {
        const popupResult = {user: {uid: 'popup-user'}}
        authHarness.signInWithPopup.mockResolvedValue(popupResult)
        renderAuth()

        await expect(currentContext.login()).resolves.toBe(popupResult)
        expect(authHarness.providerSetCustomParameters).toHaveBeenCalledWith({prompt: 'select_account'})
    })

    it('clears local auth state and delegates sign-out', async () => {
        authHarness.signOut.mockResolvedValue(undefined)
        renderAuth()
        await emitAuthState({uid: 'signed-in'}, {admin: true})

        await act(async () => currentContext.logout())

        expect(authHarness.signOut).toHaveBeenCalledWith(authHarness.auth)
        expect(screen.getByText('Logged in: false')).toBeInTheDocument()
        expect(screen.getByText('User: none')).toBeInTheDocument()
        expect(screen.getByText('Initial: no')).toBeInTheDocument()
    })
})
