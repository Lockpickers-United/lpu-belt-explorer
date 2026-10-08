import React from 'react'
import {describe, expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {createMemoryRouter, RouterProvider} from 'react-router-dom'
import {defaultTestContextValues, renderWithProviders, renderWithRouter} from '../../src/test/render.jsx'
import AccessContext from '../../src/app/AccessContext.jsx'
import {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
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
        const baseAccessInfo = defaultTestContextValues.access.accessInfo
        const access = allowed => ({
            accessInfo: {
                ...baseAccessInfo,
                roles: {...baseAccessInfo.roles, classificationAdmin: allowed},
                features: {...baseAccessInfo.features, classificationVote: allowed}
            }
        })
        const router = createMemoryRouter([{
            path: '/classification',
            handle: {route: 'classification'},
            element: (
                <ClassificationProvider>
                    <EntryClassificationAdmin entry={entry}/>
                </ClassificationProvider>
            )
        }], {initialEntries: ['/classification']})
        const adminPreview = allowed => (
            <AccessContext.Provider value={access(allowed)}>
                <RouterProvider router={router}/>
            </AccessContext.Provider>
        )
        const {rerender} = renderWithProviders(adminPreview(false), {
            auth: {user: {uid: 'test-user'}}
        })

        expect(screen.queryByText('Preview only — admin changes are unavailable.')).not.toBeInTheDocument()
        rerender(adminPreview(true))

        expect(screen.getByText('Preview only — admin changes are unavailable.')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled()
        expect(screen.getByRole('button', {name: 'Save And Stage'})).toBeDisabled()
    })
})
