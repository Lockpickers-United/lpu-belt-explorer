import React from 'react'
import {act} from 'react-dom/test-utils'
import {describe, expect, it} from 'vitest'
import {screen, within} from '@testing-library/react'
import {renderWithRouter} from '../../src/test/render.jsx'
import LockListRoute from '../../src/locks/LockListRoute.jsx'
import {lockFilterFields} from '../../src/data/filterFields'
import {FilterProvider} from '../../src/context/FilterContext.jsx'

describe('LockListRoute', () => {
    const renderLocks = (route = '/locks') =>
        renderWithRouter(
            <FilterProvider filterFields={lockFilterFields}>
                <LockListRoute/>
            </FilterProvider>,
            {route} // MemoryRouter initialEntries
        )

    it('renders default list with results', async () => {
        renderLocks('/locks')
        const list = await screen.findByRole('list', {name: 'Locks'})
        expect(within(list).getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeInTheDocument()
        expect(within(list).queryByText(/GOAL V18/i)).not.toBeInTheDocument()
    })

    it('renders Lock List with filter', async () => {
        renderLocks('/locks?tab=White&makes=Master+Lock')
        expect(screen.getByRole('listitem', {name: 'Master Lock #1'})).toBeInTheDocument()
    })

    it('renders Lock List with search', async () => {
        renderLocks('/locks?tab=search&search=v18')
        //expect(screen.getByRole('listitem', {name: 'GOAL V18, GP (<14 pins)'})).toBeInTheDocument()
        let firstListItem = screen.getAllByRole('listitem')[0]
        expect(firstListItem).toHaveAccessibleName('GOAL V18, GP (<14 pins)')
    })

    it('updates URL when the user changes belt tab in the UI', async () => {
        renderLocks('/locks?tab=White')
        await screen.findByRole('tab', { name: /white/i })
        const blueTab = screen.getByRole('tab', { name: /blue/i })
        await act(async () => {
            blueTab.click()
        })
        expect(blueTab).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByRole('listitem', {name: 'Any SFIC format lock (**)'})).toBeInTheDocument()
    })

})
