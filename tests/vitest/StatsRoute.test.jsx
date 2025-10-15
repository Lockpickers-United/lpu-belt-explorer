import React from 'react'
import { expect, it, describe } from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithRouter} from '../../src/test/render.jsx'
import StatsRoute from '../../src/stats/StatsRoute.jsx'
import ScorecardExploreRoute from '../../src/scorecard/explore/ScorecardExploreRoute.jsx'

describe('Stats Pages', () => {
  it('renders Stats page after loading', async () => {
    renderWithRouter(<StatsRoute/>)
    expect(await screen.findByRole('heading', {name: 'Stats & Insights'})).toBeInTheDocument()
    expect(await screen.findByRole('heading', {name: 'Site Stats'})).toBeInTheDocument()
  })

  it('renders Additional Stats page after loading', async () => {
    renderWithRouter(<ScorecardExploreRoute/>)
    expect(await screen.findByRole('heading', {name: 'Explore Scorecard'})).toBeInTheDocument()
    expect(await screen.findByRole('heading', {name: 'User Belt Flows'})).toBeInTheDocument()
    expect(await screen.findByRole('heading', {name: 'Scorecard Locks'})).toBeInTheDocument()
      //TODO: update page to use list/listitem roles
  })

})

