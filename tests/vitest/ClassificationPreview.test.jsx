import React from 'react'
import {describe, expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {createMemoryRouter, RouterProvider} from 'react-router-dom'
import {defaultTestContextValues, renderWithProviders} from '../../src/test/render.jsx'
import AccessContext from '../../src/app/AccessContext.jsx'
import {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
import VoteDisplay from '../../src/classification/VoteDisplay.jsx'
import EntryClassificationAdmin from '../../src/classification/EntryClassificationAdmin.jsx'
import EntryActionBarWrapped from '../../src/entries/EntryActionBarWrapped.jsx'
import allEntries from '../../src/data/data.json'

describe('classification previews', () => {
    it('opens and cancels a vote preview without offering a save action', async () => {
        const user = userEvent.setup()
        const router = createMemoryRouter([{
            path: '/classification',
            handle: {route: 'classification'},
            element: <VoteDisplay entry={{id: 'test-lock'}} vote={{}} owner/>
        }], {initialEntries: ['/classification']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'test-user'}}
        })

        await user.click(screen.getByRole('button', {name: 'Add Your Belt Ranking Vote'}))
        expect(screen.getByText('Preview only — vote saving is unavailable.')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Cast Your Vote'})).toBeDisabled()

        await user.click(screen.getByRole('button', {name: 'Cancel'}))
        expect(screen.getByRole('button', {name: 'Add Your Belt Ranking Vote'})).toBeInTheDocument()
    })

    it('shows votes without an edit control on the changelog route', () => {
        const router = createMemoryRouter([{
            path: '/classification/changelog',
            handle: {route: 'changelog'},
            element: <VoteDisplay entry={{id: 'test-lock'}} vote={{id: 'vote-1', votedBelt: 'Blue'}} owner/>
        }], {initialEntries: ['/classification/changelog']})

        renderWithProviders(<RouterProvider router={router}/>)

        expect(screen.getByText('My Vote:')).toBeInTheDocument()
        expect(screen.queryByRole('button', {name: 'Edit'})).not.toBeInTheDocument()
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

    it.each([
        {actionId: 'a_e2fd1000', status: 'Pending', saveLabel: 'Save'},
        {actionId: 'a_e2fd1519', status: 'Re-opened', saveLabel: 'Save Changes'}
    ])('prefills only an unpublished context-selected action: $actionId', ({actionId, status, saveLabel}) => {
        const entry = {
            ...allEntries.find(item => item.id === 'e2fd1519'),
            adminActionId: actionId,
            currentVotes: [],
            previousVotes: []
        }
        const baseAccessInfo = defaultTestContextValues.access.accessInfo
        const router = createMemoryRouter([{
            path: '/classification',
            handle: {route: 'classification'},
            element: (
                <ClassificationProvider><EntryClassificationAdmin entry={entry}/></ClassificationProvider>
            )
        }], {initialEntries: ['/classification']})

        renderWithProviders(
            <RouterProvider router={router}/>,
            {
                auth: {user: {uid: 'test-user'}},
                access: {accessInfo: {
                    ...baseAccessInfo,
                    roles: {...baseAccessInfo.roles, classificationAdmin: true}
                }}
            }
        )

        expect(screen.getByText(status)).toBeInTheDocument()
        expect(screen.getByRole('button', {name: saveLabel})).toBeDisabled()
    })

    it('keeps the vote action available on a scorecard row', () => {
        const router = createMemoryRouter([{
            path: '/scorecard',
            handle: {route: 'scorecard'},
            element: <EntryActionBarWrapped entry={allEntries.find(entry => entry.id === 'f72085d2')}/>
        }], {initialEntries: ['/scorecard']})
        const baseAccessInfo = defaultTestContextValues.access.accessInfo

        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {isLoggedIn: true, user: {uid: 'test-user'}},
            access: {accessInfo: {
                ...baseAccessInfo,
                roles: {...baseAccessInfo.roles, classificationTeam: true},
                features: {...baseAccessInfo.features, entryActionBar: true, classificationVote: true}
            }}
        })

        expect(screen.getByRole('button', {name: 'Classification'})).toBeInTheDocument()
    })
})
