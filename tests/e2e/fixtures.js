import {expect, test as base} from '@playwright/test'

const loopbackHosts = new Set(['127.0.0.1', '::1', 'localhost'])

export const test = base.extend({
    context: async ({context}, use) => {
        await context.route(/^https?:\/\//, async route => {
            const hostname = new URL(route.request().url()).hostname

            if (loopbackHosts.has(hostname)) {
                await route.continue()
                return
            }

            await route.abort('blockedbyclient')
        })

        await use(context)
    }
})

export {expect}
