import {test, expect} from './fixtures'

test('locks page preserves the desktop Material UI layout', async ({page}) => {
    await page.setViewportSize({width: 1280, height: 900})
    await page.goto('/#/locks?tab=White')
    await expect(page.getByRole('list', {name: 'Locks'})).toBeVisible()
    await expect(page.getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeVisible()

    await expect(page).toHaveScreenshot('locks-desktop.png', {animations: 'disabled'})
})

test('lock filters preserve the mobile Material UI layout', async ({page}) => {
    await page.setViewportSize({width: 390, height: 844})
    await page.goto('/#/locks?tab=White')
    await page.getByRole('button', {name: 'Filter'}).click()
    await expect(page.getByRole('combobox', {name: 'Locking Mechanism'})).toBeVisible()

    await expect(page).toHaveScreenshot('lock-filters-mobile.png', {animations: 'disabled'})
})
