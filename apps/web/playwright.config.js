import {defineConfig} from '@playwright/test'

export default defineConfig({
    testDir: 'tests/e2e',
    outputDir: 'tests-results',
    timeout: 60_000,
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [['list', { printSteps: true }], ['html', { open: 'never' }], ['allure-playwright']],
    use: {
        baseURL: 'http://127.0.0.1:5173',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        serviceWorkers: 'block'
    },
    webServer: {
        command: 'VITE_DISABLE_FIRESTORE_SUBSCRIPTIONS=true npm run build:test && npm run preview -- --host 127.0.0.1 --port 5173 --strictPort',
        url: 'http://127.0.0.1:5173',
        reuseExistingServer: false,
        timeout: 120_000
    }
})
