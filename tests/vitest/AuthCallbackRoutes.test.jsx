import React from 'react'
import {screen, waitFor} from '@testing-library/react'
import {useLocation} from 'react-router-dom'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import AuthDiscordRoute from '../../src/auth/AuthDiscordRoute.jsx'
import AuthRedditRoute from '../../src/auth/AuthRedditRoute.jsx'
import {routeDiscordAuthCallback} from '../../src/auth/discordAuth.js'
import {renderWithRouter} from '../../src/test/render.jsx'

vi.mock('../../src/scorecard/ImportPreview.jsx', () => ({
    default: ({service, syncStatus, syncResult}) => (
        <div>
            <span>Service: {service}</span>
            <span>Status: {String(syncStatus)}</span>
            <span>Awards: {syncResult.awards?.length ?? 0}</span>
        </div>
    )
}))
vi.mock('../../src/app/ProfileContext.jsx', () => ({
    ProfileProvider: ({children}) => children
}))

const state = 'A'.repeat(43)
const nonce = 'a'.repeat(32)
const identity = {discordId: '123456789012345678', username: 'picker'}
const signedIn = {authLoaded: true, isLoggedIn: true, user: {uid: 'firebase-user'}}

function LocationProbe() {
    const location = useLocation()
    return <>
        <span>Path: {location.pathname}</span>
        {location.state?.discordAutoPost && <span>Send after Discord authorization</span>}
        {location.state?.discordAuthError && <span>Auth error: {location.state.discordAuthError}</span>}
    </>
}

function callbackUrl({code = 'oauth-code', callbackState = state, issuer = 'https://discord.com'} = {}) {
    const params = new URLSearchParams({code, state: callbackState, iss: issuer})
    window.history.replaceState({}, '', `/?${params}#/auth/discord`)
}

function storePending({pendingState = state, pendingNonce = nonce,
    purpose, returnTo} = {}) {
    sessionStorage.setItem('discordOAuthPending', JSON.stringify({
        state: pendingState, nonce: pendingNonce, purpose, returnTo
    }))
}

