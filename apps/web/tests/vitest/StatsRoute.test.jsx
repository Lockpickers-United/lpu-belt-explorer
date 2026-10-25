import React from 'react'
import { expect, it, describe, vi } from 'vitest'
import {screen} from '@testing-library/react'
import {renderWithRouter} from '../../src/test/render.jsx'
import StatsRoute from '../../src/stats/StatsRoute.jsx'
import ScorecardExploreRoute from '../../src/scorecard/explore/ScorecardExploreRoute.jsx'

vi.mock('../../src/util/useData.jsx', () => ({
  default: () => ({
    data: {scorecardStats: {lockCountsByUserBelt: {}}},
    loading: false,
    error: false,
    errorMessage: null
  })
}))

vi.mock('../../src/stats/StatsMainPage.jsx', () => ({
  default: () => <div role='heading'>Site Stats</div>
}))

vi.mock('../../src/scorecard/explore/ScorecardExplore.jsx', () => ({
  default: () => (
    <React.Fragment>
      <div role='heading'>User Belt Flows</div>
      <div role='heading'>Scorecard Locks</div>
    </React.Fragment>
  )
}))

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
