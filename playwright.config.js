import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
    outputDir: 'tests-results',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'vite preview --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
