import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

import dotenv from 'dotenv'

dotenv.config({ path: '.env.keys' })

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
    globals: true,
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**', 'server/**'],
    coverage: {
      reporter: ['text', 'lcov'],
      thresholds: { lines: 70, functions: 70, branches: 60, statements: 70 }
    }
  }
})
