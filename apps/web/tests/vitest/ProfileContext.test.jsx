import React, {useContext, useState} from 'react'
import {screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import AuthContext from '../../src/app/AuthContext.jsx'
import ProfileContext, {ProfileProvider} from '../../src/app/ProfileContext.jsx'
import {renderWithProviders} from '../../src/test/render.jsx'

function ProfileState() {
    const {data, loading, error, isFullProfile, source, isSelf, adminUser} = useContext(ProfileContext)

    return (
        <dl>
            <dt>Profile</dt><dd>{data?.profile?.displayName || 'none'}</dd>
            <dt>Private</dt><dd>{data?.profile?.privateNote || 'none'}</dd>
            <dt>Loading</dt><dd>{String(loading)}</dd>
            <dt>Error</dt><dd>{error?.message || 'none'}</dd>
            <dt>Full</dt><dd>{String(isFullProfile)}</dd>
            <dt>Source</dt><dd>{source || 'none'}</dd>
            <dt>Self</dt><dd>{String(isSelf)}</dd>
            <dt>Admin</dt><dd>{String(adminUser)}</dd>
        </dl>
    )
}

const valueFor = label => screen.getByText(label).nextElementSibling

function renderProfile({userId = 'profile-owner', auth, db, api, scoring} = {}) {
    return renderWithProviders(
        <ProfileProvider userId={userId}>
            <ProfileState/>
        </ProfileProvider>,
        {auth, db, api, scoring}
    )
}

describe('ProfileContext', () => {
    it('returns the existing full DB subscription for the signed-in user', () => {
        const getProfile = vi.fn()
        const fetchProfileSummary = vi.fn()

        renderProfile({
            auth: {
                isLoggedIn: true,
                user: {uid: 'profile-owner'},
                userClaims: []
            },
            db: {
                dbLoaded: true,
                lockCollection: {displayName: 'Owner', privateNote: 'subscribed'},
                getProfile
            },
            api: {fetchProfileSummary},
            scoring: {danPoints: 12}
        })

        expect(valueFor('Profile')).toHaveTextContent('Owner')
        expect(valueFor('Private')).toHaveTextContent('subscribed')
        expect(valueFor('Full')).toHaveTextContent('true')
        expect(valueFor('Source')).toHaveTextContent('db-full')
        expect(valueFor('Self')).toHaveTextContent('true')
        expect(getProfile).not.toHaveBeenCalled()
        expect(fetchProfileSummary).not.toHaveBeenCalled()
    })

    it.each([
        ['an anonymous visitor', {isLoggedIn: false, user: null, userClaims: []}],
        ['an ordinary signed-in user', {isLoggedIn: true, user: {uid: 'viewer'}, userClaims: []}]
    ])('returns only the API summary for %s viewing another user', async (_label, auth) => {
        const getProfile = vi.fn()
        const fetchProfileSummary = vi.fn().mockResolvedValue({displayName: 'Public profile'})

        renderProfile({auth, db: {getProfile}, api: {fetchProfileSummary}})

        expect(valueFor('Loading')).toHaveTextContent('true')
        await waitFor(() => expect(valueFor('Profile')).toHaveTextContent('Public profile'))
        expect(valueFor('Full')).toHaveTextContent('false')
        expect(valueFor('Source')).toHaveTextContent('api-summary')
        expect(fetchProfileSummary).toHaveBeenCalledWith('profile-owner')
        expect(getProfile).not.toHaveBeenCalled()
    })

    it.each(['admin'])('returns a full DB profile for the %s claim even when local admin mode is disabled', async claim => {
        const getProfile = vi.fn().mockResolvedValue({displayName: 'Full profile', privateNote: 'authorized'})
        const fetchProfileSummary = vi.fn()

        renderProfile({
            auth: {
                isLoggedIn: true,
                user: {uid: 'administrator'},
                userClaims: [claim]
            },
            db: {getProfile},
            api: {fetchProfileSummary}
        })

        await waitFor(() => expect(valueFor('Profile')).toHaveTextContent('Full profile'))
        expect(valueFor('Private')).toHaveTextContent('authorized')
        expect(valueFor('Full')).toHaveTextContent('true')
        expect(valueFor('Source')).toHaveTextContent('db-full-admin')
        expect(valueFor('Admin')).toHaveTextContent('true')
        expect(getProfile).toHaveBeenCalledWith('profile-owner')
        expect(fetchProfileSummary).not.toHaveBeenCalled()
    })

    it('reports profile request failures without exposing stale data', async () => {
        const error = new Error('permission denied')
        const fetchProfileSummary = vi.fn().mockRejectedValue(error)

        renderProfile({api: {fetchProfileSummary}})

        await waitFor(() => expect(valueFor('Error')).toHaveTextContent('permission denied'))
        expect(valueFor('Profile')).toHaveTextContent('none')
        expect(valueFor('Full')).toHaveTextContent('false')
        expect(valueFor('Loading')).toHaveTextContent('false')
    })

    it('discards a slower profile response after the requested user changes', async () => {
        const user = userEvent.setup()
        let resolveFirst
        const firstRequest = new Promise(resolve => {
            resolveFirst = resolve
        })
        const fetchProfileSummary = vi.fn(userId => {
            return userId === 'first-user'
                ? firstRequest
                : Promise.resolve({displayName: 'Second profile'})
        })

        function SwitchableProfile() {
            const [userId, setUserId] = useState('first-user')
            return (
                <React.Fragment>
                    <button onClick={() => setUserId('second-user')}>Change user</button>
                    <ProfileProvider userId={userId}>
                        <ProfileState/>
                    </ProfileProvider>
                </React.Fragment>
            )
        }

        renderWithProviders(<SwitchableProfile/>, {api: {fetchProfileSummary}})
        await user.click(screen.getByRole('button', {name: 'Change user'}))
        await waitFor(() => expect(valueFor('Profile')).toHaveTextContent('Second profile'))

        resolveFirst({displayName: 'Stale first profile', privateNote: 'must not leak'})
        await waitFor(() => expect(fetchProfileSummary).toHaveBeenCalledTimes(2))
        expect(valueFor('Profile')).toHaveTextContent('Second profile')
        expect(valueFor('Private')).toHaveTextContent('none')
    })

    it('removes full-profile data when an administrator loses authorization', async () => {
        const user = userEvent.setup()
        const getProfile = vi.fn().mockResolvedValue({
            displayName: 'Full profile',
            privateNote: 'must be removed'
        })
        const fetchProfileSummary = vi.fn().mockResolvedValue({displayName: 'Public profile'})

        function RoleSwitchProfile() {
            const [isAdmin, setIsAdmin] = useState(true)
            const auth = isAdmin
                ? {isLoggedIn: true, user: {uid: 'administrator'}, userClaims: ['admin']}
                : {isLoggedIn: false, user: null, userClaims: []}

            return (
                <AuthContext.Provider value={auth}>
                    <button onClick={() => setIsAdmin(false)}>Remove authorization</button>
                    <ProfileProvider userId='profile-owner'>
                        <ProfileState/>
                    </ProfileProvider>
                </AuthContext.Provider>
            )
        }

        renderWithProviders(<RoleSwitchProfile/>, {
            db: {getProfile},
            api: {fetchProfileSummary}
        })

        await waitFor(() => expect(valueFor('Private')).toHaveTextContent('must be removed'))
        await user.click(screen.getByRole('button', {name: 'Remove authorization'}))
        await waitFor(() => expect(valueFor('Profile')).toHaveTextContent('Public profile'))

        expect(valueFor('Private')).toHaveTextContent('none')
        expect(valueFor('Full')).toHaveTextContent('false')
        expect(valueFor('Source')).toHaveTextContent('api-summary')
    })
})
