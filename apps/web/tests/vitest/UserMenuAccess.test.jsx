import React from 'react'
import {fireEvent, screen} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import UserMenu from '../../src/nav/UserMenu.jsx'
import {renderWithRouter} from '../../src/test/render.jsx'

describe('UserMenu access controls', () => {
    afterEach(() => vi.unstubAllEnvs())

    it('toggles QA mode with the canonical role key', () => {
        const toggleRoleEnabled = vi.fn()
        renderWithRouter(<UserMenu/>, {
            auth: {
                isLoggedIn: true,
                user: {uid: 'qa-user', photoURL: ''},
                userClaims: ['qaUser'],
                logout: vi.fn()
            },
            db: {
                lockCollection: {displayName: 'QA User'}
            },
            access: {
                accessInfo: {
                    roles: {admin: false, lpuMod: false, qaUser: true},
                    enabledRoles: {admin: false, lpuMod: false, qaUser: false},
                    level: 20,
                    enabledLevel: 0,
                    activeRole: null
                },
                toggleRoleEnabled
            }
        })

        fireEvent.click(screen.getByRole('button', {name: 'QA User'}))
        fireEvent.click(screen.getByText('Enable QA Mode'))

        expect(toggleRoleEnabled).toHaveBeenCalledWith('qaUser')
    })

    it('labels an active QA role as enabled', () => {
        renderWithRouter(<UserMenu/>, {
            auth: {
                isLoggedIn: true,
                user: {uid: 'qa-user', photoURL: ''},
                userClaims: ['qaUser'],
                logout: vi.fn()
            },
            db: {
                lockCollection: {displayName: 'QA User'}
            },
            access: {
                accessInfo: {
                    roles: {admin: false, lpuMod: false, qaUser: true},
                    enabledRoles: {admin: false, lpuMod: false, qaUser: true},
                    level: 20,
                    enabledLevel: 20,
                    activeRole: 'qaUser'
                },
                toggleRoleEnabled: vi.fn()
            }
        })

        fireEvent.click(screen.getByRole('button', {name: 'QA User'}))

        expect(screen.getByText('Disable QA Mode')).toBeInTheDocument()
    })

    it('offers a development preview for the account\'s available roles', () => {
        vi.stubEnv('DEV', true)
        const setAccessPreview = vi.fn()
        renderWithRouter(<UserMenu/>, {
            auth: {
                isLoggedIn: true,
                user: {uid: 'admin-user', photoURL: ''},
                userClaims: ['admin'],
                logout: vi.fn()
            },
            db: {lockCollection: {displayName: 'Admin User'}},
            access: {
                accessInfo: {
                    roles: {admin: true, qaUser: true},
                    enabledRoles: {admin: false, qaUser: false},
                    level: 100,
                    enabledLevel: 0,
                    activeRole: null,
                    previewRole: 'none',
                    availablePreviewRoles: ['admin', 'blackBelt', 'qaUser']
                },
                setAccessPreview
            }
        })

        fireEvent.click(screen.getByRole('button', {name: 'Admin User (preview: None)'}))
        const previewMenuItem = screen.getByText('UI Role Preview').closest('[role="menuitem"]')
        fireEvent.click(screen.getByRole('button', {name: 'Show Details'}))
        expect(previewMenuItem).toHaveAttribute('aria-expanded', 'true')
        fireEvent.click(screen.getByText('Actual access'))
        fireEvent.click(screen.getByText('QA User'))
        fireEvent.click(screen.getByText('Black Belt'))

        expect(setAccessPreview).toHaveBeenNthCalledWith(1, null)
        expect(setAccessPreview).toHaveBeenNthCalledWith(2, 'qaUser')
        expect(setAccessPreview).toHaveBeenNthCalledWith(3, 'blackBelt')
        expect(screen.queryByText('LPU Moderator')).not.toBeInTheDocument()
    })
})
