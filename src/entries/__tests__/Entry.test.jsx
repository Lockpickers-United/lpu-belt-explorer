import React from 'react'
import {vi, test, describe, expect} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import DataContext from '../../context/DataContext.jsx'

// Stub child components that are not under test and may rely on heavy MUI or context
vi.mock('../BeltStripe', () => ({default: () => <div data-testid="belt-stripe" />}))
vi.mock('../CollectionButton', () => ({default: () => <button>Collect</button>}))
vi.mock('../DanPoints', () => ({default: ({belt}) => <span data-testid="dan-points">{belt}</span>}))
vi.mock('../FieldValue', () => ({default: ({name, value, children, ...rest}) => (
  <div data-testid={name ? `field-${name.toLowerCase().replace(/\s+/g,'-')}` : 'field-unnamed'}>
    {name && <span>{name}</span>}
    {value ?? children}
  </div>
)}))
vi.mock('../BeltIcon', () => ({default: () => <div data-testid="belt-icon" />}))
vi.mock('../filters/FilterChip', () => ({default: ({value}) => <span>{value}</span>}))
vi.mock('./CopyLinkToEntryButton', () => ({default: () => <button>Copy Link</button>}))
vi.mock('@mui/material/Accordion', () => ({
  default: ({children, expanded, onChange, ...props}) => {
    const React = require('react')
    const clickState = React.useRef(false)
    return (
      <div
        data-testid="accordion"
        aria-expanded={expanded}
        onClick={(e) => {
          clickState.current = !clickState.current
          onChange?.(e, clickState.current)
        }}
        {...props}
      >
        {children}
      </div>
    )
  }
}))
vi.mock('@mui/material/AccordionSummary', () => ({default: ({children}) => (
  <div role="button" aria-label="summary">{children}</div>
)}))
vi.mock('@mui/material/AccordionDetails', () => ({default: ({children}) => <div>{children}</div>}))
vi.mock('@mui/material/AccordionActions', () => ({default: ({children}) => <div>{children}</div>}))
vi.mock('@mui/material/Button', () => ({default: ({children}) => <button>{children}</button>}))
vi.mock('./CopyEntryTextButton', () => ({default: () => <button>Copy Text</button>}))
vi.mock('../app/Tracker', () => ({default: () => <div data-testid="tracker"/>}))
vi.mock('./LockImageGallery', () => ({default: () => <div>Gallery</div>}))
vi.mock('./RelatedEntryButton', () => ({default: ({id}) => <button>Related {id}</button>}))
vi.mock('./entryutils', () => ({
  upgradeTree: (id) => [id],
  allEntriesById: {}
}))
vi.mock('../data/belts', () => ({beltSort: () => 0}))
vi.mock('../CopyEntryIdButton.jsx', () => ({default: () => <button>Copy ID</button>}))
vi.mock('../OpenLinkToEntryButton.jsx', () => ({default: () => <button>Open</button>}))
vi.mock('../OpenLinkToLockbazaarButton.jsx', () => ({default: () => <button>For sale</button>}))

function renderEntry(uiProps) {
  const defaultEntry = {
    id: 'e1',
    belt: 'White',
    makeModels: [{make: 'ACME', model: 'Lock 1000'}],
    lockingMechanisms: ['Pin-tumbler'],
    version: 'v1',
    notes: 'Some note',
    features: ['Shackled'],
    description: 'Desc',
    links: [{title: 'Site', url: 'https://example.com'}],
    media: []
  }
  const entry = {...defaultEntry, ...(uiProps?.entry || {})}
  const expanded = uiProps?.expanded ?? false
  const onExpand = uiProps?.onExpand ?? vi.fn()

  const expandAll = uiProps?.expandAll ?? false

  const Wrapper = ({children}) => (
    <MemoryRouter>
      <DataContext.Provider value={{expandAll}}>
        {children}
      </DataContext.Provider>
    </MemoryRouter>
  )

  const utils = render(<Wrapper><Entry entry={entry} expanded={expanded} onExpand={onExpand} /></Wrapper>)
  return {entry, expanded, onExpand, expandAll, ...utils}
}

import Entry from '../Entry'

describe('Entry component', () => {
  test('renders make/model and Version in summary', () => {
    renderEntry({expanded: false})
    expect(screen.getByText('ACME Lock 1000')).toBeInTheDocument()
    expect(screen.getByText('Version')).toBeInTheDocument()
    expect(screen.getByText('v1')).toBeInTheDocument()
  })

  test('when expanded shows details like Features', () => {
    renderEntry({expanded: true})
    // Feature chip text rendered in details
    expect(screen.getByText('Shackled')).toBeInTheDocument()
  })

  test('calls onExpand with id when expanding and false when collapsing', async () => {
    const onExpand = vi.fn()

    renderEntry({expanded: false, onExpand})

    const accordion = screen.getByTestId('accordion')

    // Click accordion (our mock toggles expanded and invokes onChange with the next state)
    fireEvent.click(accordion)
    expect(onExpand).toHaveBeenCalledWith('e1')

    // Click again to collapse
    fireEvent.click(accordion)
    expect(onExpand).toHaveBeenCalledWith(false)
  })
})
