import React, {useContext} from 'react'
import {act, screen, waitFor} from '@testing-library/react'
import {createMemoryRouter, Outlet, RouterProvider, useNavigate} from 'react-router-dom'
import {userEvent} from '@testing-library/user-event'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {defaultTestContextValues, renderWithProviders} from '../../src/test/render.jsx'
import ClassificationContext, {
    ClassificationProvider, ClassificationSummaryProvider
} from '../../src/app/ClassificationContext.jsx'
import EntryClassificationVote from '../../src/classification/EntryClassificationVote.jsx'

const firestore = vi.hoisted(() => ({listeners: []}))
vi.mock('firebase/firestore', async importOriginal => ({
    ...await importOriginal(),
    collection: (_db, name) => ({name}),
    where: (field, operator, value) => ({field, operator, value}),
    query: (source, filter) => ({...source, filter}),
    onSnapshot: (source, next, error) => {
        const unsubscribe = vi.fn()
        firestore.listeners.push({source, next, error, unsubscribe})
        return unsubscribe
    }
}))

const reader = {user: {uid: 'owner'}, userClaims: ['classificationTeam']}
const readerAccess = {accessInfo: {...defaultTestContextValues.access.accessInfo,
    roles: {...defaultTestContextValues.access.accessInfo.roles, classificationTeam: true}}}
const entry = {id: 'lock-a', belt: 'Blue'}
const vote = {
    id: 'vote-a', entryId: 'lock-a', userId: 'owner', votedBelt: 'Green',
    createdAt: '2026-09-01T00:00:00Z', updatedAt: '2026-09-01T00:00:00Z'
}
const milestone = '2026-09-10T00:00:00Z'
const emit = (listener, records) => act(() => listener.next({docs: records.map(record => ({
    id: record.id, data: () => record
}))}))

