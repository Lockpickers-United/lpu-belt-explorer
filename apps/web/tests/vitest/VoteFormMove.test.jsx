import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {fireEvent, screen, waitFor} from '@testing-library/react'
import {createMemoryRouter, RouterProvider, useLocation} from 'react-router-dom'
import {renderWithProviders, defaultTestContextValues} from '../../src/test/render.jsx'
import DataContext from '../../src/context/DataContext.jsx'
import VoteForm from '../../src/classification/VoteForm.jsx'

vi.mock('notistack', () => ({enqueueSnackbar: vi.fn()}))

const source = {id: '12345678', belt: 'Unranked'}
const target = {id: 'abcdef12', belt: 'Blue', classificationActive: false}
const vote = {id: 'vote-a', revision: 3, entryId: source.id, votedBelt: 'Blue',
    displayName: 'Reviewer'}
const accessInfo = {
    ...defaultTestContextValues.access.accessInfo,
    roles: {...defaultTestContextValues.access.accessInfo.roles, classificationAdmin: true}
}

function Location() {
    const location = useLocation()
    return <div>{location.pathname}{location.search}</div>
}

describe('VoteForm move', () => {
    it('sends the move command and opens the target Classification lock', async () => {
        const classificationCommand = vi.fn().mockResolvedValue({vote: {...vote, entryId: target.id}})
        const router = createMemoryRouter([
            {path: '/classification', element: <DataContext.Provider value={{
                getEntryFromId: id => [source, target].find(entry => entry.id === id)
            }}><VoteForm entry={source} vote={vote}/></DataContext.Provider>},
            {path: '/classification/ranked', element: <Location/>}
        ], {initialEntries: ['/classification']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'admin'}}, access: {accessInfo},
            api: {classificationCommand}
        })

        fireEvent.click(screen.getByRole('button', {name: 'Move vote to another lock'}))
        fireEvent.change(screen.getByPlaceholderText('Target lock ID'), {target: {value: 'ABCDEF12'}})
        fireEvent.click(screen.getByRole('button', {name: 'Move Vote'}))

        await waitFor(() => expect(classificationCommand).toHaveBeenCalledWith('post',
            'votes/vote-a/move', {entryId: 'abcdef12', expectedRevision: 3}, expect.any(String)))
        expect(await screen.findByText('/classification/ranked?id=abcdef12')).toBeInTheDocument()
    })
})
