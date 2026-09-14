// src/test/render.jsx
import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter, HashRouter } from 'react-router-dom'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import AppContext from '../app/AppContext.jsx'
import APIContext from '../app/APIContext.jsx'
import ScoringContext from '../context/ScoringContext.jsx'
import { SystemMessageProvider } from '../systemMessage/SystemMessageContext.jsx'

export const defaultTestContextValues = {
    auth: {
        authLoaded: true,
        isLoggedIn: false,
        user: null,
        userClaims: [],
        initialUser: 'no'
    },
    db: {
        dbLoaded: true,
        adminRole: false,
        qaUserRole: false,
        lockCollection: {},
        pickerActivity: [],
        systemMessages: [],
        userLockNotes: {}
    },
    api: {
        fetchProfileSummary: async () => null,
        fetchProfileFull: async () => null
    },
    app: {
        beta: false,
        adminEnabled: false,
        qaUserEnabled: false,
        version: '2024-01-01',
        updateRequired: false,
        updateAvailable: false,
        compact: false
    },
    scoring: {
        scoredActivity: [],
        bbCount: 0,
        danPoints: 0,
        eligibleDan: 0,
        nextDanPoints: 0,
        nextDanLocks: 0,
        uniqueLocks: 0
    }
}

const withDefaults = (key, overrides) => ({...defaultTestContextValues[key], ...overrides})

export const renderWithProviders = (ui, {
    auth,
    db,
    api,
    app,
    scoring
} = {}) => {
    const Wrapper = ({children}) => (
        <AuthContext.Provider value={withDefaults('auth', auth)}>
            <DBContext.Provider value={withDefaults('db', db)}>
                <APIContext.Provider value={withDefaults('api', api)}>
                    <AppContext.Provider value={withDefaults('app', app)}>
                        <SystemMessageProvider>
                            <ScoringContext.Provider value={withDefaults('scoring', scoring)}>
                                {children}
                            </ScoringContext.Provider>
                        </SystemMessageProvider>
                    </AppContext.Provider>
                </APIContext.Provider>
            </DBContext.Provider>
        </AuthContext.Provider>
    )

    return render(ui, {wrapper: Wrapper})
}

/**
 * Render with Providers + Router
 * @param {React.ReactNode} ui
 * @param {{ route?: string, useHash?: boolean, initialEntries?: string[], auth?: object, db?: object, api?: object, app?: object, scoring?: object }} opts
 */
export const renderWithRouter = (ui, {
    route = '/',
    useHash = false,
    initialEntries,
    ...providerOptions
} = {}) => {
    const Router = ({ children }) => {
        if (useHash) {
            // keep HashRouter semantics if you prefer
            window.location.hash = route.startsWith('#') ? route : `#${route}`
            return <HashRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>{children}</HashRouter>
        }
        // MemoryRouter is ideal for tests (fast, fully in-memory)
        return (
            <MemoryRouter
                initialEntries={initialEntries ?? [route]}
                future={{v7_startTransition: true, v7_relativeSplatPath: true}}
            >
                {children}
            </MemoryRouter>
        )
    }

    return renderWithProviders(
        <Router>{ui}</Router>,
        providerOptions
    )
}
