import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {fireEvent, screen, waitFor} from '@testing-library/react'
import {renderWithProviders, defaultTestContextValues} from '../../src/test/render.jsx'
import ReassignVoteButton from '../../src/classification/ReassignVoteButton.jsx'

const accessInfo = {
    ...defaultTestContextValues.access.accessInfo,
    roles: {...defaultTestContextValues.access.accessInfo.roles, classificationAdmin: true}
}

function renderButton(handleMoveVote) {
    renderWithProviders(<ReassignVoteButton handleMoveVote={handleMoveVote}
                                            currentEntryId='12345678'/>, {access: {accessInfo}})
    fireEvent.click(screen.getByRole('button', {name: 'Move vote to another lock'}))
}

describe('ReassignVoteButton', () => {
    it('passes the normalized target ID and closes after a successful move', async () => {
        const handleMoveVote = vi.fn().mockResolvedValue(undefined)
        renderButton(handleMoveVote)
        fireEvent.change(screen.getByPlaceholderText('Target lock ID'), {target: {value: 'ABCDEF12'}})
        fireEvent.click(screen.getByRole('button', {name: 'Move Vote'}))

        await waitFor(() => expect(handleMoveVote).toHaveBeenCalledWith('abcdef12'))
        await waitFor(() => expect(screen.queryByPlaceholderText('Target lock ID')).not.toBeInTheDocument())
    })

    it('keeps the dialog open when the move fails and blocks the source ID', async () => {
        const handleMoveVote = vi.fn().mockRejectedValue(new Error('This member already voted there'))
        renderButton(handleMoveVote)
        fireEvent.change(screen.getByPlaceholderText('Target lock ID'), {target: {value: '12345678'}})
        expect(screen.getByRole('button', {name: 'Move Vote'})).toBeDisabled()

        fireEvent.change(screen.getByPlaceholderText('Target lock ID'), {target: {value: 'abcdef12'}})
        fireEvent.click(screen.getByRole('button', {name: 'Move Vote'}))
        expect(await screen.findByText('This member already voted there')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Target lock ID')).toBeInTheDocument()
    })

    it('requires other vote edits to be saved first', () => {
        const handleMoveVote = vi.fn()
        renderWithProviders(<ReassignVoteButton handleMoveVote={handleMoveVote}
                                                currentEntryId='12345678' hasUnsavedEdits/>,
            {access: {accessInfo}})
        fireEvent.click(screen.getByRole('button', {name: 'Move vote to another lock'}))
        fireEvent.change(screen.getByPlaceholderText('Target lock ID'), {target: {value: 'abcdef12'}})

        expect(screen.getByText('Save or cancel your edits before moving.')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Move Vote'})).toBeDisabled()
        expect(handleMoveVote).not.toHaveBeenCalled()
    })
})
