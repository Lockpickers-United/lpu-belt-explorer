import {test, expect} from '@playwright/test'

test('user can view Locks Route', async ({page}) => {
    await page.goto('/')
    await expect(page.getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeVisible()
})

test('user can view lock entry details', async ({page}) => {
    await page.goto('/locks')
    await expect(page.getByRole('list', {name: 'Locks'})).toBeVisible()
    await expect(page.getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeVisible()
    const firstListItem = await page.getByRole('listitem', {name: 'Any Acrylic Padlock'})
    await firstListItem.click()
    await expect(page.getByRole('button', {name: 'Any Acrylic Padlock Various'})).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('button', {name: 'My Collection'})).toBeVisible()
    await expect(page.getByRole('img', {name: 'belt-icon'})).toBeDefined()

})

test('user can filter lock list by locking mechanism', async ({page}) => {
    await page.goto('/locks?tab=White')
    await expect(page.getByRole('listitem', {name: 'Generic/Unknown 1 or 2 Lever Cabinet lock'})).toBeVisible()
    const filterButton = await page.getByRole('button', {name: 'Filter'})
    await expect(filterButton).toBeVisible()
    await filterButton.click()
    const mechanismMenu = await page.getByRole('combobox', {name: 'Locking Mechanism'})
    await mechanismMenu.click()
    await expect(page.getByRole('listbox', {name: 'Locking Mechanism'})).toBeVisible()
    const pinTumbler = await page.getByRole('option', {name: /Pin-tumbler/i})
    await pinTumbler.click()
    await page.getByRole('button', {name: 'CLOSE'}).click()
    await expect(page.getByRole('listitem', {name: /ABUS/i})).toBeVisible()
    await expect(page.getByRole('listitem', {name: 'Generic/Unknown 1 or 2 Lever Cabinet lock'})).not.toBeAttached()
})
