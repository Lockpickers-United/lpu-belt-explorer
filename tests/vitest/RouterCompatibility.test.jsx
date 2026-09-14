import React from 'react'
import {screen, waitFor} from '@testing-library/react'
import {createMemoryRouter, Outlet, RouterProvider} from 'react-router-dom'
import {afterEach, describe, expect, it, vi} from 'vitest'
import AdminRoute from '../../src/admin/AdminRoute.jsx'
import routes from '../../src/app/routes.jsx'
import {renderWithProviders} from '../../src/test/render.jsx'

vi.mock('../../src/app/Tracker.jsx', () => ({default: () => null}))
vi.mock('../../src/util/useData.jsx', () => ({
    default: () => ({data: {}, loading: false, error: false, errorMessage: false})
}))

const compatibilityRoutes = routes.map(route => {
    return route.path === '/locks'
        ? {path: '/locks', element: <h1>Locks route test double</h1>}
        : route
})

const renderRouter = (initialEntry, routeConfig = compatibilityRoutes, providerOptions) => {
    const router = createMemoryRouter(routeConfig, {initialEntries: [initialEntry]})
    renderWithProviders(
        <RouterProvider router={router} future={{v7_startTransition: true}}/>,
        providerOptions
    )
    return router
}

describe('route compatibility contracts', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it.each(['/', '/belts', '/does-not-exist'])('redirects %s to the lock list', async initialEntry => {
        const router = renderRouter(initialEntry)

        expect(await screen.findByRole('heading', {name: 'Locks route test double'})).toBeInTheDocument()
        expect(router.state.location.pathname).toBe('/locks')
    })

    it('loads a representative lazy route from the real route tree', async () => {
        const router = renderRouter('/info?source=compatibility')

        await waitFor(() => {
            expect(screen.getByRole('heading', {name: 'Earn Lockpicking Karate Flair'})).toBeInTheDocument()
        })
        expect(router.state.location.search).toBe('?source=compatibility')
    })

    it('renders the configured route error boundary', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const errorElement = routes.find(route => route.path === '/').errorElement
        renderRouter('/failure', [{
            path: '/failure',
            loader: () => {
                throw new Error('compatibility failure')
            },
            errorElement,
            element: <Outlet/>
        }])

        expect(await screen.findByRole('heading', {name: 'Something went wrong...'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Reload'})).toBeInTheDocument()
    })

    it.each([
        ['anonymous users', false],
        ['administrators', true]
    ])('enforces admin route access for %s', async (_label, adminRole) => {
        const router = createMemoryRouter([{
            path: '/admin',
            element: <AdminRoute/>,
            children: [{index: true, element: <div>Administrative content</div>}]
        }], {initialEntries: ['/admin']})

        renderWithProviders(<RouterProvider router={router} future={{v7_startTransition: true}}/>, {
            auth: {authLoaded: true},
            db: {adminRole}
        })

        if (adminRole) {
            expect(await screen.findByText('Administrative content')).toBeInTheDocument()
        } else {
            await waitFor(() => expect(screen.queryByText('Administrative content')).not.toBeInTheDocument())
        }
    })
})
