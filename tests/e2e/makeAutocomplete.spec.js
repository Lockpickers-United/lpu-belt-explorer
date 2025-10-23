import {expect, test} from '@playwright/test'


test('user can filter lock list by make autocomplete', async ({page}) => {
    await page.goto('/locks?tab=White')
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

    return

    const test = await page.locator('#makes-combo').getByRole('textbox', {name: 'Make-field'})
    await expect(test).toBeVisible()


    const makeCombo = await page.getByRole('combobox', {name: 'Make'})
    await expect(makeCombo).toBeVisible()
    await makeCombo.click()

    await page.getByText('Master Lock', {exact: true}).click()

    return


    const textboxes = await page.getByPlaceholder('Make').all()
    console.log(`Found ${textboxes.length} textboxes on the page.`)

    const makeText = await page.getByRole('textbox', {name: 'Make-field'})
    await expect(makeText).toBeVisible()

    const openButton = await page.getByRole('button', {name: 'Open'})
    // MUI Autocomplete renders a textbox inside the combobox; fill the textbox by its accessible name
    //await makeCombo.fill('Mas')

    const autocompleteInput = page.getByPlaceholder('Make')
    await expect(autocompleteInput).toBeVisible()


    // Get all elements with the 'textbox' role

    // Iterate through the textboxes and log their values (if any) or other attributes
    for (const textbox of textboxes) {
        const value = await textbox.inputValue() // Get the current value of the textbox
        const placeholder = await textbox.getAttribute('placeholder') // Get the placeholder text
        const id = await textbox.getAttribute('id') // Get the id attribute

        console.log(`Textbox (ID: ${id || 'N/A'}, Placeholder: ${placeholder || 'N/A'}): Value = "${value}"`)
    }


    await makeText.click()
    await makeText.fill('Mas')


    //await page.getByRole('option', { name: 'Master Lock-field' }).click({timeout: 3000})
    await page.getByText('LOB1').click()


    await page.getByRole('button', {name: 'Close'}).click()

    await page.locator('#advanced-filters').getByRole('button', {name: 'Reset'}).click()

})