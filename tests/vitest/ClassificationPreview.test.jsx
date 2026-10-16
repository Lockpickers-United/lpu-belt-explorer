import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {createMemoryRouter, RouterProvider} from 'react-router-dom'
import {defaultTestContextValues, renderWithProviders} from '../../src/test/render.jsx'
import AccessContext from '../../src/app/AccessContext.jsx'
import ClassificationContext from '../../src/app/ClassificationContext.jsx'
import VoteDisplay from '../../src/classification/VoteDisplay.jsx'
import EntryClassificationAdmin from '../../src/classification/EntryClassificationAdmin.jsx'
import EntryActionBarWrapped from '../../src/entries/EntryActionBarWrapped.jsx'
import allEntries from '../../src/data/data.json'

import fixtures from '../fixtures/classification-test-data.json'

const emptyClassification = {
    getAdminAction: () => null,
    getCurrentUserVote: () => null,
    getUserVote: () => null,
    getAdminActionStatus: () => 'No Votes'
}

describe('classification previews', () => {
    it('saves a new vote through the classification API', async () => {
        const user = userEvent.setup()
        const classificationCommand = vi.fn(async () => ({vote: {id: 'saved-vote'}}))
        const router = createMemoryRouter([{
            path: '/classification',
            handle: {route: 'classification'},
            element: <VoteDisplay entry={{id: 'test-lock'}} vote={{}} owner/>
        }], {initialEntries: ['/classification']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'test-user'}}, api: {classificationCommand}
        })

        await user.click(screen.getByRole('button', {name: 'Add Your Belt Ranking Vote'}))
        expect(screen.getByRole('button', {name: 'Cast Your Vote'})).toBeDisabled()

        await user.click(screen.getByRole('combobox'))
        await user.click(screen.getByRole('option', {name: 'Blue'}))
        await user.click(screen.getByRole('button', {name: 'Cast Your Vote'}))
        expect(classificationCommand).toHaveBeenCalledWith('post', 'votes', {
            entryId: 'test-lock', votedBelt: 'Blue', comment: null, mediaUrl: null
        }, expect.any(String))
    })

    it('edits the existing previous vote with its revision', async () => {
        const user = userEvent.setup()
        const classificationCommand = vi.fn(async () => ({}))
        const vote = {id: 'vote-1', revision: 3, votedBelt: 'Blue', userId: 'test-user'}
        const router = createMemoryRouter([{
            path: '/classification', handle: {route: 'classification'},
            element: <VoteDisplay entry={{id: 'test-lock'}} vote={{}} formVote={vote} owner/>
        }], {initialEntries: ['/classification']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'test-user'}}, api: {classificationCommand}
        })

        await user.click(screen.getByRole('button', {name: 'Edit Your Belt Ranking Vote'}))
        await user.click(screen.getByRole('combobox'))
        await user.click(screen.getByRole('option', {name: 'Green'}))
        await user.click(screen.getByRole('button', {name: 'Save'}))
        expect(classificationCommand).toHaveBeenCalledWith('patch', 'votes/vote-1', {
            expectedRevision: 3, votedBelt: 'Green', comment: null, mediaUrl: null
        }, expect.any(String))
        expect(screen.getByRole('status')).toHaveTextContent('Waiting for the updated record')
    })

    it('deletes a previous vote only after confirmation', async () => {
        const user = userEvent.setup()
        const classificationCommand = vi.fn(async () => ({}))
        const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
        const vote = {id: 'vote-1', revision: 3, votedBelt: 'Blue', userId: 'test-user'}
        const router = createMemoryRouter([{
            path: '/classification', handle: {route: 'classification'},
            element: <VoteDisplay entry={{id: 'test-lock'}} vote={{}} formVote={vote} owner/>
        }], {initialEntries: ['/classification']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'test-user'}}, api: {classificationCommand}
        })
        await user.click(screen.getByRole('button', {name: 'Edit Your Belt Ranking Vote'}))
        await user.click(screen.getByRole('button', {name: 'Delete'}))
        expect(confirm).toHaveBeenCalledOnce()
        expect(classificationCommand).toHaveBeenCalledWith('delete', 'votes/vote-1', {
            expectedRevision: 3
        }, expect.any(String))
        confirm.mockRestore()
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
                <ClassificationContext.Provider value={emptyClassification}>
                    <EntryClassificationAdmin entry={entry}/>
                </ClassificationContext.Provider>
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

        expect(screen.queryByText('Set Status')).not.toBeInTheDocument()
        rerender(adminPreview(true))

        expect(screen.getByText('Set Status')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled()
        expect(screen.getByRole('button', {name: 'Publish Now'})).toBeDisabled()
    })

    it.each([
        {actionId: 'a_t_e2fd1000', status: 'Pending', saveLabel: 'Save'},
        {actionId: 'a_t_e2fd1519', status: 'Re-opened', saveLabel: 'Save Changes'}
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
                <ClassificationContext.Provider value={{...emptyClassification,
                    getAdminAction: () => fixtures.adminActions.find(action => action.id === actionId)}}>
                    <EntryClassificationAdmin entry={entry}/>
                </ClassificationContext.Provider>
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

    it('loads the current admin action only when its panel opens', async () => {
        const entry = allEntries.find(item => item.id === 'e2fd1519')
        const fetchClassificationAction = vi.fn(async () => ({
            id: 'action-live', entryId: entry.id, status: 'Staged', action: 'Delete', note: 'Live note'
        }))
        const baseAccessInfo = defaultTestContextValues.access.accessInfo
        const router = createMemoryRouter([{
            path: '/classification', handle: {route: 'classification'},
            element: <ClassificationContext.Provider value={{...emptyClassification,
                getAdminAction: () => ({id: 'action-live', status: 'Staged'})}}>
                <EntryClassificationAdmin entry={entry}/>
            </ClassificationContext.Provider>
        }], {initialEntries: ['/classification']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'admin-user'}, userClaims: ['classificationAdmin']},
            access: {accessInfo: {...baseAccessInfo,
                roles: {...baseAccessInfo.roles, classificationAdmin: true}}},
            api: {fetchClassificationAction}
        })
        expect(await screen.findByText('Set Status')).toBeInTheDocument()
        expect(fetchClassificationAction).toHaveBeenCalledExactlyOnceWith(entry.id)
        expect(screen.getByDisplayValue('Live note')).toBeInTheDocument()
    })

    it.each(['Settled', 'Re-opened'])('clears a staged belt change when status becomes %s', async status => {
        const user = userEvent.setup()
        const entry = {...allEntries.find(item => item.id === 'e2fd1519'),
            currentVotes: [], previousVotes: []}
        const action = {id: 'action-live', entryId: entry.id, revision: 2,
            status: 'Staged', action: 'Belt Change', updatedBelt: 'Black 5', note: 'Test note'}
        const classificationCommand = vi.fn(async () => ({action: {...action, status, action: null}}))
        const baseAccessInfo = defaultTestContextValues.access.accessInfo
        const router = createMemoryRouter([{
            path: '/classification', handle: {route: 'classification'},
            element: <ClassificationContext.Provider value={{...emptyClassification,
                getAdminAction: () => action}}>
                <EntryClassificationAdmin entry={entry}/>
            </ClassificationContext.Provider>
        }], {initialEntries: ['/classification']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'admin-user'}, userClaims: ['classificationAdmin']},
            access: {accessInfo: {...baseAccessInfo,
                roles: {...baseAccessInfo.roles, classificationAdmin: true}}},
            api: {classificationCommand}
        })

        expect(screen.getByRole('button', {name: 'Save Changes'})).toBeDisabled()
        await user.click(screen.getAllByRole('combobox')[0])
        await user.click(screen.getByRole('option', {name: status}))
        expect(screen.getByRole('button', {name: 'Save Changes'})).toBeEnabled()
        await user.click(screen.getByRole('button', {name: 'Save Changes'}))
        expect(classificationCommand).toHaveBeenCalledWith('patch', 'actions/action-live',
            expect.objectContaining({expectedRevision: 2, status, action: null,
                updatedBelt: null, samelineTargetId: null}), expect.any(String))
    })

    it('creates a staged admin action and publishes one decision through separate commands', async () => {
        const user = userEvent.setup()
        const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
        const classificationCommand = vi.fn(async (_method, path) => path === 'actions'
            ? {action: {id: 'action-new', revision: 1, status: 'Staged', action: 'Delete'}}
            : {publication: {id: 'publication-new'}})
        const entry = {...allEntries.find(item => item.id === 'e2fd1519'),
            currentVotes: [], previousVotes: []}
        const baseAccessInfo = defaultTestContextValues.access.accessInfo
        const router = createMemoryRouter([{
            path: '/classification', handle: {route: 'classification'},
            element: <ClassificationContext.Provider value={emptyClassification}>
                <EntryClassificationAdmin entry={entry}/>
            </ClassificationContext.Provider>
        }], {initialEntries: ['/classification']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'admin-user'}},
            access: {accessInfo: {...baseAccessInfo,
                roles: {...baseAccessInfo.roles, classificationAdmin: true}}},
            api: {classificationCommand}
        })

        await user.click(screen.getAllByRole('combobox')[0])
        await user.click(screen.getByRole('option', {name: 'Staged'}))
        await user.click(screen.getAllByRole('combobox')[1])
        await user.click(screen.getByRole('option', {name: 'Delete'}))
        await user.click(screen.getByRole('button', {name: 'Save'}))
        expect(classificationCommand).toHaveBeenCalledWith('post', 'actions', expect.objectContaining({
            entryId: entry.id, status: 'Staged', action: 'Delete'
        }), expect.any(String))

        await user.click(screen.getByRole('button', {name: 'Publish Now'}))
        expect(confirm).toHaveBeenCalledOnce()
        expect(classificationCommand).toHaveBeenCalledWith('post', 'publications/single', expect.objectContaining({
            entryId: entry.id, actionId: 'action-new', expectedRevision: 1,
            action: 'Delete', omitChangelog: false
        }), expect.any(String))
        confirm.mockRestore()
    })

    it('keeps the vote action available on a scorecard row', () => {
        const router = createMemoryRouter([{
            path: '/scorecard',
            handle: {route: 'scorecard'},
            element: <ClassificationContext.Provider value={emptyClassification}>
                <EntryActionBarWrapped entry={allEntries.find(entry => entry.id === 'f72085d2')}/>
            </ClassificationContext.Provider>
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
