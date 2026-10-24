import React, {useContext, useState} from 'react'
import {createMemoryRouter, RouterProvider} from 'react-router-dom'
import {describe, expect, it, vi} from 'vitest'
import {screen, within} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {defaultTestContextValues, renderWithProviders} from '../../src/test/render.jsx'
import ClassificationContext from '../../src/app/ClassificationContext.jsx'
import DataContext from '../../src/context/DataContext.jsx'
import ChangelogMain from '../../src/classification/ChangelogMain.jsx'
import changelogEntryFormat from '../../src/classification/changelogEntryFormat.js'
import fixtures from '../fixtures/classification-test-data.json'
import allEntries from '../../src/data/data.json'
import download from '../../src/util/download.js'

vi.mock('../../src/util/download.js', () => ({default: vi.fn()}))
vi.mock('notistack', async importOriginal => ({
    ...await importOriginal(),
    enqueueSnackbar: vi.fn()
}))

const samelineAction = fixtures.adminActions.find(action => action.action === 'Sameline')
const deleteAction = fixtures.adminActions.find(action => action.action === 'Delete')
const changelogs = fixtures.changelogs
const classification = {
    getAdminAction: entry => fixtures.adminActions.find(action => action.entryId === entry.id) ?? null,
    previousChangelogs: changelogs
}
const samelineEntry = allEntries.find(entry => entry.id === samelineAction.entryId)
const deleteEntry = allEntries.find(entry => entry.id === deleteAction.entryId)
const targetLock = allEntries.find(entry => entry.id === samelineAction.samelineLock.lockId)

