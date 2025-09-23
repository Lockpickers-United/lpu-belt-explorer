import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        clearMocks: true,
        globals: true,
        setupFiles: ['./src/setupTests.js'],
        environment: 'jsdom',
        testTimeout: 20000,
        env: {
            TZ: 'UTC'
        },
        include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}']
    }
})
