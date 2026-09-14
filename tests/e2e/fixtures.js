import {expect, test as base} from '@playwright/test'

const loopbackHosts = new Set(['127.0.0.1', '::1', 'localhost'])
const transparentPixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
    'base64'
)

export const test = base.extend({
    context: async ({context}, use) => {
        await context.route(/^https?:\/\//, async route => {
            const request = route.request()
            const hostname = new URL(request.url()).hostname

            if (loopbackHosts.has(hostname)) {
                await route.continue()
                return
            }

            if (hostname === 'fonts.googleapis.com' && request.resourceType() === 'stylesheet') {
                await route.fulfill({
                    status: 200,
                    contentType: 'text/css',
                    body: ''
                })
                return
            }

            if (request.resourceType() === 'image') {
                await route.fulfill({
                    status: 200,
                    contentType: 'image/png',
                    body: transparentPixel
                })
                return
            }

            await route.abort('blockedbyclient')
        })

        await use(context)
    },
    page: async ({page}, use) => {
        const browserProblems = []
        const failedModules = []

        page.on('console', message => {
            if (['error', 'warning'].includes(message.type())) {
                const location = message.location()
                const source = location.url ? ` (${location.url}:${location.lineNumber})` : ''
                browserProblems.push(`${message.type()}: ${message.text()}${source}`)
            }
        })
        page.on('pageerror', error => browserProblems.push(`pageerror: ${error.message}`))
        page.on('requestfailed', request => {
            const url = new URL(request.url())
            if (request.resourceType() === 'script' && loopbackHosts.has(url.hostname)) {
                failedModules.push(`${request.method()} ${request.url()}: ${request.failure()?.errorText}`)
            }
        })

        await use(page)

        expect(browserProblems, 'unexpected browser console warnings/errors').toEqual([])
        expect(failedModules, 'failed application module requests').toEqual([])
    }
})

export {expect}
