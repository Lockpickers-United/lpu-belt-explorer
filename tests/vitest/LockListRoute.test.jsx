import React from 'react'
import { expect, it } from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithRouter} from '../../src/test/render.jsx'
import LockListRoute from '../../src/locks/LockListRoute.jsx'
import {lockFilterFields} from '../../src/data/filterFields'
import {FilterProvider} from '../../src/context/FilterContext.jsx'

it('renders Lock List page', async () => {
    renderWithRouter(
        <FilterProvider filterFields={lockFilterFields}>
            <LockListRoute/>
        </FilterProvider>
    )
    expect(screen.getByRole('button', {name: 'Any Acrylic Padlock Various'})).toBeInTheDocument()
})

it('renders Lock List with filter', async () => {
    renderWithRouter(
        <FilterProvider filterFields={lockFilterFields}>
            <LockListRoute/>
        </FilterProvider>,
        { route: '/locks?tab=White&makes=Master+Lock' }
    )
    expect(screen.getByRole('button', {name: 'Master Lock #1 Pin-tumbler'})).toBeInTheDocument()
})

it('renders Lock List with search', async () => {
    renderWithRouter(
        <FilterProvider filterFields={lockFilterFields}>
            <LockListRoute/>
        </FilterProvider>,
        { route: '/locks?tab=search&search=v18' }
    )
    expect(screen.getByRole('button', {name: 'GOAL V18 GOAL GP <14 pins Dimple'})).toBeInTheDocument()
})
