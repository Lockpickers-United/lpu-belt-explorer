import fs from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {describe, expect, it} from 'vitest'

const configPath = fileURLToPath(new URL('../../ecosystem.prod.json', import.meta.url))

describe('production PM2 configuration', () => {
    it('tracks the reviewed parallel production process definition', async () => {
        const config = JSON.parse(await fs.readFile(configPath, 'utf8'))

        expect(config.apps).toHaveLength(1)
        expect(config.apps[0]).toMatchObject({
            name: 'lpubelts-api-server-prod-next',
            cwd: '/home/lpubelts_api/apps/api-server-prod/current',
            script: '/home/lpubelts_api/apps/api-server-prod/current/src/lpubeltsApiServer.js',
            instances: 1,
            exec_mode: 'fork',
            min_uptime: '10s',
            kill_timeout: 12000,
            env: {NODE_ENV: 'production'}
        })
    })
})