describe('classification changelog', () => {
    it('publishes only included staged actions with their current revisions', async () => {
        const user = userEvent.setup()
        const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
        const classificationCommand = vi.fn(async () => ({publication: {id: 'published-batch'}}))
        const reloadChangelog = vi.fn()
        const stagedActions = [
            {id: 'included', entryId: samelineEntry.id, status: 'Staged', revision: 4,
                action: 'Other', omitChangelog: false},
            {id: 'omitted', entryId: deleteEntry.id, status: 'Staged', revision: 2,
                action: 'Delete', omitChangelog: true}
        ]
        const data = {visibleChangelogEntries: [], getLockFromId: id => allEntries.find(entry => entry.id === id)}
        const router = createMemoryRouter([{
            path: '/classification/changelog', handle: {route: 'classification'},
            element: <ClassificationContext.Provider value={{...classification, stagedActions,
                reloadChangelog}}>
                <DataContext.Provider value={data}><ChangelogMain/></DataContext.Provider>
            </ClassificationContext.Provider>
        }], {initialEntries: ['/classification/changelog']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'admin-user'}},
            access: {accessInfo: {...defaultTestContextValues.access.accessInfo,
                roles: {...defaultTestContextValues.access.accessInfo.roles, classificationAdmin: true}}},
            api: {classificationCommand}
        })

        await user.click(screen.getByRole('button', {name: 'Publish'}))
        expect(screen.getByText(/About to publish 1 change\./)).toBeInTheDocument()
        expect(classificationCommand).not.toHaveBeenCalled()
        await user.click(within(screen.getByRole('menu')).getByRole('button', {name: 'Publish'}))
        expect(confirm).not.toHaveBeenCalled()
        expect(classificationCommand).toHaveBeenCalledWith('post', 'publications', {
            actions: [{actionId: 'included', expectedRevision: 4}]
        }, expect.any(String))
        expect(reloadChangelog).toHaveBeenCalledOnce()
        expect(router.state.location.search).toBe('?id=published-batch')
        confirm.mockRestore()
    })

    it('publishes at most the first 50 included staged actions', async () => {
        const user = userEvent.setup()
        const classificationCommand = vi.fn(async () => ({publication: {id: 'published-batch'}}))
        const stagedActions = Array.from({length: 51}, (_, index) => ({
            id: `action-${index}`, entryId: `entry-${index}`, status: 'Staged', revision: 1,
            action: 'Delete', omitChangelog: false
        }))
        const router = createMemoryRouter([{
            path: '/classification/changelog', handle: {route: 'classification'},
            element: <ClassificationContext.Provider value={{...classification, stagedActions}}>
                <DataContext.Provider value={{visibleChangelogEntries: [], getLockFromId: () => null}}>
                    <ChangelogMain/>
                </DataContext.Provider>
            </ClassificationContext.Provider>
        }], {initialEntries: ['/classification/changelog']})
        renderWithProviders(<RouterProvider router={router}/>, {
            auth: {user: {uid: 'admin-user'}},
            access: {accessInfo: {...defaultTestContextValues.access.accessInfo,
                roles: {...defaultTestContextValues.access.accessInfo.roles, classificationAdmin: true}}},
            api: {classificationCommand}
        })

        await user.click(screen.getByRole('button', {name: 'Publish first 50'}))
        expect(screen.getByText(/About to publish first 50 changes\./)).toBeInTheDocument()
        expect(classificationCommand).not.toHaveBeenCalled()
        await user.click(within(screen.getByRole('menu')).getByRole('button', {name: 'Publish first 50'}))
        const actions = classificationCommand.mock.calls[0][2].actions
        expect(actions).toHaveLength(50)
        expect(actions[0]).toEqual({actionId: 'action-0', expectedRevision: 1})
        expect(actions[49]).toEqual({actionId: 'action-49', expectedRevision: 1})
    })

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

    it('formats an Other action using the original belt in published history', () => {
        const action = {action: 'Other', note: 'Updated lock details', previousBelt: 'Blue'}
        expect(changelogEntryFormat({entry: samelineEntry, adminAction: action}))
            .toContain(`${samelineEntry.belt}. Updated lock details`)
        expect(changelogEntryFormat({entry: samelineEntry, adminAction: action, historical: true}))
            .toContain('Blue. Updated lock details')
    })

    it('groups an Other action and exports its unchanged belt and note', async () => {
        const user = userEvent.setup()
        const action = {id: 'action-other', entryId: samelineEntry.id, status: 'Staged',
            action: 'Other', updatedBelt: null, note: 'Updated lock details'}
        const data = {
            visibleChangelogEntries: [samelineEntry],
            getLockFromId: id => allEntries.find(entry => entry.id === id)
        }
        const router = createMemoryRouter([{
            path: '/classification/changelog', handle: {route: 'classification'},
            element: <ClassificationContext.Provider value={{
                ...classification, getAdminAction: () => action
            }}>
                <DataContext.Provider value={data}><ChangelogMain/></DataContext.Provider>
            </ClassificationContext.Provider>
        }], {initialEntries: ['/classification/changelog']})
        renderWithProviders(<RouterProvider router={router}/>, {
            access: {accessInfo: {...defaultTestContextValues.access.accessInfo,
                roles: {...defaultTestContextValues.access.accessInfo.roles, classificationAdmin: true}}}
        })

        expect(screen.getByText('Other')).toBeInTheDocument()
        expect(screen.queryByText('Downgrades')).not.toBeInTheDocument()
        expect(screen.getByText(/Updated lock details/)).toBeInTheDocument()

        await user.click(screen.getByRole('button', {name: 'Export'}))
        await user.click(screen.getByRole('menuitem', {name: 'JSON'}))
        expect(JSON.parse(vi.mocked(download).mock.lastCall[1])).toContainEqual(expect.objectContaining({
            id: samelineEntry.id,
            action: 'Other',
            change: 'Other',
            belt: samelineEntry.belt,
            note: 'Updated lock details'
        }))
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
                <ClassificationContext.Provider value={classification}>
                    <DataContext.Provider value={data}>
                        <button onClick={() => setShowSameline(false)}>Filter Sameline</button>
                        <ChangelogMain/>
                    </DataContext.Provider>
                </ClassificationContext.Provider>
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
                <ClassificationContext.Provider value={classification}>
                    <HistoricalHarness/>
                </ClassificationContext.Provider>
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
