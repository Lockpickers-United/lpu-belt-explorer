import React, {useContext} from 'react'
import {createMemoryRouter, RouterProvider, useNavigate} from 'react-router-dom'
import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {renderWithProviders} from '../../src/test/render.jsx'
import ClassificationContext from '../../src/app/ClassificationContext.jsx'
import ClassificationChangelogProvider from '../../src/classification/ClassificationChangelogProvider.jsx'
import reconcileClassificationAction from '../../src/classification/reconcileClassificationAction.js'

const staged = {id: 'action-a', entryId: 'lock-a', status: 'Staged', action: 'Belt Change', updatedBelt: 'Blue'}
const publication = {id: 'publication-a', lastPublishedAt: '2026-10-10T00:00:00Z', actionCount: 1}
const snapshot = {actionId: 'action-a', entryId: 'lock-a', action: 'Belt Change', updatedBelt: 'Blue'}

function Capture() {
    const value = useContext(ClassificationContext)
    const navigate = useNavigate()
    return <div>
        <output>Staged: {value.stagedActions.length}</output>
        <output>Publications: {value.previousChangelogs.length}</output>
        <output>Selected actions: {value.selectedPublication?.actions.length ?? 0}</output>
        <button onClick={() => navigate('/classification/changelog?id=publication-a')}>Select date</button>
    </div>
}

describe('live changelog reads', () => {
    it('loads staged actions and publication dates, then fetches a snapshot on selection', async () => {
        const fetchClassificationStaged = vi.fn(async () => ({actions: [staged]}))
        const fetchClassificationPublications = vi.fn(async () => ({publications: [publication], nextCursor: null}))
        const fetchClassificationPublication = vi.fn(async () => ({...publication, actions: [snapshot]}))
        const router = createMemoryRouter([{
            path: '/classification/changelog',
            element: <ClassificationContext.Provider value={{getAdminAction: () => null}}>
                <ClassificationChangelogProvider><Capture/></ClassificationChangelogProvider>
            </ClassificationContext.Provider>
        }], {initialEntries: ['/classification/changelog']})
        renderWithProviders(<RouterProvider router={router}/>, {
            api: {fetchClassificationStaged, fetchClassificationPublications, fetchClassificationPublication}
        })
        expect(await screen.findByText('Staged: 1')).toBeInTheDocument()
        expect(screen.getByText('Publications: 1')).toBeInTheDocument()
        expect(fetchClassificationPublication).not.toHaveBeenCalled()
        await userEvent.setup().click(screen.getByRole('button', {name: 'Select date'}))
        expect(await screen.findByText('Selected actions: 1')).toBeInTheDocument()
        expect(fetchClassificationPublication).toHaveBeenCalledExactlyOnceWith('publication-a')
    })

    it('compares publication intent to a retained catalog state', () => {
        const catalog = new Map([['lock-a', {name: 'Lock A', belt: 'Green'}],
            ['lock-b', {name: 'Lock B', belt: 'Blue'}]])
        expect(reconcileClassificationAction(snapshot, catalog)).toEqual({
            status: 'Awaiting import', detail: 'Current belt: Green; intended: Blue', mismatch: true
        })
        expect(reconcileClassificationAction({...snapshot, action: 'Delete'}, catalog).status).toBe('Awaiting import')
        expect(reconcileClassificationAction({...snapshot, action: 'Sameline', samelineTargetId: 'lock-b'}, catalog)
            .detail).toContain('retained target is Blue')
        expect(reconcileClassificationAction({...snapshot, action: 'Sameline', samelineTargetId: 'missing'}, catalog)
            .status).toBe('Needs review')
        expect(reconcileClassificationAction({...snapshot, action: 'Other', updatedBelt: null}, catalog))
            .toEqual({status: 'Needs review', detail: 'Other change'})
        expect(reconcileClassificationAction({...snapshot, action: 'Add New Sameline',
            newSamelineName: 'New Lock Name'}, catalog)).toEqual({
            status: 'Needs review', detail: 'Verify New Lock Name was added to Lock A'
        })
        expect(reconcileClassificationAction({...snapshot, action: 'Add New Sameline',
            newSamelineName: 'New Lock Name', entryId: 'missing'}, catalog).status).toBe('Needs review')
    })
})
