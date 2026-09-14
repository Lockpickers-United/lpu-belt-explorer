import React from 'react'
import {describe, expect, it} from 'vitest'
import {screen, waitFor, within} from '@testing-library/react'
import {renderWithRouter} from '../../src/test/render.jsx'
import LockListRoute from '../../src/locks/LockListRoute.jsx'
import {userEvent} from '@testing-library/user-event'
import allEntries from '../../src/data/data.json'

const fixtureEntryIds = new Set([
    '07034c0f', // Any Acrylic Padlock
    '9f613c4a', // GOAL V18 / GOAL GP (Red)
    '63b2e02b', // GOAL V18 / GOAL GP (Black 1)
    '109531f4', // GOAL V18 / GOAL GP (Black 2)
    '5a91e6a5', // Master Lock #1
    'c6529d9c', // Any SFIC format lock (**)
    '6f837bb4', // A.S.I. Inc. Royal Guardian
    '5e3397a9' // Zeta Padlock
])
const fixtureEntries = allEntries.filter(({id}) => fixtureEntryIds.has(id))

describe('LockListRoute', () => {
    const renderLocks = (route = '/locks') =>
        renderWithRouter(
            <LockListRoute allEntries={fixtureEntries}/>,
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
        let firstListItem = screen.getAllByRole('listitem')[0]
        expect(firstListItem).toHaveAccessibleName(/GOAL V18/i)
    })

    it('renders No Entries card with no search reults', async () => {
        renderLocks('/locks?tab=search&search=asdfgh')
        expect(screen.getByRole('button', {name: 'View all locks'})).toBeInTheDocument()
    })

    it('updates tab when the user changes belt tab in the UI', async () => {
        const user = userEvent.setup()
        renderLocks('/locks?tab=White')
        await screen.findByRole('tab', {name: /white/i})
        const blueTab = screen.getByRole('tab', {name: /blue/i})
        await user.click(blueTab)
        expect(blueTab).toHaveAttribute('aria-selected', 'true')
        expect(screen.getByRole('listitem', {name: 'Any SFIC format lock (**)'})).toBeInTheDocument()
    })

    it('sorts by user selection in the UI', async () => {
        const user = userEvent.setup()
        renderLocks('/locks?tab=search')
        const viewMenu = await screen.findByRole('button', {name: 'View Options'})
        const list = await screen.findByRole('list', {name: 'Locks'})

        const expectFirstEntry = async (name) => {
            await waitFor(() => expect(list.firstElementChild).toHaveAccessibleName(name))
        }

        await user.click(viewMenu)
        let menu = await screen.findByRole('menu', {name: 'View and Sort Options'})
        await user.click(within(menu).getByRole('menuitem', {name: 'Alphabetical (Ascending)'}))
        await expectFirstEntry('A.S.I. Inc. Royal Guardian')

        await user.click(viewMenu)
        menu = await screen.findByRole('menu', {name: 'View and Sort Options'})
        await user.click(within(menu).getByRole('menuitem', {name: 'Alphabetical (Descending)'}))
        await expectFirstEntry(/^Zeta Padlock/)

        await user.click(viewMenu)
        menu = await screen.findByRole('menu', {name: 'View and Sort Options'})
        await user.click(within(menu).getByRole('menuitem', {name: 'Belt (Ascending)'}))
        await expectFirstEntry('Any Acrylic Padlock')
    })

    it('renders lock details', async () => {
        const user = userEvent.setup()
        renderLocks('/locks')
        const list = await screen.findByRole('list', {name: 'Locks'})
        expect(within(list).getByRole('listitem', {name: 'Any Acrylic Padlock'})).toBeInTheDocument()
        const firstListItem = within(list).getAllByRole('listitem')[0]
        const summary = within(firstListItem).getByRole('button')
        await user.click(summary)
        expect(summary).toHaveAttribute('aria-expanded', 'true')
        expect(await within(firstListItem).findByRole('img', {name: 'belt-icon'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Any Acrylic Padlock Various'})).toBeInTheDocument()
    })

})
