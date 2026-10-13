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
import ClassificationParentRoute from '../../src/classification/ClassificationParentRoute.jsx'
import {ThemeProvider} from '@mui/material/styles'
import {darkTheme} from '../../src/app/Theme.jsx'

function renderClassification(auth, db = {}) {
    return render(
        <AuthContext.Provider value={auth}>
            <DBContext.Provider value={{lockCollection: {}, ...db}}>
                <AccessProvider>
                    <MemoryRouter initialEntries={['/classification']}>
                        <Routes>
                            <Route path='/classification' element={<ClassificationParentRoute/>}>
                                <Route index element={<div>Classification content</div>}/>
                            </Route>
                            <Route path='/locks' element={<div>Locks content</div>}/>
                        </Routes>
                    </MemoryRouter>
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

    it('keeps reports behind the admin route guard', async () => {
        const adminRoute = routes.find(route => route.path === '/admin')
        const {element} = await adminRoute.lazy()

        expect(element.props.roles).toEqual(['admin'])
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

    it.each([
        ['admin', ['admin'], true, true, true],
        ['classification administrator', ['classificationAdmin'], true, false, false],
        ['moderator', ['lpuMod'], true, false, false],
        ['classification team', ['classificationTeam'], true, false, false],
        ['legacy tools role', ['lpuAdmin'], false, false, false]
    ])('shows the permitted menu options for a %s', (_label, userClaims, classification, reports, tools) => {
        renderWithProviders(
            <ThemeProvider theme={darkTheme}>
                <AccessProvider><MemoryRouter><MainMenu/></MemoryRouter></AccessProvider>
            </ThemeProvider>,
            {
                auth: {...signedInAuth, userClaims},
                db: {adminRole: userClaims.includes('admin')}
            }
        )

        fireEvent.click(screen.getByRole('button', {name: 'Main Menu'}))
        expect(Boolean(screen.queryByRole('button', {name: 'Classification'}))).toBe(classification)
        expect(Boolean(screen.queryByRole('button', {name: 'Reports'}))).toBe(reports)
        expect(Boolean(screen.queryByRole('button', {name: 'Admin Tools'}))).toBe(tools)
        expect(Boolean(screen.queryByRole('button', {name: 'Server Status'}))).toBe(tools)
        if (reports) {
            expect(screen.getByRole('button', {name: 'Site Report'})).toHaveStyle({color: darkTheme.roles.admin})
        }
    })
})
