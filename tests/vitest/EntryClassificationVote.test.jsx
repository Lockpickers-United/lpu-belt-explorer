import React from 'react'
import {describe, expect, it} from 'vitest'
import {screen, within} from '@testing-library/react'
import {createMemoryRouter, RouterProvider} from 'react-router-dom'
import {renderWithProviders, defaultTestContextValues} from '../../src/test/render.jsx'
import {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
import EntryClassificationVote from '../../src/classification/EntryClassificationVote.jsx'
const previousVote = {
    id: 'previous-modern-vote',
    type: 'vote',
    entryId: 'test-lock',
    votedBelt: 'Blue',
    userId: 'modern-reviewer',
    displayName: 'Modern Reviewer',
    comment: 'Previous round',
    updatedAt: '2026-09-01T00:00:00Z'
}

function renderClassification(entry, route = '/classification') {
    const accessInfo = {
        ...defaultTestContextValues.access.accessInfo,
        features: {
            ...defaultTestContextValues.access.accessInfo.features,
            classificationVote: true
        }
    }
    const router = createMemoryRouter([{
        path: route,
        handle: {route: route === '/classification' ? 'classification' : 'locks'},
        element: (
            <ClassificationProvider>
                <EntryClassificationVote entry={entry}/>
            </ClassificationProvider>
        )
    }], {initialEntries: [route]})
    return renderWithProviders(<RouterProvider router={router}/>, {
        auth: {user: {uid: 'viewer'}},
        access: {accessInfo}
    })
}

function entryFor(previousVotes) {
    return {
        id: 'test-lock',
        belt: 'Blue',
        currentVotes: [],
        previousVotes,
        classificationStatus: 'Settled'
    }
}

describe('EntryClassificationVote', () => {
    it('shows previous modern votes without a historical section', () => {
        renderClassification(entryFor([previousVote]))

        const previous = screen.getByRole('group', {name: 'Previous votes'})
        expect(within(previous).getByText(/Modern Reviewer:/)).toBeInTheDocument()
        expect(screen.queryByRole('group', {name: 'Historical votes'})).not.toBeInTheDocument()
        expect(screen.queryByRole('button', {name: 'CHECK FOR HISTORICAL VOTES'})).not.toBeInTheDocument()
    })

    it('shows previous modern votes on the lock route', () => {
        renderClassification(entryFor([previousVote]), '/locks')

        expect(screen.getByRole('group', {name: 'Previous votes'})).toBeInTheDocument()
        expect(screen.queryByRole('group', {name: 'Historical votes'})).not.toBeInTheDocument()
    })
})
