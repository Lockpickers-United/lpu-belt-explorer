import React from 'react'
import {act, fireEvent, render, screen} from '@testing-library/react'
import {Link, MemoryRouter, Route, Routes} from 'react-router-dom'
import {beforeEach, describe, expect, it, vi} from 'vitest'
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
import {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'

const firestore = vi.hoisted(() => ({listeners: [], mode: 'success'}))
vi.mock('firebase/firestore', async importOriginal => ({
    ...await importOriginal(),
    collection: (_db, name) => ({name}),
    where: (field, operator, value) => ({field, operator, value}),
    query: (source, filter) => ({...source, filter}),
    onSnapshot: (source, next, error) => {
        const unsubscribe = vi.fn()
        firestore.listeners.push({source, next, error, unsubscribe})
        if (firestore.mode === 'success') next({docs: []})
        return unsubscribe
    }
}))

function renderClassification(auth, db = {}, path = '/classification') {
    return render(
        <AuthContext.Provider value={auth}>
            <DBContext.Provider value={{lockCollection: {}, ...db}}>
                <AccessProvider>
                    <ClassificationProvider>
                        <MemoryRouter initialEntries={[path]}>
                            <Routes>
                                <Route path='/classification' element={<ClassificationParentRoute/>}>
                                    <Route index element={<div>Classification content <Link to='/classification/past'>Past</Link></div>}/>
                                    <Route path='past' element={<div>Historical content</div>}/>
                                </Route>
                                <Route path='/locks' element={<div>Locks content</div>}/>
                            </Routes>
                        </MemoryRouter>
                    </ClassificationProvider>
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
    beforeEach(() => {
        firestore.listeners.length = 0
        firestore.mode = 'success'
    })

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

        expect(element.props.roles).toEqual(['admin', 'lpuMod'])
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
        expect(firestore.listeners).toHaveLength(0)
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

    it('shows loading until both owner and summary readers respond', () => {
        firestore.mode = 'pending'
        renderClassification({...signedInAuth, userClaims: ['classificationTeam']})

        expect(screen.getByText('Loading classification data')).toBeInTheDocument()
        expect(screen.queryByText('Classification content')).not.toBeInTheDocument()
        const summary = firestore.listeners.find(listener => listener.source.name === 'classificationEntries')
        act(() => summary.next({docs: []}))
        expect(screen.getByText('Loading classification data')).toBeInTheDocument()
        act(() => firestore.listeners.filter(listener => listener.source.name !== 'classificationEntries')
            .forEach(listener => listener.next({docs: []})))
        expect(screen.getByText('Classification content')).toBeInTheDocument()
    })

    it.each(['classificationEntries', 'classificationVotes'])('shows the route error for a failed %s read', name => {
        firestore.mode = 'pending'
        renderClassification({...signedInAuth, userClaims: ['classificationTeam']})

        const listener = firestore.listeners.find(item => item.source.name === name)
        act(() => listener.error(new Error('permission denied')))
        expect(screen.getByText('There was an error loading the classification data.')).toBeInTheDocument()
        expect(screen.queryByText('Classification content')).not.toBeInTheDocument()
    })

    it('keeps the historical route free of a modern summary listener', () => {
        renderClassification({...signedInAuth, userClaims: ['classificationTeam']}, {}, '/classification/past')

        expect(screen.getByText('Historical content')).toBeInTheDocument()
        expect(firestore.listeners.map(listener => listener.source.name)).not.toContain('classificationEntries')
    })

    it('releases the modern summary reader when navigating to the historical route', () => {
        renderClassification({...signedInAuth, userClaims: ['classificationTeam']})
        const summary = firestore.listeners.find(listener => listener.source.name === 'classificationEntries')

        fireEvent.click(screen.getByRole('link', {name: 'Past'}))

        expect(screen.getByText('Historical content')).toBeInTheDocument()
        expect(summary.unsubscribe).toHaveBeenCalledOnce()
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
