// src/test/render.jsx
import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, HashRouter } from 'react-router-dom'
import { DBProvider } from '../app/DBContext.jsx'
import { AuthProvider } from '../app/AuthContext.jsx'
import { AppProvider } from '../app/AppContext.jsx'
import { SystemMessageProvider } from '../systemMessage/SystemMessageContext.jsx'

/**
 * Render with Providers + Router
 * @param {React.ReactNode} ui
 * @param {{ route?: string, useHash?: boolean, initialEntries?: string[] }} opts
 */
export const renderWithRouter = (ui, { route = '/', useHash = false, initialEntries } = {}) => {
    const Router = ({ children }) => {
        if (useHash) {
            // keep HashRouter semantics if you prefer
            window.location.hash = route.startsWith('#') ? route : `#${route}`
            return <HashRouter>{children}</HashRouter>
        }
        // MemoryRouter is ideal for tests (fast, fully in-memory)
        return <MemoryRouter initialEntries={initialEntries ?? [route]}>{children}</MemoryRouter>
    }

    return render(
        <AuthProvider>
            <DBProvider>
                <AppProvider>
                    <SystemMessageProvider>
                        <Router>
                                {ui}
                        </Router>
                    </SystemMessageProvider>
                </AppProvider>
            </DBProvider>
        </AuthProvider>
    )
}

