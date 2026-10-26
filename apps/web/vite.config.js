import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {visualizer} from 'rollup-plugin-visualizer'
import dotenv from 'dotenv'
import {fileURLToPath} from 'node:url'

const webRoot = fileURLToPath(new URL('./', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    if (mode !== 'test') {
        dotenv.config({path: new URL('./.env.keys', import.meta.url), quiet: true})
    }

    return {
        envDir: webRoot,
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
