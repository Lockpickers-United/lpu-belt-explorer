import React from 'react'
import {fireEvent, screen} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import UserMenu from '../../src/nav/UserMenu.jsx'
import {renderWithRouter} from '../../src/test/render.jsx'

describe('UserMenu access controls', () => {
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
})
