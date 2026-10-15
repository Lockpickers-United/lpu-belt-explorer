import React, {useContext} from 'react'
import {act} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import DataContext, {DataProvider} from '../../src/locks/LockDataProvider.jsx'
import {FilterProvider} from '../../src/context/FilterContext.jsx'
import {renderWithRouter} from '../../src/test/render.jsx'
import catalog from '../../src/data/data.json'

const firestore = vi.hoisted(() => ({listeners: []}))
vi.mock('firebase/firestore', async importOriginal => ({
    ...await importOriginal(),
    collection: (_db, name) => ({name}),
    onSnapshot: (source, next, error) => {
        const unsubscribe = vi.fn()
        firestore.listeners.push({source, next, error, unsubscribe})
        return unsubscribe
    }
}))
vi.mock('../../src/util/useData.jsx', () => ({
    default: () => ({data: {lockbazzarEntryIds: []}, loading: false, error: null})
}))

const seedId = '02788bde'
const newId = '07034c0f'
const entries = catalog.filter(entry => [seedId, newId].includes(entry.id))
const hasClassification = (value, id) => value.mappedEntries.find(entry => entry.id === id)
    ?.features?.includes('Classification') ?? false

describe('lock Classification feature filter', () => {
    beforeEach(() => { firestore.listeners.length = 0 })

    function renderFilter(auth) {
        let value
        function Capture() {
            value = useContext(DataContext)
            return null
        }
        const result = renderWithRouter(
            <FilterProvider><DataProvider allEntries={entries} profile={{}}><Capture/></DataProvider></FilterProvider>,
            {auth}
        )
        return {...result, getValue: () => value}
    }

    it('keeps the Classification option unavailable to signed-out visitors', () => {
        const view = renderFilter()
        expect(firestore.listeners).toHaveLength(0)
        expect(hasClassification(view.getValue(), seedId)).toBe(false)
    })

    it('applies live additions and removals over the seed for signed-in members', () => {
        const view = renderFilter({user: {uid: 'member'}, isLoggedIn: true})
        expect(firestore.listeners.map(listener => listener.source.name))
            .toEqual(['classificationFeatureEntries'])
        expect(hasClassification(view.getValue(), seedId)).toBe(true)
        expect(hasClassification(view.getValue(), newId)).toBe(false)

        act(() => firestore.listeners[0].next({docs: [
            {id: seedId, data: () => ({hasModernVotes: false})},
            {id: newId, data: () => ({hasModernVotes: true})}
        ]}))
        expect(hasClassification(view.getValue(), seedId)).toBe(false)
        expect(hasClassification(view.getValue(), newId)).toBe(true)
        act(() => firestore.listeners[0].error(new Error('permission denied')))
        expect(view.getValue().classificationFeatureError.message).toBe('permission denied')
        expect(hasClassification(view.getValue(), newId)).toBe(true)
        view.unmount()
        expect(firestore.listeners[0].unsubscribe).toHaveBeenCalledOnce()
    })
})
