import React from 'react'
import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {renderWithRouter} from '../../src/test/render.jsx'
import AccessContext from '../../src/app/AccessContext.jsx'
import VoteDisplay from '../../src/classification/VoteDisplay.jsx'
import EntryClassificationAdmin from '../../src/classification/EntryClassificationAdmin.jsx'

describe('classification previews', () => {
    it('opens and cancels a vote preview without offering a save action', async () => {
        const user = userEvent.setup()
        renderWithRouter(<VoteDisplay entry={{id: 'test-lock'}} vote={{}} owner/>, {
            auth: {user: {uid: 'test-user'}}
        })

        await user.click(screen.getByRole('button', {name: 'Add Your Belt Ranking Vote'}))
        expect(screen.getByText('Preview only — vote saving is unavailable.')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Cast Your Vote'})).toBeDisabled()

        await user.click(screen.getByRole('button', {name: 'Cancel'}))
        expect(screen.getByRole('button', {name: 'Add Your Belt Ranking Vote'})).toBeInTheDocument()
    })

    it('can reveal the admin preview after access becomes available', () => {
        const entry = {id: 'test-lock', currentVotes: [], previousVotes: []}
        const access = allowed => ({accessInfo: {roles: {classificationAdmin: allowed}}})
        const {rerender} = render(
            <AccessContext.Provider value={access(false)}>
                <EntryClassificationAdmin entry={entry}/>
            </AccessContext.Provider>
        )

        expect(screen.queryByText('Preview only — admin changes are unavailable.')).not.toBeInTheDocument()
        rerender(
            <AccessContext.Provider value={access(true)}>
                <EntryClassificationAdmin entry={entry}/>
            </AccessContext.Provider>
        )

        expect(screen.getByText('Preview only — admin changes are unavailable.')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled()
        expect(screen.getByRole('button', {name: 'Save And Stage'})).toBeDisabled()
    })
})
