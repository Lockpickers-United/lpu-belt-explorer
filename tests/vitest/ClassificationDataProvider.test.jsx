import React, {useContext} from 'react'
import {createMemoryRouter, Outlet, RouterProvider} from 'react-router-dom'
import {describe, expect, it} from 'vitest'
import {renderWithProviders} from '../../src/test/render.jsx'
import {FilterProvider} from '../../src/context/FilterContext.jsx'
import {classificationFilterFields} from '../../src/data/filterFields.js'
import ClassificationContext from '../../src/app/ClassificationContext.jsx'
import {ClassificationDataProvider} from '../../src/classification/ClassificationDataProvider.jsx'
import DataContext from '../../src/context/DataContext.jsx'
import allEntries from '../../src/data/data.json'

const byId = id => allEntries.find(entry => entry.id === id)
const unranked = byId('3b7643da')
const ranked = {...byId('ca9828d7'), belt: 'Blue'}
const reopened = {...byId('e2fd1519'), belt: 'Blue'}
const staged = {...byId('18ecc45b'), belt: 'Orange'}
const previous = {...byId('fe9889e2'), belt: 'Green'}
const entries = [unranked, ranked, reopened, staged, previous]
const chip = (id, displayName, votedBelt) => ({id, displayName, votedBelt,
    updatedAt: '2026-10-01T00:00:00Z', userId: id})
const summaries = new Map([
    [unranked.id, {current: [chip('v1', 'Reviewer A', 'Blue')]}],
    [ranked.id, {current: [chip('v2', 'Reviewer B', 'Green')]}],
    [reopened.id, {status: 'Re-opened', current: [chip('v3', 'Reviewer C', 'Blue')]}],
    [staged.id, {status: 'Staged', current: [chip('v4', 'Reviewer D', 'Orange')]}],
    [previous.id, {previous: [chip('v5', 'Reviewer E', 'Green')]}]
])
const classification = {
    getCurrentVotes: entry => summaries.get(entry.id)?.current ?? [],
    getPreviousVotes: entry => summaries.get(entry.id)?.previous ?? [],
    getAdminActionStatus: entry => summaries.get(entry.id)?.status ??
        (summaries.get(entry.id)?.current?.length ? 'Has Votes' : 'No Votes'),
    isActive: entry => entry.belt === 'Unranked' ||
        ['Re-opened', 'Staged'].includes(summaries.get(entry.id)?.status),
    stagedByEntry: new Map([[staged.id, {id: 'action-1'}]])
}

function renderData(path, onData) {
    function Capture() {
        onData(useContext(DataContext))
        return null
    }
    const child = (
        <ClassificationContext.Provider value={classification}>
            <FilterProvider filterFields={classificationFilterFields}>
                <ClassificationDataProvider allEntries={entries}><Capture/></ClassificationDataProvider>
            </FilterProvider>
        </ClassificationContext.Provider>
    )
    const router = createMemoryRouter([{
        path: '/classification', handle: {route: 'classification'}, element: <Outlet/>,
        children: [
            {index: true, element: child},
            {path: 'ranked', handle: {route: 'ranked'}, element: child}
        ]
    }], {initialEntries: [path]})
    renderWithProviders(<RouterProvider router={router}/>)
}

describe('ClassificationDataProvider live summaries', () => {
    it('keeps unranked, reopened, and staged locks in the active worklist', () => {
        let data
        renderData('/classification', value => { data = value })
        expect(data.visibleEntries.map(entry => entry.id).sort()).toEqual([unranked.id, reopened.id, staged.id].sort())
        expect(data.getEntryFromId(ranked.id).voteCount).toBe(1)
        expect(data.getEntryFromId(reopened.id).classificationStatus).toBe('Re-opened')
    })

    it('includes current and previous voted ranked locks, except staged work', () => {
        let data
        renderData('/classification/ranked', value => { data = value })
        expect(data.visibleEntries.map(entry => entry.id).sort()).toEqual([ranked.id, reopened.id, previous.id].sort())
        expect(data.getEntryFromId(previous.id).voteCount).toBe(0)
        expect(data.getEntryFromId(previous.id).previousVotes).toHaveLength(1)
    })

    it('uses the staged API projection for changelog membership', () => {
        let data
        renderData('/classification', value => { data = value })
        expect(data.visibleChangelogEntries.map(entry => entry.id)).toEqual([staged.id])
        expect(data.getEntryFromId(unranked.id).displayName).toEqual(['Reviewer A'])
    })
})
