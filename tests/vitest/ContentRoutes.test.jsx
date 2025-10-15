import React from 'react'
import {expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import { logRoles } from '@testing-library/dom' // eslint-disable-line no-unused-vars

import {renderWithRouter} from '../../src/test/render.jsx'
import InfoRoute from '../../src/info/InfoRoute.jsx'
import ProjectsRoute from '../../src/info/ProjectsRoute.jsx'
import DansRoute from '../../src/info/DansRoute.jsx'
import AboutRoute from '../../src/about/AboutRoute.jsx'

it('renders InfoRoute', async () => {
    renderWithRouter(<InfoRoute/>)
    expect(screen.getByRole('heading', {name: 'Earn Lockpicking Karate Flair'})).toBeInTheDocument()
    //logRoles(document.body)
})

it('renders ProjectsRoute', async () => {
    renderWithRouter(<ProjectsRoute/>)
    expect(screen.getByRole('heading', {name: 'Tier levels'})).toBeInTheDocument()
})

it('renders DansRoute', async () => {
    renderWithRouter(<DansRoute/>)
    expect(screen.getByRole('heading', {name: 'Preamble:'})).toBeInTheDocument()
})

it('renders AboutRoute', async () => {
    renderWithRouter(<AboutRoute/>)
    expect(screen.getByRole('heading', {name: 'Introduction to the Belt Ranking System'})).toBeInTheDocument()
})
