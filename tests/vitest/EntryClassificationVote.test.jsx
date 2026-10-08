import React from 'react'
import {describe, expect, it} from 'vitest'
import {screen, waitFor, within} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {createMemoryRouter, RouterProvider} from 'react-router-dom'
import {renderWithProviders, defaultTestContextValues} from '../../src/test/render.jsx'
import {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
import EntryClassificationVote from '../../src/classification/EntryClassificationVote.jsx'
import historicalVotes from '../../src/data/classification-votes-historical.json'

const firstVote = historicalVotes[0]
const secondVote = historicalVotes.find(vote => vote.entryId !== firstVote.entryId)

function entryFor(vote) {
    return {
        id: vote.entryId,
        belt: vote.votedBelt,
        currentBeltDate: '2026-01-01',
        currentVotes: [],
        previousVotes: [],
        classificationStatus: 'Settled'
    }
}

function renderClassification(ui, options) {
    const router = createMemoryRouter([{
        path: '/classification',
        handle: {route: 'classification'},
        element: ui
    }], {initialEntries: ['/classification']})
    return renderWithProviders(<RouterProvider router={router}/>, options)
}

describe('EntryClassificationVote', () => {
    it('loads past votes on click and shows cached votes in later provider instances', async () => {
        const user = userEvent.setup()
        const accessInfo = {
            ...defaultTestContextValues.access.accessInfo,
            features: {
                ...defaultTestContextValues.access.accessInfo.features,
                classificationVote: true
            }
        }
        const renderOptions = {auth: {user: {uid: 'viewer'}}, access: {accessInfo}}

        renderClassification(
            <div data-testid='first-entry'>
                <ClassificationProvider>
                    <EntryClassificationVote entry={entryFor(firstVote)}/>
                </ClassificationProvider>
            </div>,
            renderOptions
        )

        expect(screen.getByRole('button', {name: 'CHECK FOR HISTORICAL VOTES'})).toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: 'CHECK FOR HISTORICAL VOTES'}))

        await waitFor(() => {
            expect(screen.queryByRole('button', {name: 'CHECK FOR HISTORICAL VOTES'})).not.toBeInTheDocument()
        })
        expect(within(screen.getByTestId('first-entry')).getAllByText(new RegExp(firstVote.displayName))).not.toHaveLength(0)

        renderClassification(
            <div data-testid='second-entry'>
                <ClassificationProvider>
                    <EntryClassificationVote entry={entryFor(secondVote)}/>
                </ClassificationProvider>
            </div>,
            renderOptions
        )

        expect(within(screen.getByTestId('second-entry')).queryByRole('button', {name: 'CHECK FOR HISTORICAL VOTES'}))
            .not.toBeInTheDocument()
        expect(within(screen.getByTestId('second-entry')).getAllByText(new RegExp(secondVote.displayName))).not.toHaveLength(0)

        renderClassification(
            <ClassificationProvider>
                <EntryClassificationVote
                    entry={{...entryFor(firstVote), id: 'missing-historical-entry'}}
                />
            </ClassificationProvider>,
            renderOptions
        )
        expect(screen.getByText('No historical votes found')).toBeInTheDocument()
    })
})
