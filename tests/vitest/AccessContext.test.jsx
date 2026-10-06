import React from 'react'
import {act, fireEvent, render, screen} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import AuthContext from '../../src/app/AuthContext.jsx'
import {AccessProvider, useAccess} from '../../src/app/AccessContext.jsx'

function AccessState() {
    const {accessInfo, toggleRoleEnabled} = useAccess()

    return (
        <div>
            <span>Roles: {JSON.stringify(accessInfo.roles)}</span>
            <span>Enabled: {JSON.stringify(accessInfo.enabledRoles)}</span>
            <span>Features: {JSON.stringify(accessInfo.features)}</span>
            <span>Level: {accessInfo.level}</span>
            <span>Enabled level: {accessInfo.enabledLevel}</span>
            <span>Active role: {accessInfo.activeRole || 'none'}</span>
            <button onClick={() => toggleRoleEnabled('admin')}>Toggle admin</button>
            <button onClick={() => toggleRoleEnabled('qaUser')}>Toggle QA</button>
        </div>
    )
}

const anonymousAuth = {
    authLoaded: true,
    isLoggedIn: false,
    user: null,
    userClaims: []
}

const renderAccess = auth => render(
    <AuthContext.Provider value={auth}>
        <AccessProvider>
            <AccessState/>
        </AccessProvider>
    </AuthContext.Provider>
)

describe('AccessContext', () => {
    beforeEach(() => {
        window.localStorage.clear()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('ignores a persisted admin preference without an authenticated admin claim', () => {
        window.localStorage.setItem('adminEnabled', JSON.stringify(true))

        renderAccess(anonymousAuth)

        expect(screen.getByText('Level: 0')).toBeInTheDocument()
        expect(screen.getByText('Enabled level: 0')).toBeInTheDocument()
        expect(screen.getByText('Active role: none')).toBeInTheDocument()
        expect(screen.getByText(/Enabled:.*"admin":false/)).toBeInTheDocument()
        expect(screen.getByText(/Features:.*"entryActionBar":false/)).toBeInTheDocument()
        expect(screen.getByText(/Features:.*"manageRequests":false/)).toBeInTheDocument()
    })

    it('removes access immediately when the authenticated account changes', () => {
        window.localStorage.setItem('adminEnabled', JSON.stringify(true))
        const adminAuth = {
            authLoaded: true,
            isLoggedIn: true,
            user: {uid: 'admin-user'},
            userClaims: ['admin']
        }
        const regularAuth = {
            authLoaded: true,
            isLoggedIn: true,
            user: {uid: 'regular-user'},
            userClaims: []
        }
        const {rerender} = renderAccess(adminAuth)

        expect(screen.getByText('Level: 100')).toBeInTheDocument()
        expect(screen.getByText('Enabled level: 100')).toBeInTheDocument()

        rerender(
            <AuthContext.Provider value={regularAuth}>
                <AccessProvider>
                    <AccessState/>
                </AccessProvider>
            </AuthContext.Provider>
        )

        expect(screen.getByText('Level: 0')).toBeInTheDocument()
        expect(screen.getByText('Enabled level: 0')).toBeInTheDocument()
        expect(screen.getByText(/Features:.*"classificationVote":false/)).toBeInTheDocument()
    })

    it.each([
        ['admin', 100, {entryActionBar: true, classificationVote: true, scorecardVideos: true, manageRequests: true}],
        ['lpuMod', 90, {entryActionBar: true, classificationVote: true, scorecardVideos: true, manageRequests: false}],
        ['classificationAdmin', 85, {entryActionBar: true, classificationVote: true, scorecardVideos: false, manageRequests: true}],
        ['classificationTeam', 60, {entryActionBar: true, classificationVote: true, scorecardVideos: false, manageRequests: false}],
        ['qaUser', 20, {entryActionBar: false, classificationVote: false, scorecardVideos: false, manageRequests: false}]
    ])('grants the expected features for the %s claim without enabling a UI mode', (claim, level, expectedFeatures) => {
        renderAccess({
            authLoaded: true,
            isLoggedIn: true,
            user: {uid: claim},
            userClaims: [claim]
        })

        expect(screen.getByText(`Level: ${level}`)).toBeInTheDocument()
        expect(screen.getByText('Enabled level: 0')).toBeInTheDocument()
        expect(screen.getByText('Active role: none')).toBeInTheDocument()
        for (const [feature, enabled] of Object.entries(expectedFeatures)) {
            expect(screen.getByText(new RegExp(`Features:.*"${feature}":${enabled}`))).toBeInTheDocument()
        }
    })

    it('uses calendar dates for QA expiry and the canonical QA role key', () => {
        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
        window.localStorage.setItem('qaUserEnabledAt', JSON.stringify(oneWeekAgo.toISOString()))

        renderAccess({
            authLoaded: true,
            isLoggedIn: true,
            user: {uid: 'qa-user'},
            userClaims: ['qaUser']
        })

        expect(screen.getByText('Level: 20')).toBeInTheDocument()
        expect(screen.getByText('Enabled level: 0')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', {name: 'Toggle QA'}))

        expect(screen.getByText('Enabled level: 20')).toBeInTheDocument()
        expect(screen.getByText('Active role: qaUser')).toBeInTheDocument()
        expect(screen.getByText(/Enabled:.*"qaUser":true/)).toBeInTheDocument()
        expect(screen.getByText(/Features:.*"qaTools":true/)).toBeInTheDocument()
    })

    it('expires daily role modes when the calendar day ends', () => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(2026, 8, 30, 23, 59, 59, 900))
        window.localStorage.setItem('qaUserEnabledAt', JSON.stringify(dayjsNow()))

        renderAccess({
            authLoaded: true,
            isLoggedIn: true,
            user: {uid: 'qa-user'},
            userClaims: ['qaUser']
        })

        expect(screen.getByText('Enabled level: 20')).toBeInTheDocument()

        act(() => vi.advanceTimersByTime(200))

        expect(screen.getByText('Enabled level: 0')).toBeInTheDocument()
        expect(screen.getByText('Active role: none')).toBeInTheDocument()
        expect(screen.getByText(/Features:.*"qaTools":false/)).toBeInTheDocument()
    })

    it('lets administrators preview QA mode after disabling admin mode', () => {
        window.localStorage.setItem('adminEnabled', JSON.stringify(true))
        renderAccess({
            authLoaded: true,
            isLoggedIn: true,
            user: {uid: 'admin-user'},
            userClaims: ['admin']
        })

        expect(screen.getByText(/Roles:.*"qaUser":true/)).toBeInTheDocument()
        expect(screen.getByText(/Roles:.*"classificationAdmin":true/)).toBeInTheDocument()
        expect(screen.getByText(/Features:.*"manageRequests":true/)).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', {name: 'Toggle admin'}))
        fireEvent.click(screen.getByRole('button', {name: 'Toggle QA'}))

        expect(screen.getByText('Enabled level: 20')).toBeInTheDocument()
        expect(screen.getByText('Active role: qaUser')).toBeInTheDocument()
        expect(screen.getByText(/Features:.*"classificationVote":true/)).toBeInTheDocument()
    })
})

const dayjsNow = () => new Date().toISOString()
