import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './testServer'

// Mock AuthContext to avoid async state updates from Firebase during tests
vi.mock('../app/AuthContext.jsx', () => {
  const React = require('react')
  const AuthContext = React.createContext({})
  const AuthProvider = ({ children }) => {
    const value = {
      authLoaded: true,
      isLoggedIn: false,
      user: null,
      userClaims: [],
      login: vi.fn(),
      logout: vi.fn()
    }
    return React.createElement(AuthContext.Provider, { value }, children)
  }
  return { default: AuthContext, AuthProvider }
})

// Mock AppContext to avoid window/localStorage and fetch usage during tests
vi.mock('../app/AppContext.jsx', () => {
  const React = require('react')
  const AppContext = React.createContext({})
  const AppProvider = ({ children }) => {
    const value = {
      beta: false,
      setBeta: vi.fn(),
      admin: false,
      setAdmin: vi.fn(),
      version: '2024-01-01',
      updateRequired: false,
      updateAvailable: false,
      compact: false,
      setCompact: vi.fn()
    }
    return React.createElement(AppContext.Provider, { value }, children)
  }
  return { default: AppContext, AppProvider }
})

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
