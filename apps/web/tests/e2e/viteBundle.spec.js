import {readdir} from 'node:fs/promises'
import path from 'node:path'

import {test, expect} from './fixtures'

test('preview serves every emitted JavaScript chunk', async ({request}) => {
    const assetsDirectory = path.resolve('dist/assets')
    const assetNames = await readdir(assetsDirectory)
    const scriptNames = assetNames.filter(assetName => assetName.endsWith('.js'))

    expect(scriptNames.length).toBeGreaterThan(10)
    expect(scriptNames.some(assetName => assetName.startsWith('AwardRoute-'))).toBe(true)
    expect(scriptNames.some(assetName => assetName.startsWith('BeltsMarkdownRoute-'))).toBe(true)

    const failedRequests = []
    for (const scriptName of scriptNames) {
        const response = await request.get(`/assets/${scriptName}`)
        if (!response.ok()) {
            failedRequests.push(`${scriptName}: ${response.status()}`)
        }
    }

    expect(failedRequests, 'emitted chunks that preview could not serve').toEqual([])
})
