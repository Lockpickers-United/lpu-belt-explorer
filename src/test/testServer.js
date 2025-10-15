import { setupServer } from 'msw/node'
import { handlers } from './handlers/locks'

export const server = setupServer(...handlers)
