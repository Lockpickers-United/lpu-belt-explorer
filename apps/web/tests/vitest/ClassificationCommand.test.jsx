import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {renderWithProviders} from '../../src/test/render.jsx'
import useClassificationCommand from '../../src/classification/useClassificationCommand.js'

function RetryHarness() {
    const {run, pending, error} = useClassificationCommand()
    return <div>
        <button disabled={pending} onClick={() => run('post', 'votes', {entryId: 'lock-a', votedBelt: 'Blue'})
            .catch(() => {})}>Save vote</button>
        {error && <div role='alert'>{error.message}</div>}
    </div>
}

describe('classification command retries', () => {
    it('reuses the same key after an uncertain response and clears the error on success', async () => {
        const classificationCommand = vi.fn()
            .mockRejectedValueOnce(new Error('Request timed out'))
            .mockResolvedValueOnce({vote: {id: 'vote-a'}})
        renderWithProviders(<RetryHarness/>, {api: {classificationCommand}})
        const user = userEvent.setup()

        await user.click(screen.getByRole('button', {name: 'Save vote'}))
        expect(await screen.findByRole('alert')).toHaveTextContent('Request timed out')
        await user.click(screen.getByRole('button', {name: 'Save vote'}))
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
        expect(classificationCommand).toHaveBeenCalledTimes(2)
        expect(classificationCommand.mock.calls[0][3]).toBe(classificationCommand.mock.calls[1][3])
    })
})
