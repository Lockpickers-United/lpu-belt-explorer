import {test, expect} from '@playwright/test'

test('user can view Locks Route', async ({page}) => {
    await page.goto('/')
    await expect(page.getByRole('button', {name: 'Any Acrylic Padlock Various'})).toBeVisible()
})
