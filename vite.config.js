import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {visualizer} from 'rollup-plugin-visualizer'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.keys' })

// https://vitejs.dev/config/
export default defineConfig({

    server: {
        port: 3000
    },
    preview: {
        port: 3000
    },
    plugins: [react(), visualizer()],
    assetsInclude: ['**/*.md']
})
