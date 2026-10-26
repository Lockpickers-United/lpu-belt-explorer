import React from 'react'
import { expect, it, describe } from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithRouter} from '../../src/test/render.jsx'
import SafelocksRoute from '../../src/safelocks/SafelocksRoute.jsx'

describe('SafelocksRoute', () => {
  it('renders Safe Locks page', async () => {
    renderWithRouter(<SafelocksRoute/>)
    expect(screen.getByRole('button', {name: 'AMSEC STAR C3 Group 2'})).toBeInTheDocument()
  })

  it('renders with query params in URL', async () => {
    renderWithRouter(<SafelocksRoute/>, { route: '/safelocks?group=2&make=AMSEC' })
    expect(screen.getByRole('button', {name: 'AMSEC STAR C3 Group 2'})).toBeInTheDocument()
  })

  it('shows NoEntriesCard when filters exclude all results', async () => {
    renderWithRouter(<SafelocksRoute/>, { route: '/safelocks?make=ThisMakeShouldNotExist123' })
    expect(await screen.findByText(/No matching Safe Locks were found/i)).toBeInTheDocument()
  })

  it('displays Export button when entries are visible', async () => {
    renderWithRouter(<SafelocksRoute/>)
    expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument()
  })
})

