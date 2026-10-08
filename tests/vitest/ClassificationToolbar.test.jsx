import React from 'react'
import {describe, expect, it} from 'vitest'
import {screen} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {renderWithRouter} from '../../src/test/render.jsx'
import ClassificationToolbar from '../../src/classification/ClassificationToolbar.jsx'

describe('ClassificationToolbar', () => {
    it('selects the changelog tab by route and updates selection after navigation', async () => {
        const user = userEvent.setup()
        renderWithRouter(<ClassificationToolbar/>, {route: '/classification/changelog'})

        expect(screen.getAllByRole('tab')).toHaveLength(3)
        expect(screen.getByRole('tab', {name: /Publish Changelog|Changelogs/}))
            .toHaveAttribute('aria-selected', 'true')

        await user.click(screen.getByRole('tab', {name: /Current Changes|Current/}))

        expect(screen.getByRole('tab', {name: /Current Changes|Current/}))
            .toHaveAttribute('aria-selected', 'true')
    })
})
