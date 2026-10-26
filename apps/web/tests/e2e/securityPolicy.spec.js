import {test, expect} from './fixtures'

test('HTML policy blocks inline handlers, external base URLs and external form submissions', async ({context}) => {
    // Use a separate page because these deliberate violations produce expected console errors.
    const page = await context.newPage()
    const externalRequests = []
    page.on('request', request => {
        if (new URL(request.url()).hostname === 'audit.example.invalid') {
            externalRequests.push(request.url())
        }
    })
    await page.addInitScript(() => {
        window.auditViolations = []
        document.addEventListener('securitypolicyviolation', event => {
            window.auditViolations.push(event.effectiveDirective)
        })
    })
    await page.goto('/#/locks')
    await expect(page.getByRole('list', {name: 'Locks'})).toBeVisible()
    const originalUrl = page.url()

    await page.evaluate(() => {
        const button = document.createElement('button')
        button.setAttribute('onclick', 'window.auditInlineHandlerRan = true')
        document.body.append(button)
        button.click()

        const base = document.createElement('base')
        base.href = 'https://audit.example.invalid/'
        document.head.append(base)

        const form = document.createElement('form')
        form.action = 'https://audit.example.invalid/submit'
        document.body.append(form)
        form.requestSubmit()
    })

    await expect.poll(() => page.evaluate(() => window.auditViolations)).toEqual(
        expect.arrayContaining(['script-src-attr', 'base-uri', 'form-action'])
    )
    expect(await page.evaluate(() => window.auditInlineHandlerRan)).toBeUndefined()
    expect(await page.evaluate(() => document.baseURI)).toBe(page.url())
    expect(externalRequests).toEqual([])
    // Read the document URL directly: CSP-cancelled form navigation can leave
    // Playwright's navigation-aware URL matcher waiting for a commit.
    expect(await page.evaluate(() => location.href)).toBe(originalUrl)
    await page.close()
})

test('cross-origin image requests omit the page path and query from the referrer', async ({page}) => {
    let referrer
    await page.route('https://audit.example.invalid/referrer.svg', async route => {
        referrer = route.request().headers().referer
        await route.fulfill({
            contentType: 'image/svg+xml',
            body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'
        })
    })
    await page.goto('/?audit=private#/locks')
    await expect(page.getByRole('list', {name: 'Locks'})).toBeVisible()
    await page.evaluate(() => {
        const image = document.createElement('img')
        image.src = 'https://audit.example.invalid/referrer.svg'
        document.body.append(image)
    })

    await expect.poll(() => referrer).toBe(`${new URL(page.url()).origin}/`)
})
