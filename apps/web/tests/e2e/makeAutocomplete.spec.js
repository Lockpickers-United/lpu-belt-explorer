import {expect, test} from './fixtures'


test('user can filter lock list by make autocomplete', async ({page}) => {
    await page.goto('/#/locks?tab=White')
    await expect(page.getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeVisible()
    await page.getByRole('button', {name: 'Filter'}).click()
    await page.getByRole('combobox', {name: 'Make'}).click()
    //await page.getByRole('combobox', { name: 'Make' }).fill('mas');
    await page.getByRole('option', {name: /Master Lock/i}).click()
    await page.getByRole('button', {name: 'CLOSE'}).click()
    await expect(page.getByRole('listitem', {name: 'Master Lock #1'})).toBeVisible()
    await expect(page.getByRole('listitem', {name: 'Any Acrylic Padlock'})).not.toBeVisible()
    const resetButton = await page.locator('#advanced-filters').getByRole('button', { name: 'Reset' })
    await expect(resetButton).toBeVisible()
    await resetButton.click()
    await expect(page.getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeVisible()
})
