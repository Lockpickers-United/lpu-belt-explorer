import React, {useState} from 'react'
import {fireEvent, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
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

        const dateInput = screen.getByRole('textbox', {name: 'Date'})
        expect(dateInput).toHaveValue('01/15/2024')

        fireEvent.change(dateInput, {target: {value: '02/20/2024'}})
        await user.click(screen.getByRole('button', {name: 'Save'}))

        await waitFor(() => expect(updatePickerActivity).toHaveBeenCalledOnce())
        const submittedActivity = updatePickerActivity.mock.calls[0][1]
        expect(submittedActivity.date.format('YYYY-MM-DD')).toBe('2024-02-20')
        expect(handleUpdate).toHaveBeenCalledOnce()
    })
})
