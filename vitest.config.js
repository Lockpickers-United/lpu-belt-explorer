import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
    globals: true,
    clearMocks: true,
    include: [
      'tests/vitest/**/*.{test,spec}.{js,jsx}',
      'src/**/*.{test,spec}.{js,jsx}'
    ],
    exclude: [
      'tests/e2e/**',
      '**/node_modules/**',
      '**/dist/**',
      'functions/**',
      'server/**'
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.{test,spec}.{js,jsx}',
        'src/index.jsx',
        'src/main.jsx'
      ],
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage'
    }
  }
})