describe('Classification readers', () => {
    beforeEach(() => { firestore.listeners.length = 0 })

    it('subscribes once to the owner vote and matching state, without a full summary', () => {
        let value
        function Capture() {
            value = useContext(ClassificationContext)
            return null
        }
        const {unmount} = renderWithProviders(<ClassificationProvider><Capture/></ClassificationProvider>,
            {auth: reader, access: readerAccess})
        expect(firestore.listeners.map(listener => listener.source)).toEqual([
            {name: 'classificationVotes', filter: {field: 'userId', operator: '==', value: 'owner'}},
            {name: 'classificationEntryStates', filter: {field: 'voterIds', operator: 'array-contains', value: 'owner'}}
        ])
        expect(value.getUserVote(entry)).toBeNull()
        unmount()
        expect(firestore.listeners.every(listener => listener.unsubscribe.mock.calls.length === 1)).toBe(true)
    })

    it('keeps the effective owner vote while hiding its previous chip', () => {
        let value
        function Capture() {
            value = useContext(ClassificationContext)
            return null
        }
        renderWithProviders(<ClassificationProvider><Capture/></ClassificationProvider>,
            {auth: reader, access: readerAccess})
        emit(firestore.listeners[0], [vote])
        emit(firestore.listeners[1], [{id: 'lock-a', entryId: 'lock-a', voterIds: ['owner'],
            decisionMilestoneAt: milestone, reopened: false}])
        expect(value.getUserVote(entry)).toMatchObject(vote)
        expect(value.getCurrentUserVote(entry)).toBeNull()
        emit(firestore.listeners[1], [{id: 'lock-a', entryId: 'lock-a', voterIds: ['owner'],
            decisionMilestoneAt: milestone, reopened: true}])
        expect(value.getCurrentUserVote(entry)).toMatchObject(vote)
    })

    it('does not subscribe when AccessContext has no eligible reader role', () => {
        renderWithProviders(<ClassificationProvider><span>public</span></ClassificationProvider>, {
            auth: reader
        })
        expect(firestore.listeners).toHaveLength(0)
    })

    it('mounts one full summary listener when the modern route installs its summary provider', () => {
        let value
        function Capture() {
            value = useContext(ClassificationContext)
            return null
        }
        const {unmount} = renderWithProviders(
            <ClassificationProvider><ClassificationSummaryProvider><Capture/></ClassificationSummaryProvider></ClassificationProvider>,
            {auth: reader, access: readerAccess}
        )
        expect(firestore.listeners.map(listener => listener.source.name).sort()).toEqual([
            'classificationVotes', 'classificationEntryStates', 'classificationEntries'
        ].sort())
        const summaryListener = firestore.listeners.find(listener => listener.source.name === 'classificationEntries')
        emit(summaryListener, [{
            id: 'lock-a', entryId: 'lock-a', revision: 3,
            currentVoteChips: [{id: 'current', userId: 'other', votedBelt: 'Blue'}],
            previousVoteChips: [{id: 'previous', userId: 'owner', votedBelt: 'Green'}],
            currentVoteCount: 1, currentActionId: 'action-a', currentActionStatus: 'Re-opened'
        }])
        expect(value.getCurrentVotes(entry)).toHaveLength(1)
        expect(value.getPreviousVotes(entry)).toHaveLength(1)
        expect(value.getAdminAction(entry)).toEqual({id: 'action-a', status: 'Re-opened'})
        expect(value.isActive(entry)).toBe(true)
        unmount()
        expect(summaryListener.unsubscribe).toHaveBeenCalledOnce()
    })

    it('exposes summary read failures to the route while leaving rendering to its consumer', () => {
        let value
        function Capture() {
            value = useContext(ClassificationContext)
            return <span>worklist</span>
        }
        renderWithProviders(
            <ClassificationProvider><ClassificationSummaryProvider><Capture/></ClassificationSummaryProvider></ClassificationProvider>,
            {auth: reader, access: readerAccess}
        )
        const summaryListener = firestore.listeners.find(listener => listener.source.name === 'classificationEntries')
        act(() => summaryListener.error(new Error('permission denied')))
        expect(value.summaryLoading).toBe(false)
        expect(value.summaryError).toEqual(new Error('permission denied'))
        expect(screen.getByText('worklist')).toBeInTheDocument()
    })

    it('keeps lock and scorecard routes on owner reads and releases summary/detail after Classification', async () => {
        const fetchClassificationEntryVotes = vi.fn(async () => ({votes: [], nextCursor: null}))
        const accessInfo = {...readerAccess.accessInfo,
            features: {...defaultTestContextValues.access.accessInfo.features, classificationVote: true}}
        function Navigation() {
            const navigate = useNavigate()
            return <nav>
                <button onClick={() => navigate('/profile/scorecard')}>Scorecard</button>
                <button onClick={() => navigate('/classification')}>Classification</button>
                <button onClick={() => navigate('/classification/past')}>Past</button>
            </nav>
        }
        const ownerPanel = <EntryClassificationVote entry={{...entry, classificationStatus: 'No Votes'}}/>
        const router = createMemoryRouter([{
            path: '/',
            element: <ClassificationProvider><Navigation/><Outlet/></ClassificationProvider>,
            children: [
                {path: 'locks', element: ownerPanel},
                {path: 'profile/scorecard', element: ownerPanel},
                {path: 'classification', handle: {route: 'classification'}, element: <Outlet/>, children: [
                    {index: true, element: <ClassificationSummaryProvider>{ownerPanel}</ClassificationSummaryProvider>},
                    {path: 'past', element: <div>Static historical archive</div>}
                ]}
            ]
        }], {initialEntries: ['/locks']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: reader, access: {accessInfo}, api: {fetchClassificationEntryVotes}
        })
        expect(firestore.listeners.map(listener => listener.source.name).sort()).toEqual([
            'classificationVotes', 'classificationEntryStates'
        ].sort())
        expect(fetchClassificationEntryVotes).not.toHaveBeenCalled()

        const user = userEvent.setup()
        await user.click(screen.getByRole('button', {name: 'Scorecard'}))
        expect(firestore.listeners).toHaveLength(2)
        expect(fetchClassificationEntryVotes).not.toHaveBeenCalled()

        await user.click(screen.getByRole('button', {name: 'Classification'}))
        const summaryListener = firestore.listeners.find(listener => listener.source.name === 'classificationEntries')
        expect(summaryListener).toBeDefined()
        emit(summaryListener, [])
        await waitFor(() => expect(fetchClassificationEntryVotes).toHaveBeenCalledWith('lock-a', null))

        await user.click(screen.getByRole('button', {name: 'Past'}))
        expect(screen.getByText('Static historical archive')).toBeInTheDocument()
        expect(summaryListener.unsubscribe).toHaveBeenCalledOnce()
        expect(fetchClassificationEntryVotes).toHaveBeenCalledTimes(1)
    })
})