describe('OAuth callback route compatibility', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        window.history.replaceState({}, '', '/')
        sessionStorage.clear()
        vi.unstubAllGlobals()
    })

    it('routes a root Discord callback and clears its query after exchange', async () => {
        const params = new URLSearchParams({code: 'oauth-code', state})
        window.history.replaceState({}, '', `/?${params}`)
        storePending()
        routeDiscordAuthCallback()
        expect(window.location.hash).toBe('#/auth/discord')

        const exchangeDiscordOAuth = vi.fn(async () => ({purpose: 'import', identity}))
        renderWithRouter(<AuthDiscordRoute/>, {
            route: '/auth/discord', auth: signedIn,
            api: {exchangeDiscordOAuth},
            db: {setDiscordUserInfo: vi.fn(async () => {}), peekAtDiscordAwards: vi.fn(async () => [])}
        })

        await waitFor(() => expect(screen.getByText('Status: complete')).toBeInTheDocument())
        expect(exchangeDiscordOAuth).toHaveBeenCalledWith({code: 'oauth-code', state, nonce})
        expect(window.location.search).toBe('')
    })

    it('leaves an unrelated root query alone without a pending Discord session', () => {
        window.history.replaceState({}, '', '/?code=other-code&state=other-state')
        routeDiscordAuthCallback()
        expect(window.location.hash).toBe('')
        expect(window.location.search).toBe('?code=other-code&state=other-state')
    })

    it('renders a denied Discord callback without contacting Discord', async () => {
        window.history.replaceState(
            {}, '', '/?error=access_denied&error_description=cancelled#/auth/discord'
        )
        const exchangeDiscordOAuth = vi.fn()
        renderWithRouter(<AuthDiscordRoute/>, {
            route: '/auth/discord', api: {exchangeDiscordOAuth}
        })

        await waitFor(() => expect(screen.getByText('Status: access_denied')).toBeInTheDocument())
        expect(screen.getByText('Service: Discord')).toBeInTheDocument()
        expect(exchangeDiscordOAuth).not.toHaveBeenCalled()
        expect(fetch).not.toHaveBeenCalled()
        expect(window.location.search).toBe('')
    })

    describe('Discord award import', () => {
        const award = discordAwardName => ({
            discordAwardName,
            awardCreatedAt: {toDate: () => new Date('2024-01-01T00:00:00Z')},
            awardUrl: 'https://discord.com/award'
        })

        beforeEach(() => {
            callbackUrl()
            storePending()
        })

        it('imports known awards through the verified server identity', async () => {
            const exchangeDiscordOAuth = vi.fn(async () => ({purpose: 'import', identity}))
            const setDiscordUserInfo = vi.fn(async () => {})
            const peekAtDiscordAwards = vi.fn(async () => [award('Yellow Belt'), award('Mystery Award')])

            renderWithRouter(<AuthDiscordRoute/>, {
                route: '/auth/discord', auth: signedIn,
                api: {exchangeDiscordOAuth}, db: {setDiscordUserInfo, peekAtDiscordAwards}
            })

            await waitFor(() => expect(screen.getByText('Status: complete')).toBeInTheDocument())
            expect(screen.getByText('Awards: 1')).toBeInTheDocument()
            expect(exchangeDiscordOAuth).toHaveBeenCalledWith({code: 'oauth-code', state, nonce})
            expect(setDiscordUserInfo).toHaveBeenCalledWith(identity.discordId, identity.username)
            expect(sessionStorage.getItem('discordOAuthPending')).toBeNull()
            expect(window.location.search).toBe('')
            expect(fetch).not.toHaveBeenCalled()
        })

        it('still links award import when no award matches', async () => {
            const setDiscordUserInfo = vi.fn(async () => {})
            renderWithRouter(<AuthDiscordRoute/>, {
                route: '/auth/discord', auth: signedIn,
                api: {exchangeDiscordOAuth: vi.fn(async () => ({purpose: 'import', identity}))},
                db: {setDiscordUserInfo, peekAtDiscordAwards: vi.fn(async () => [])}
            })

            await waitFor(() => expect(screen.getByText('Status: complete')).toBeInTheDocument())
            expect(screen.getByText('Awards: 0')).toBeInTheDocument()
            expect(setDiscordUserInfo).toHaveBeenCalledWith(identity.discordId, identity.username)
        })

        it('reports an award lookup failure after preserving the profile link', async () => {
            const setDiscordUserInfo = vi.fn(async () => {})
            renderWithRouter(<AuthDiscordRoute/>, {
                route: '/auth/discord', auth: signedIn,
                api: {exchangeDiscordOAuth: vi.fn(async () => ({purpose: 'import', identity}))},
                db: {setDiscordUserInfo, peekAtDiscordAwards: vi.fn(async () => {
                    throw new Error('firestore unavailable')
                })}
            })

            await waitFor(() => expect(screen.getByText('Status: data_failed')).toBeInTheDocument())
            expect(setDiscordUserInfo).toHaveBeenCalledWith(identity.discordId, identity.username)
        })

        it('rejects a mismatched browser state before exchange', async () => {
            const exchangeDiscordOAuth = vi.fn()
            sessionStorage.setItem('discordOAuthPending', JSON.stringify({state: 'B'.repeat(43), nonce}))
            renderWithRouter(<AuthDiscordRoute/>, {
                route: '/auth/discord', auth: signedIn, api: {exchangeDiscordOAuth}
            })

            await waitFor(() => expect(screen.getByText('Status: data_failed')).toBeInTheDocument())
            expect(exchangeDiscordOAuth).not.toHaveBeenCalled()
        })

        it('waits for Firebase authentication before exchange', async () => {
            const exchangeDiscordOAuth = vi.fn()
            renderWithRouter(<AuthDiscordRoute/>, {
                route: '/auth/discord',
                auth: {...signedIn, authLoaded: false}, api: {exchangeDiscordOAuth}
            })
            expect(exchangeDiscordOAuth).not.toHaveBeenCalled()
            expect(sessionStorage.getItem('discordOAuthPending')).not.toBeNull()
        })
    })

    it('returns a fresh posting grant to the belt request form without importing awards', async () => {
        callbackUrl()
        storePending({purpose: 'beltRequest', returnTo: '/beltRequests'})
        const setDiscordUserInfo = vi.fn()
        const peekAtDiscordAwards = vi.fn()
        renderWithRouter(<><AuthDiscordRoute/><LocationProbe/></>, {
            route: '/auth/discord', auth: signedIn,
            api: {exchangeDiscordOAuth: vi.fn(async () => ({
                purpose: 'beltRequest', returnTo: '/beltRequests', identity,
                postingGrant: 'new-posting-grant'
            }))},
            db: {setDiscordUserInfo, peekAtDiscordAwards}
        })

        await waitFor(() => expect(screen.getByText('Path: /beltRequests')).toBeInTheDocument())
        expect(screen.getByText('Send after Discord authorization')).toBeInTheDocument()
        expect(JSON.parse(sessionStorage.getItem('discordPostingGrant'))).toMatchObject({
            postingGrant: 'new-posting-grant', uid: 'firebase-user'
        })
        expect(setDiscordUserInfo).not.toHaveBeenCalled()
        expect(peekAtDiscordAwards).not.toHaveBeenCalled()
    })

    it('returns a canceled belt-request authorization to the preserved draft', async () => {
        window.history.replaceState({}, '', '/?error=access_denied#/auth/discord')
        storePending({purpose: 'beltRequest', returnTo: '/beltRequests'})
        renderWithRouter(<><AuthDiscordRoute/><LocationProbe/></>, {
            route: '/auth/discord', auth: signedIn
        })

        await waitFor(() => expect(screen.getByText('Path: /beltRequests')).toBeInTheDocument())
        expect(screen.getByText('Auth error: Discord authorization was canceled. Your request draft is still available.'))
            .toBeInTheDocument()
        expect(sessionStorage.getItem('discordOAuthPending')).toBeNull()
    })

    it('renders a denied Reddit callback without contacting Reddit', async () => {
        window.history.replaceState({}, '', '/?state=test&error=access_denied#/auth/reddit')

        renderWithRouter(<AuthRedditRoute/>, {
            route: '/auth/reddit',
            auth: {isLoggedIn: true, user: {uid: 'test-user'}}
        })

        await waitFor(() => expect(screen.getByText('Status: access_denied')).toBeInTheDocument())
        expect(screen.getByText('Service: Reddit')).toBeInTheDocument()
        expect(fetch).not.toHaveBeenCalled()
    })
})
