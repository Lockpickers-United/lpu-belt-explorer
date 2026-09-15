import React from 'react'
import {expect, it, describe, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithProviders, renderWithRouter} from '../../src/test/render.jsx'
import LeaderboardRoute from '../../src/leaderboard/LeaderboardRoute.jsx'
import Leaderboard from '../../src/leaderboard/Leaderboard.jsx'
import LeaderboardName from '../../src/leaderboard/LeaderboardName.jsx'
import {Routes, Route} from 'react-router-dom'

vi.mock('../../src/util/useData.jsx', () => ({
    default: () => ({
        data: {
            leaderboardData: {
                data: [
                    {
                        id: 'locks-user',
                        displayName: 'Georgia Jim',
                        locksCollection: 4,
                        own: 2,
                        picked: 1,
                        wishlist: 1,
                        recordedLocks: 1
                    },
                    {
                        id: 'safelocks-user',
                        displayName: 'DoNotDuplicate',
                        safelocksCollection: 3,
                        safelocksOwn: 1,
                        safelocksCracked: 1,
                        safelocksWishlist: 1
                    },
                    {
                        id: 'black-belt-user',
                        displayName: 'Sidepicks',
                        danPoints: 12,
                        danLevel: 1,
                        blackBeltCount: 2,
                        blackBeltAwardedAt: 1_700_000_000
                    }
                ],
                metadata: {updatedDateTime: '2026-09-14T00:00:00.000Z'}
            },
            recentAwardsEvidence: {
                awards: [],
                evidence: [],
                metadata: {updatedDateTime: '2026-09-14T00:00:00.000Z'}
            }
        },
        loading: false,
        error: false,
        errorMessage: null
    })
}))

describe('LeaderboardRoute', () => {
    it('renders Outlet child route (locks tab) under LeaderboardRoute', async () => {
        renderWithRouter(
            <Routes>
                <Route path='/' element={<LeaderboardRoute/>}>
                    <Route index element={<Leaderboard tab='locks'/>}/>
                    <Route path='locks' element={<Leaderboard tab='locks'/>}/>
                    <Route path='safelocks' element={<Leaderboard tab='safelocks'/>}/>
                    <Route path='blackBelts' element={<Leaderboard tab='blackBelts'/>}/>
                    <Route path='recent' element={<Leaderboard tab='recent'/>}/>
                </Route>
            </Routes>,
            {route: '/'}
        )

        // Verify the Locks tab is selected (button disabled) and table renders
        expect(await screen.findByRole('button', {name: 'Locks'})).toBeInTheDocument()
        expect(await screen.findByRole('row', {name: 'Georgia Jim'})).toBeInTheDocument()
    })

    it('renders specific child route path (/leaderboard/safelocks equivalent) and shows Safelocks leaderboard', async () => {
        renderWithRouter(
            <Routes>
                <Route path='/' element={<LeaderboardRoute/>}>
                    <Route path='safelocks' element={<Leaderboard tab='safelocks'/>}/>
                </Route>
            </Routes>,
            {route: '/safelocks'}
        )
        expect(await screen.findByRole('button', {name: 'Locks'})).toBeInTheDocument()
        expect(await screen.findByRole('row', {name: 'DoNotDuplicate'})).toBeInTheDocument()
    })

    it('renders specific child route path (/leaderboard/blackBelts equivalent) and shows Black Belts leaderboard', async () => {
        renderWithRouter(
            <Routes>
                <Route path='/' element={<LeaderboardRoute/>}>
                    <Route path='blackBelts' element={<Leaderboard tab='blackBelts'/>}/>
                </Route>
            </Routes>,
            {route: '/blackBelts'}
        )
        expect(await screen.findByRole('button', {name: 'Locks'})).toBeInTheDocument()
        expect(await screen.findByRole('row', {name: 'Sidepicks'})).toBeInTheDocument()
    })

    it('renders specific child route path (/leaderboard/recent equivalent) and shows Recent Belts & Dans', async () => {
        renderWithRouter(
            <Routes>
                <Route path='/' element={<LeaderboardRoute/>}>
                    <Route path='recent' element={<Leaderboard tab='recent'/>}/>
                </Route>
            </Routes>,
            {route: '/recent'}
        )
        expect(await screen.findByRole('button', {name: 'Locks'})).toBeInTheDocument()
        expect(await screen.findByRole('heading', {name: 'Recent Belts & Dans'})).toBeInTheDocument()
    })

})

describe('LeaderboardName', () => {
    it('renders the current user with the existing profile link and highlight', () => {
        renderWithProviders(
            <LeaderboardName
                leader={{id: 'locks-user', displayName: 'Georgia Jim'}}
                isCurrentUser
                tab='locks'
                maxLength={25}
            />
        )

        const link = screen.getByRole('link', {name: 'Georgia Jim'})
        expect(link).toHaveAttribute('href', '/#/profile/locks-user?name=Georgia_Jim')
        expect(link).toHaveStyle({color: '#4db013'})
    })

    it('keeps private leaderboard identities anonymous', () => {
        renderWithProviders(
            <LeaderboardName
                leader={{id: 'private-user', displayName: 'Private User', privacyAnonymous: true}}
                tab='locks'
                maxLength={25}
            />
        )

        expect(screen.getByText('Anonymous')).toBeInTheDocument()
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
})
