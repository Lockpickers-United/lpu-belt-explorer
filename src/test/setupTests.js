import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import {assertSafeTestEnvironment} from '../app/assertSafeTestEnvironment'
import { server } from './testServer'

assertSafeTestEnvironment(import.meta.env)

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
      adminEnabled: false,
      setAdminEnabled: vi.fn(),
      qaUserEnabled: false,
      setQaUserEnabled: vi.fn(),
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

// Keep the frontend suite independent of Firestore. Emulator-backed DBContext
// tests will use a separate configuration in a later testing phase.
vi.mock('../app/DBContext.jsx', () => {
  const React = require('react')
  const DBContext = React.createContext({})
  const DBProvider = ({ children }) => {
    const value = {
      dbLoaded: true,
      adminRole: false,
      qaUserRole: false,
      lockCollection: {},
      pickerActivity: [],
      systemMessages: [],
      userLockNotes: {},
      addToLockCollection: vi.fn(),
      removeFromLockCollection: vi.fn(),
      getProfile: vi.fn(),
      updateProfileField: vi.fn(),
      updateProfileDisplayName: vi.fn(),
      addPickerActivity: vi.fn(),
      updatePickerActivity: vi.fn(),
      removePickerActivity: vi.fn(),
      getPickerActivity: vi.fn(),
      refreshPickerActivity: vi.fn(),
      importUnclaimedEvidence: vi.fn(),
      createEvidenceForEntries: vi.fn(),
      deleteAllUserData: vi.fn(),
      oauthState: vi.fn(),
      getBookmarkForRedditUser: vi.fn(),
      advanceBookmarkForRedditUser: vi.fn(),
      setDiscordUserInfo: vi.fn(),
      removeServiceAuth: vi.fn(),
      peekAtDiscordAwards: vi.fn(),
      getAllSystemMessages: vi.fn(),
      updateSystemMessage: vi.fn(),
      updateSystemMessageStatus: vi.fn(),
      removeDismissedMessages: vi.fn()
    }
    return React.createElement(DBContext.Provider, { value }, children)
  }
  return { default: DBContext, DBProvider }
})

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
