import React from 'react'
import { expect, it, describe } from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithRouter} from '../../src/test/render.jsx'
import GlossaryRoute from '../../src/glossary/GlossaryRoute.jsx'

describe('GlossaryRoute', () => {
  it('renders Glossary page', async () => {
    renderWithRouter(<GlossaryRoute/>)
    expect(screen.getByRole('heading', {name: 'Glossary'})).toBeInTheDocument()
    expect(screen.getByRole('term', {name: 'A2P'})).toBeInTheDocument()
  })

})

