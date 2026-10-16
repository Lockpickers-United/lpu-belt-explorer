import React, {useContext} from 'react'
import {describe, expect, it, vi} from 'vitest'
import DataContext, {DataProvider} from '../../src/locks/LockDataProvider.jsx'
import {FilterProvider} from '../../src/context/FilterContext.jsx'
import {renderWithRouter} from '../../src/test/render.jsx'
import catalog from '../../src/data/data.json'

const firestore = vi.hoisted(() => ({onSnapshot: vi.fn()}))
vi.mock('firebase/firestore', async importOriginal => ({
    ...await importOriginal(),
    onSnapshot: firestore.onSnapshot
}))
vi.mock('../../src/util/useData.jsx', () => ({
    default: () => ({data: {lockbazzarEntryIds: []}, loading: false, error: null})
}))

const entry = catalog.find(item => item.id === '3ac43ea8')

describe('lock data provider', () => {
    it.each([undefined, {user: {uid: 'member'}, isLoggedIn: true}])(
        'preserves catalog features without adding a Classification feature for auth %s', auth => {
            firestore.onSnapshot.mockClear()
            let value
            function Capture() {
                value = useContext(DataContext)
                return null
            }
            renderWithRouter(
                <FilterProvider><DataProvider allEntries={[entry]} profile={{}}><Capture/></DataProvider></FilterProvider>,
                {auth}
            )
            expect(value.mappedEntries[0].features).toEqual(entry.features)
            expect(value.mappedEntries[0].features).not.toContain('Classification')
            expect(value).not.toHaveProperty('classificationFeatureError')
            expect(firestore.onSnapshot).not.toHaveBeenCalled()
        }
    )
})
