import React from 'react'
import {fireEvent, render, screen} from '@testing-library/react'
import {MemoryRouter, Route, Routes} from 'react-router-dom'
import {describe, expect, it} from 'vitest'
import MainMenu from '../../src/nav/MainMenu.jsx'
import routes from '../../src/app/routes.jsx'
import RankedRoute from '../../src/classification/RankedRoute.jsx'
import {renderWithProviders} from '../../src/test/render.jsx'
import AuthContext from '../../src/app/AuthContext.jsx'
import DBContext from '../../src/app/DBContext.jsx'
import {AccessProvider} from '../../src/app/AccessContext.jsx'
import ProfileContext from '../../src/app/ProfileContext.jsx'
import ClassificationParentRoute from '../../src/classification/ClassificationParentRoute.jsx'

function renderClassification(auth, db = {}) {
    return render(
        <AuthContext.Provider value={auth}>
            <DBContext.Provider value={{lockCollection: {}, ...db}}>
                <AccessProvider>
                    <ProfileContext.Provider value={{data: null}}>
                        <MemoryRouter initialEntries={['/classification']}>
                            <Routes>
                                <Route path='/classification' element={<ClassificationParentRoute/>}>
                                    <Route index element={<div>Classification content</div>}/>
                                </Route>
                                <Route path='/locks' element={<div>Locks content</div>}/>
                            </Routes>
                        </MemoryRouter>
                    </ProfileContext.Provider>
                </AccessProvider>
            </DBContext.Provider>
        </AuthContext.Provider>
    )
}

const signedInAuth = {
    authLoaded: true,
    isLoggedIn: true,
    user: {uid: 'member'},
    userClaims: []
}

describe('Classification access', () => {
    it('configures the classification parent route', async () => {
        const classificationRoute = routes.find(route => route.path === '/classification')
        const {element} = await classificationRoute.lazy()
        const rankedRoute = classificationRoute.children.find(route => route.path === '/classification/ranked')

        expect(element.type).toBe(ClassificationParentRoute)
        expect((await rankedRoute.lazy()).element.type).toBe(RankedRoute)
    })

    it('admits a signed-in user with a black-belt claim before their profile loads', () => {
        renderClassification({...signedInAuth, userClaims: ['blackBelt']})

        expect(screen.getByText('Classification content')).toBeInTheDocument()
    })

    it('waits for claims while authentication is loading', () => {
        renderClassification({...signedInAuth, authLoaded: false, userClaims: []})

        expect(screen.getByRole('heading', {name: 'Loading'})).toBeInTheDocument()
        expect(screen.queryByText('Locks content')).not.toBeInTheDocument()
    })

    it('does not grant access from a black-belt profile without the claim', () => {
        renderClassification(signedInAuth, {
            profileUserId: 'member',
            lockCollection: {blackBeltAwardedAt: 1_700_000_000}
        })

        expect(screen.getByText('Not authorized.')).toBeInTheDocument()
        expect(screen.queryByText('Classification content')).not.toBeInTheDocument()
    })

    it('offers a signed-in member without a qualifying claim a way back to locks', () => {
        renderClassification(signedInAuth, {
            profileUserId: 'member',
            lockCollection: {blackBeltAwardedAt: 0}
        })

        expect(screen.getByText('Not authorized.')).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', {name: 'Continue'}))
        expect(screen.getByText('Locks content')).toBeInTheDocument()
    })

    it('admits an authenticated classification team claim', () => {
        renderClassification({...signedInAuth, userClaims: ['classificationTeam']})

        expect(screen.getByText('Classification content')).toBeInTheDocument()
    })

    it('asks an anonymous visitor to sign in despite a black-belt profile value', async () => {
        renderClassification({authLoaded: true, isLoggedIn: false, user: null}, {
            profileUserId: 'member',
            lockCollection: {blackBeltAwardedAt: 1_700_000_000}
        })

        expect(await screen.findByText('You must be signed in to continue.')).toBeInTheDocument()
        expect(screen.queryByText('Classification content')).not.toBeInTheDocument()
    })

    it('shows Classification in the menu for a black-belt claim', () => {
        renderWithProviders(
            <AccessProvider><MemoryRouter><MainMenu/></MemoryRouter></AccessProvider>,
            {
                auth: {...signedInAuth, userClaims: ['blackBelt']}
            }
        )

        fireEvent.click(screen.getByRole('button', {name: 'Main Menu'}))
        expect(screen.getByText('Classification')).toBeInTheDocument()
    })

    it('hides Classification in the menu without a claim despite a black-belt profile', () => {
        renderWithProviders(
            <AccessProvider><MemoryRouter><MainMenu/></MemoryRouter></AccessProvider>,
            {
                auth: signedInAuth,
                db: {
                    profileUserId: 'previous-member',
                    lockCollection: {blackBeltAwardedAt: 1_700_000_000}
                }
            }
        )

        fireEvent.click(screen.getByRole('button', {name: 'Main Menu'}))
        expect(screen.queryByText('Classification')).not.toBeInTheDocument()
    })
})
