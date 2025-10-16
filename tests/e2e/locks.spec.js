import {test, expect} from '@playwright/test'

const re = /\/locks(.*/
const valid = re.test('/locks?tab=search&search=v18')
console.log(valid)

test('user can view Locks Route', async ({page}) => {
    await page.goto('/')
    await expect(page.getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeVisible()
})

test('renders lock details', async ({page}) => {
    await page.goto('/locks')
    await expect(page.getByRole('list', {name: 'Locks'})).toBeVisible()
    await expect(page.getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeVisible()

    const firstListItem = await page.getByRole('listitem', {name: 'Any Acrylic Padlock'})
    await firstListItem.click()
    await expect(firstListItem).toHaveAttribute('aria-expanded', 'true')

    await expect(page.getByRole('button', {name: 'My Collection'})).toBeVisible()
    await expect(page.getByRole('img', {name: 'belt-icon'})).toBeDefined()

    //const firstListItem = await screen.getAllByRole('listitem',{})[0]
    //await userEvent.click(firstListItem)
    //expect(firstListItem).toHaveAttribute('aria-expanded', 'true')
    //expect(page.findByRole('image', {name: 'belt-icon'})).toBeDefined()
})
