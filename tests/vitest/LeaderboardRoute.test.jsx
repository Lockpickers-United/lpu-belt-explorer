import React from 'react'
import {expect, it, describe} from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithRouter} from '../../src/test/render.jsx'
import LeaderboardRoute from '../../src/leaderboard/LeaderboardRoute.jsx'
import Leaderboard from '../../src/leaderboard/Leaderboard.jsx'
import {Routes, Route} from 'react-router-dom'

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

