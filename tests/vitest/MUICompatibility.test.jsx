import React, {useState} from 'react'
import {screen, waitFor, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import AutoCompleteBox from '../../src/formUtils/AutoCompleteBox.jsx'
import Dropzone from '../../src/formUtils/Dropzone.jsx'
import SelectBox from '../../src/formUtils/SelectBox.jsx'
import DisplayDialog from '../../src/misc/DisplayDialog.jsx'
import EvidenceForm from '../../src/scorecard/EvidenceForm.jsx'
import DataContext from '../../src/context/DataContext.jsx'
import {renderWithProviders, renderWithRouter} from '../../src/test/render.jsx'

vi.mock('heic2any', () => ({default: vi.fn()}))
vi.mock('notistack', async importOriginal => {
    const original = await importOriginal()
    return {...original, enqueueSnackbar: vi.fn()}
})

function DialogHarness({onConfirm}) {
    const [open, setOpen] = useState(false)
    const close = () => setOpen(false)
    return (
        <React.Fragment>
            <button onClick={() => setOpen(true)}>Open dialog</button>
            <DisplayDialog
                open={open}
                handleClose={close}
                dialogContent={
                    <div>
                        <h2>Confirm change</h2>
                        <button onClick={close}>Cancel</button>
                        <button onClick={() => {
                            onConfirm()
                            close()
                        }}>Confirm</button>
                    </div>
                }
            />
        </React.Fragment>
    )
}

function SelectHarness() {
    const [value, setValue] = useState('')
    return (
        <React.Fragment>
            <SelectBox
                form={{}}
                name='favorite'
                label='Favorite'
                optionsList={['Alpha', 'Beta']}
                value={value}
                changeHandler={event => setValue(event.target.value)}
            />
            <output aria-label='Selected value'>{value || 'none'}</output>
        </React.Fragment>
    )
}

function AccordionHarness() {
    const [expanded, setExpanded] = useState(false)
    return (
        <Accordion expanded={expanded} onChange={(_event, nextExpanded) => setExpanded(nextExpanded)}>
            <AccordionSummary>Compatibility section</AccordionSummary>
            <AccordionDetails>Compatibility details</AccordionDetails>
        </Accordion>
    )
}

function MenuHarness() {
    const [anchorEl, setAnchorEl] = useState(null)
    const [selection, setSelection] = useState('none')
    const select = value => () => {
        setSelection(value)
        setAnchorEl(null)
    }
    return (
        <React.Fragment>
            <Button onClick={event => setAnchorEl(event.currentTarget)}>Open actions</Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                slotProps={{list: {'aria-label': 'Actions'}}}
            >
                <MenuItem onClick={select('Alpha')}>Alpha</MenuItem>
                <MenuItem onClick={select('Beta')}>Beta</MenuItem>
            </Menu>
            <output aria-label='Selected action'>{selection}</output>
        </React.Fragment>
    )
}

function TabsHarness() {
    const [value, setValue] = useState('alpha')
    return (
        <React.Fragment>
            <Tabs value={value} onChange={(_event, nextValue) => setValue(nextValue)} aria-label='Sections'>
                <Tab label='Alpha' value='alpha'/>
                <Tab label='Beta' value='beta'/>
            </Tabs>
            <output aria-label='Selected tab'>{value}</output>
        </React.Fragment>
    )
}

describe('Material UI compatibility contracts', () => {
    beforeEach(() => {
        vi.stubGlobal('URL', {
            ...URL,
            createObjectURL: vi.fn(() => 'blob:test-preview'),
            revokeObjectURL: vi.fn()
        })
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('supports dialog focus, confirmation, close button, and Escape dismissal', async () => {
        const user = userEvent.setup()
        const onConfirm = vi.fn()
        renderWithProviders(<DialogHarness onConfirm={onConfirm}/>)

        await user.click(screen.getByRole('button', {name: 'Open dialog'}))
        expect(await screen.findByRole('dialog')).toBeInTheDocument()
        expect(document.activeElement).not.toBe(document.body)
        await user.keyboard('{Tab}')
        expect(screen.getByRole('button', {name: 'Close dialog'})).toHaveFocus()

        await user.click(screen.getByRole('button', {name: 'Confirm'}))
        expect(onConfirm).toHaveBeenCalledOnce()
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

        await user.click(screen.getByRole('button', {name: 'Open dialog'}))
        await user.click(screen.getByRole('button', {name: 'Close dialog'}))
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

        await user.click(screen.getByRole('button', {name: 'Open dialog'}))
        await user.keyboard('{Escape}')
        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })

    it('supports keyboard selection in a Select menu', async () => {
        const user = userEvent.setup()
        renderWithProviders(<SelectHarness/>)

        const select = screen.getByRole('combobox', {name: 'Favorite'})
        await user.tab()
        expect(select).toHaveFocus()
        await user.keyboard('{ArrowDown}')
        const listbox = await screen.findByRole('listbox')
        expect(listbox).toBeInTheDocument()
        await user.keyboard('{ArrowDown}{Enter}')

        expect(screen.getByRole('status', {name: 'Selected value'})).toHaveTextContent('Beta')
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })

    it('uses roving focus for Menu keyboard navigation', async () => {
        const user = userEvent.setup()
        renderWithProviders(<MenuHarness/>)

        await user.click(screen.getByRole('button', {name: 'Open actions'}))
        const menu = await screen.findByRole('menu', {name: 'Actions'})
        const [alpha, beta] = within(menu).getAllByRole('menuitem')
        expect(alpha).toHaveFocus()
        expect(alpha).toHaveAttribute('tabindex', '0')

        await user.keyboard('{ArrowDown}')
        expect(alpha).toHaveAttribute('tabindex', '-1')
        expect(beta).toHaveAttribute('tabindex', '0')
        expect(beta).toHaveFocus()
        await user.keyboard('{Enter}')
        expect(screen.getByRole('status', {name: 'Selected action'})).toHaveTextContent('Beta')
    })

    it('uses roving focus and keyboard selection for Tabs', async () => {
        const user = userEvent.setup()
        renderWithProviders(<TabsHarness/>)

        const alpha = screen.getByRole('tab', {name: 'Alpha'})
        const beta = screen.getByRole('tab', {name: 'Beta'})
        alpha.focus()
        await user.keyboard('{ArrowRight}')
        expect(alpha).toHaveAttribute('tabindex', '-1')
        expect(beta).toHaveAttribute('tabindex', '0')
        expect(beta).toHaveFocus()
        await user.keyboard(' ')
        expect(beta).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByRole('status', {name: 'Selected tab'})).toHaveTextContent('beta')
    })

    it('activates a Button from Enter and Space', async () => {
        const user = userEvent.setup()
        const handleClick = vi.fn()
        renderWithProviders(<Button onClick={handleClick}>Activate</Button>)

        const button = screen.getByRole('button', {name: 'Activate'})
        button.focus()
        await user.keyboard('{Enter}')
        await user.keyboard(' ')
        expect(handleClick).toHaveBeenCalledTimes(2)
    })

    it('supports the Accordion heading and keyboard interaction', async () => {
        const user = userEvent.setup()
        renderWithProviders(<AccordionHarness/>)

        const heading = screen.getByRole('heading', {level: 3})
        const summary = screen.getByRole('button', {name: 'Compatibility section'})
        expect(heading).toContainElement(summary)
        expect(summary).toHaveAttribute('aria-expanded', 'false')

        summary.focus()
        await user.keyboard('{Enter}')
        expect(summary).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByText('Compatibility details')).toBeVisible()

        await user.keyboard(' ')
        expect(summary).toHaveAttribute('aria-expanded', 'false')
    })

    it('supports tooltip display and dismissal', async () => {
        const user = userEvent.setup()
        renderWithProviders(
            <Tooltip title='Compatibility help'>
                <Button>Help</Button>
            </Tooltip>
        )

        const button = screen.getByRole('button', {name: 'Compatibility help'})
        await user.hover(button)
        expect(await screen.findByRole('tooltip')).toHaveTextContent('Compatibility help')

        await user.unhover(button)
        await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument())
    })

    it('supports Autocomplete typing, keyboard selection, clearing, and no-match actions', async () => {
        const user = userEvent.setup()
        const changeHandler = vi.fn()
        const inputValueHandler = vi.fn()
        const noOptionsHandler = vi.fn()
        renderWithProviders(
            <AutoCompleteBox
                name='make'
                options={['Alpha', 'Beta']}
                changeHandler={changeHandler}
                inputValueHandler={inputValueHandler}
                noOptionsMessage='Add missing option'
                noOptionsHandler={noOptionsHandler}
            />
        )

        const input = screen.getByRole('combobox')
        await user.type(input, 'Be')
        await user.keyboard('{ArrowDown}{Enter}')
        expect(changeHandler).toHaveBeenLastCalledWith({target: {name: 'make', value: 'Beta'}})
        expect(input).toHaveValue('Beta')

        await user.click(screen.getByLabelText('Clear'))
        expect(changeHandler).toHaveBeenLastCalledWith({target: {name: 'make', value: undefined}})
        expect(input).toHaveValue('')

        await user.type(input, 'Missing')
        await user.click(await screen.findByRole('button', {name: 'Add missing option'}))
        expect(noOptionsHandler).toHaveBeenCalledOnce()
        expect(inputValueHandler).toHaveBeenCalledWith('Missing')
    })

    it('accepts valid images and reports files that exceed the size limit', async () => {
        const user = userEvent.setup({applyAccept: false})
        const handleDroppedFiles = vi.fn()
        const {container} = renderWithProviders(
            <Dropzone files={[]} handleDroppedFiles={handleDroppedFiles} maxMBperFile={1}/>
        )
        let input = container.querySelector('input[type="file"]')

        await user.upload(input, new File(['image'], 'lock.png', {type: 'image/png'}))
        await waitFor(() => expect(handleDroppedFiles).toHaveBeenCalledWith(
            [expect.objectContaining({name: 'lock.png', preview: 'blob:test-preview'})],
            'dropzone'
        ))

        input = container.querySelector('input[type="file"]')
        await user.upload(input, new File(
            [new Uint8Array((1024 * 1024) + 1)],
            'large-lock.png',
            {type: 'image/png'}
        ))
        expect(await screen.findByText('Maximum image file size of 1MB exceeded.')).toBeInTheDocument()
    })

    it('displays and submits the date selected in the evidence form', async () => {
        const user = userEvent.setup()
        const updatePickerActivity = vi.fn().mockResolvedValue(undefined)
        const handleUpdate = vi.fn()
        const activity = {
            id: 'evidence-id',
            matchId: '07034c0f',
            link: 'https://example.test/evidence',
            date: '2024-01-15T12:00:00.000Z',
            evidenceModifier: ''
        }

        renderWithRouter(
            <DataContext.Provider value={{blackBeltUser: false}}>
                <EvidenceForm activity={activity} handleUpdate={handleUpdate}/>
            </DataContext.Provider>,
            {
                route: '/profile/profile-owner/scorecard',
                auth: {isLoggedIn: true, user: {uid: 'profile-owner'}},
                db: {
                    userLockNotes: {},
                    updatePickerActivity,
                    updateProfileField: vi.fn().mockResolvedValue(undefined),
                    addPickerActivity: vi.fn(),
                    removePickerActivity: vi.fn()
                }
            }
        )

        const dateField = screen.getByRole('group', {name: 'Date'})
        const month = screen.getByRole('spinbutton', {name: 'Month'})
        const day = screen.getByRole('spinbutton', {name: 'Day'})
        const year = screen.getByRole('spinbutton', {name: 'Year'})
        expect(month).toHaveAttribute('aria-valuenow', '1')
        expect(day).toHaveAttribute('aria-valuenow', '15')
        expect(year).toHaveAttribute('aria-valuenow', '2024')

        await user.click(dateField)
        await user.clear(month)
        await user.type(month, '02')
        await user.clear(day)
        await user.type(day, '20')
        await user.click(screen.getByRole('button', {name: 'Save'}))

        await waitFor(() => expect(updatePickerActivity).toHaveBeenCalledOnce())
        const submittedActivity = updatePickerActivity.mock.calls[0][1]
        expect(submittedActivity.date.format('YYYY-MM-DD')).toBe('2024-02-20')
        expect(handleUpdate).toHaveBeenCalledOnce()
    })
})
