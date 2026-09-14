import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {visualizer} from 'rollup-plugin-visualizer'
import dotenv from 'dotenv'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    if (mode !== 'test') {
        dotenv.config({path: '.env.keysNew', quiet: true})
    }

    return {
        server: {
            port: 3000
        },
        preview: {
            port: 3000
        },
        plugins: [react(), mode === 'test' ? null : visualizer()].filter(Boolean),
        assetsInclude: ['**/*.md']
    }
})
