import {test, expect} from '@playwright/test'

test('user can view Locks Route', async ({page}) => {
    await page.goto('/')
    await expect(page.getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeVisible()
})
