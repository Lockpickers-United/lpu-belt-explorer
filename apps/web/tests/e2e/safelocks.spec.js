import {test, expect} from './fixtures'

test('user can view Safelocks Route', async ({page}) => {
    await page.goto('/#/safelocks')
    await expect(page.getByRole('button', {name: 'AMSEC STAR C3 Group 2'})).toBeVisible()
})
