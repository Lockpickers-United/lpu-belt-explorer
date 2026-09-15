import {test, expect} from './fixtures'

test('hash routes preserve search and browser history across refreshes', async ({page}) => {
    await page.goto('/#/info?source=router-upgrade')
    await expect(page.getByRole('heading', {name: 'Earn Lockpicking Karate Flair'})).toBeVisible()

    await page.goto('/#/projects')
    await expect(page.getByRole('heading', {name: 'Tier levels'})).toBeVisible()

    await page.goBack()
    await expect(page).toHaveURL(/\/#\/info\?source=router-upgrade$/)
    await expect(page.getByRole('heading', {name: 'Earn Lockpicking Karate Flair'})).toBeVisible()

    await page.reload()
    await expect(page).toHaveURL(/\/#\/info\?source=router-upgrade$/)
    await expect(page.getByRole('heading', {name: 'Earn Lockpicking Karate Flair'})).toBeVisible()

    await page.goForward()
    await expect(page.getByRole('heading', {name: 'Tier levels'})).toBeVisible()
})

test('user can view Projects page', async ({page}) => {
    await page.goto('/#/projects')
    await expect(page.getByRole('heading', {name: 'Tier levels'})).toBeVisible()
})

test('user can view Dans page', async ({page}) => {
    await page.goto('/#/dans')
    await expect(page.getByRole('heading', {name: 'Preamble:'})).toBeVisible()
})

test('user can view About page', async ({page}) => {
    await page.goto('/#/about')
    await expect(page.getByRole('heading', {name: 'Introduction to the Belt Ranking System'})).toBeVisible()
})
