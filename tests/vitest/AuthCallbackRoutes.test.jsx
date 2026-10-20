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

    describe('Discord award sync', () => {
        const award = (discordAwardName) => ({
            discordAwardName,
            awardCreatedAt: {toDate: () => new Date('2024-01-01T00:00:00Z')},
            awardUrl: 'https://discord.com/award'
        })

        beforeEach(() => {
            window.history.replaceState({}, '', '/?code=abc&iss=https%3A%2F%2Fdiscord.com#/auth/discord')
            fetch
                .mockResolvedValueOnce({status: 200, json: async () => ({access_token: 'tok', token_type: 'Bearer'})})
                .mockResolvedValueOnce({status: 200, json: async () => ({id: 'd1', username: 'picker'})})
        })

        it('skips awards that do not match a known belt', async () => {
            const setDiscordUserInfo = vi.fn(async () => {})
            const peekAtDiscordAwards = vi.fn(async () => [award('Yellow Belt'), award('Mystery Award')])

            renderWithRouter(<AuthDiscordRoute/>, {
                route: '/auth/discord',
                db: {setDiscordUserInfo, peekAtDiscordAwards}
            })

            await waitFor(() => expect(screen.getByText('Status: complete')).toBeInTheDocument())
            expect(setDiscordUserInfo).toHaveBeenCalledWith('d1', 'picker')
        })

        it('reports data_failed when award lookup throws', async () => {
            const setDiscordUserInfo = vi.fn(async () => {})
            const peekAtDiscordAwards = vi.fn(async () => {
                throw new Error('firestore unavailable')
            })

            renderWithRouter(<AuthDiscordRoute/>, {
                route: '/auth/discord',
                db: {setDiscordUserInfo, peekAtDiscordAwards}
            })

            await waitFor(() => expect(screen.getByText('Status: data_failed')).toBeInTheDocument())
            expect(setDiscordUserInfo).not.toHaveBeenCalled()
        })
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
