import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {screen, within} from '@testing-library/react'
import {createMemoryRouter, RouterProvider} from 'react-router-dom'
import {renderWithProviders, defaultTestContextValues} from '../../src/test/render.jsx'
import ClassificationContext from '../../src/app/ClassificationContext.jsx'
import EntryClassificationVote from '../../src/classification/EntryClassificationVote.jsx'

const previousVote = {
    id: 'previous-vote', entryId: 'test-lock', votedBelt: 'Blue', userId: 'reviewer',
    displayName: 'Modern Reviewer', comment: 'Previous round', isCurrent: false,
    updatedAt: '2026-09-01T00:00:00Z'
}
const currentVote = {...previousVote, id: 'current-vote', comment: 'Current round', isCurrent: true}
const entry = {id: 'test-lock', belt: 'Blue', classificationStatus: 'Settled'}
const classification = {
    getUserVote: () => null,
    getCurrentUserVote: () => null,
    getSummary: () => ({revision: 1})
}

function renderVote(route, votes) {
    const fetchClassificationEntryVotes = vi.fn(async () => ({votes, nextCursor: null}))
    const accessInfo = {
        ...defaultTestContextValues.access.accessInfo,
        features: {...defaultTestContextValues.access.accessInfo.features, classificationVote: true}
    }
    const router = createMemoryRouter([{
        path: route,
        handle: {route: route === '/classification' ? 'classification' : 'locks'},
        element: <ClassificationContext.Provider value={classification}>
            <EntryClassificationVote entry={entry}/>
        </ClassificationContext.Provider>
    }], {initialEntries: [route]})
    renderWithProviders(<RouterProvider router={router}/>, {
        auth: {user: {uid: 'viewer'}}, access: {accessInfo},
        api: {fetchClassificationEntryVotes}
    })
    return fetchClassificationEntryVotes
}

describe('EntryClassificationVote', () => {
    it('loads other votes only in an expanded Classification panel', async () => {
        const fetchVotes = renderVote('/classification', [currentVote, previousVote])
        expect(await screen.findAllByText(/Modern Reviewer:/)).toHaveLength(2)
        expect(fetchVotes).toHaveBeenCalledWith('test-lock', null)
        const previous = screen.getByRole('group', {name: 'Previous votes'})
        expect(within(previous).getByText(/Previous round/)).toBeInTheDocument()
        expect(screen.queryByRole('group', {name: 'Historical votes'})).not.toBeInTheDocument()
    })

    it('shows a scoped loading error when detail fails', async () => {
        const fetchClassificationEntryVotes = vi.fn(async () => { throw new Error('unavailable') })
        const router = createMemoryRouter([{
            path: '/classification', handle: {route: 'classification'},
            element: <ClassificationContext.Provider value={classification}>
                <EntryClassificationVote entry={entry}/>
            </ClassificationContext.Provider>
        }], {initialEntries: ['/classification']})
        const accessInfo = {...defaultTestContextValues.access.accessInfo,
            features: {...defaultTestContextValues.access.accessInfo.features, classificationVote: true}}
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'viewer'}}, access: {accessInfo}, api: {fetchClassificationEntryVotes}
        })
        expect(await screen.findByRole('alert')).toHaveTextContent('Could not load classification votes')
    })

    it('never requests other votes on the lock route', () => {
        const fetchVotes = renderVote('/locks', [currentVote, previousVote])
        expect(fetchVotes).not.toHaveBeenCalled()
        expect(screen.queryByText(/Modern Reviewer:/)).not.toBeInTheDocument()
        expect(screen.queryByRole('group', {name: 'Previous votes'})).not.toBeInTheDocument()
    })
})
