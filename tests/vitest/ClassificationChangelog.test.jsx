import React, {useContext, useState} from 'react'
import {createMemoryRouter, RouterProvider} from 'react-router-dom'
import {describe, expect, it, vi} from 'vitest'
import {screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {defaultTestContextValues, renderWithProviders} from '../../src/test/render.jsx'
import ClassificationContext, {ClassificationProvider} from '../../src/app/ClassificationContext.jsx'
import DataContext from '../../src/context/DataContext.jsx'
import ChangelogMain from '../../src/classification/ChangelogMain.jsx'
import changelogEntryFormat from '../../src/classification/changelogEntryFormat.js'
import adminActions from '../../src/data/classification-samples-admin.json'
import changelogs from '../../src/data/classification-samples-changelog.json'
import allEntries from '../../src/data/data.json'
import download from '../../src/util/download.js'

vi.mock('../../src/data/classification-samples-admin.json', async () => {
    const {default: fixtures} = await import('../fixtures/classification-test-data.json')
    return {default: fixtures.adminActions}
})
vi.mock('../../src/data/classification-samples-changelog.json', async () => {
    const {default: fixtures} = await import('../fixtures/classification-test-data.json')
    return {default: fixtures.changelogs}
})

vi.mock('../../src/util/download.js', () => ({default: vi.fn()}))
vi.mock('notistack', async importOriginal => ({
    ...await importOriginal(),
    enqueueSnackbar: vi.fn()
}))

const samelineAction = adminActions.find(action => action.action === 'Sameline')
const deleteAction = adminActions.find(action => action.action === 'Delete')
const samelineEntry = allEntries.find(entry => entry.id === samelineAction.entryId)
const deleteEntry = allEntries.find(entry => entry.id === deleteAction.entryId)
const targetLock = allEntries.find(entry => entry.id === samelineAction.samelineLock.lockId)

describe('classification changelog', () => {
    it('formats Sameline and Delete actions with their target and original belt', () => {
        expect(targetLock).toBeDefined()
        expect(changelogEntryFormat({
            entry: samelineEntry,
            adminAction: samelineAction,
            targetLock
        })).toContain('sameline with **Any China Padlock (granite look)** at WHITE.')
        expect(changelogEntryFormat({
            entry: deleteEntry,
            adminAction: deleteAction
        })).toContain('White. Lock doesn\'t exist in this version')
        const historicalDelete = changelogEntryFormat({
            entry: deleteEntry,
            adminAction: {...deleteAction, entryName: 'Archived lock', previousBelt: 'Blue'},
            historical: true
        })
        expect(historicalDelete).toContain('**Archived lock**')
        expect(historicalDelete).toContain('Blue. Lock doesn\'t exist in this version')
        expect(changelogEntryFormat({
            entry: samelineEntry,
            adminAction: {...samelineAction, samelineLock: {...samelineAction.samelineLock, belt: 'Purple'}},
            historical: true
        })).toContain('at PURPLE.')
    })

    it('shows staged Sameline and Delete sections as the visible actions change', async () => {
        const user = userEvent.setup()
        function ChangelogHarness() {
            const [showSameline, setShowSameline] = useState(true)
            const data = {
                visibleChangelogEntries: showSameline ? [samelineEntry, deleteEntry] : [deleteEntry],
                getLockFromId: id => allEntries.find(entry => entry.id === id)
            }
            return (
                <ClassificationProvider>
                    <DataContext.Provider value={data}>
                        <button onClick={() => setShowSameline(false)}>Filter Sameline</button>
                        <ChangelogMain/>
                    </DataContext.Provider>
                </ClassificationProvider>
            )
        }
        const router = createMemoryRouter([{
            path: '/classification/changelog',
            handle: {route: 'classification'},
            element: <ChangelogHarness/>
        }], {initialEntries: ['/classification/changelog']})

        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {isLoggedIn: true, user: {uid: 'admin-user'}},
            access: {accessInfo: {
                ...defaultTestContextValues.access.accessInfo,
                roles: {classificationAdmin: true},
                features: {classificationAdmin: true, classificationVote: true}
            }}
        })

        expect(screen.getByText('Samelines')).toBeInTheDocument()
        expect(screen.getByText('Deleted')).toBeInTheDocument()
        expect(screen.getByText(/sameline with/)).toBeInTheDocument()
        expect(screen.getByText(/Lock doesn't exist in this version/)).toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: 'Export'}))
        await user.click(screen.getByRole('menuitem', {name: 'JSON'}))
        const exportedRows = JSON.parse(vi.mocked(download).mock.calls[0][1])
        expect(exportedRows).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: samelineEntry.id,
                action: 'Sameline',
                belt: targetLock.belt,
                samelineTargetId: targetLock.id
            }),
            expect.objectContaining({
                id: deleteEntry.id,
                action: 'Delete',
                belt: deleteEntry.belt
            })
        ]))

        await user.click(screen.getByRole('button', {name: 'Filter Sameline'}))

        expect(screen.queryByText('Samelines')).not.toBeInTheDocument()
        expect(screen.getByText('Deleted')).toBeInTheDocument()
    })

    it('shows a published action snapshot and returns to the staged changelog', async () => {
        const user = userEvent.setup()
        const snapshot = {
            ...changelogs[0].changes[0],
            entryName: 'Archived lock name',
            updatedBelt: 'Brown',
            note: 'Archived snapshot note'
        }
        const publishedLog = {...changelogs[0], changes: [snapshot]}
        const data = {
            visibleChangelogEntries: [samelineEntry],
            getLockFromId: id => id === snapshot.entryId ? undefined : allEntries.find(entry => entry.id === id)
        }
        function HistoricalHarness() {
            const classification = useContext(ClassificationContext)
            return (
                <ClassificationContext.Provider value={{...classification, previousChangelogs: [publishedLog]}}>
                    <DataContext.Provider value={data}>
                        <ChangelogMain/>
                    </DataContext.Provider>
                </ClassificationContext.Provider>
            )
        }
        const router = createMemoryRouter([{
            path: '/classification/changelog',
            handle: {route: 'changelog'},
            element: (
                <ClassificationProvider>
                    <HistoricalHarness/>
                </ClassificationProvider>
            )
        }], {initialEntries: ['/classification/changelog']})

        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {isLoggedIn: true, user: {uid: 'admin-user'}},
            access: {accessInfo: {
                ...defaultTestContextValues.access.accessInfo,
                roles: {...defaultTestContextValues.access.accessInfo.roles, classificationAdmin: true}
            }}
        })

        expect(screen.getByText('STAGED CHANGES')).toBeInTheDocument()
        await user.click(screen.getByRole('button', {name: 'View Previous Changelogs'}))
        await user.click(screen.getByRole('menuitem', {name: /October 9, 2026/}))

        expect(router.state.location.search).toBe(`?id=${publishedLog.id}`)
        expect(screen.getByText('OCTOBER 9, 2026')).toBeInTheDocument()
        expect(screen.getByText('Upgrades')).toBeInTheDocument()
        expect(screen.getByText(/Archived lock name/)).toBeInTheDocument()
        expect(screen.getByText(/Archived snapshot note/)).toBeInTheDocument()
        expect(screen.queryByRole('button', {name: 'Edit'})).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: 'Export'}))
        await user.click(screen.getByRole('menuitem', {name: 'JSON'}))
        expect(vi.mocked(download).mock.lastCall[0]).toBe('changelog-2026-Oct.json')
        expect(JSON.parse(vi.mocked(download).mock.lastCall[1])).toContainEqual(expect.objectContaining({
            id: publishedLog.changes[0].entryId,
            adminActionId: publishedLog.changes[0].id,
            change: 'Upgrade',
            belt: publishedLog.changes[0].updatedBelt
        }))

        await user.click(screen.getByRole('button', {name: 'View Previous Changelogs'}))
        await user.click(screen.getByRole('menuitem', {name: /Current Changes/}))
        expect(router.state.location.search).toBe('')
        expect(screen.getByText('STAGED CHANGES')).toBeInTheDocument()
        expect(screen.getByText('Samelines')).toBeInTheDocument()
    })
})
