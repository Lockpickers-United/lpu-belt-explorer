import React from 'react'
import {screen, waitFor} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import AuthDiscordRoute from '../../src/auth/AuthDiscordRoute.jsx'
import AuthRedditRoute from '../../src/auth/AuthRedditRoute.jsx'
import {renderWithRouter} from '../../src/test/render.jsx'

vi.mock('../../src/scorecard/ImportPreview.jsx', () => ({
    default: ({service, syncStatus}) => (
        <div>
            <span>Service: {service}</span>
            <span>Status: {String(syncStatus)}</span>
        </div>
    )
}))
vi.mock('../../src/app/ProfileContext.jsx', () => ({
    ProfileProvider: ({children}) => children
}))

describe('OAuth callback route compatibility', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn())
    })

    afterEach(() => {
        window.history.replaceState({}, '', '/')
        vi.unstubAllGlobals()
    })

    it('renders a denied Discord callback without contacting Discord', async () => {
        window.history.replaceState(
            {},
            '',
            '/?error=access_denied&error_description=cancelled#/auth/discord'
        )

        renderWithRouter(<AuthDiscordRoute/>, {route: '/auth/discord'})

        await waitFor(() => expect(screen.getByText('Status: access_denied')).toBeInTheDocument())
        expect(screen.getByText('Service: Discord')).toBeInTheDocument()
        expect(fetch).not.toHaveBeenCalled()
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
