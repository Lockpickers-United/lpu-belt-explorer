import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer"

// https://vitejs.dev/config/
export default defineConfig({
    base: '/lpu-belt-explorer/',
    server: {
        port: 3000
    },
    plugins: [react(), visualizer()],
    assetsInclude: ['**/*.md']
})
