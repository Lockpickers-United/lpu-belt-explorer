import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {visualizer} from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000
    },
    preview: {
        port: 3000
    },
    build: {
        target: 'esnext' //browsers can handle the latest ES features
    },
    plugins: [react(), visualizer()],
    assetsInclude: ['**/*.md']
})
