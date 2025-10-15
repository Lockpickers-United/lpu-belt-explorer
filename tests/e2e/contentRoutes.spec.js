import {test, expect} from '@playwright/test'

test('user can view Info page', async ({page}) => {
    await page.goto('/#/info')
    await expect(page.getByRole('heading', {name: 'Earn Lockpicking Karate Flair'})).toBeVisible()
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