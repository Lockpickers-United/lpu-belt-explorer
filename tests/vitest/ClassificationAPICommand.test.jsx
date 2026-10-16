import React, {useContext} from 'react'
import axios from 'axios'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {screen, waitFor} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import {APIProvider} from '../../src/app/APIContext.jsx'
import APIContext from '../../src/app/APIContext.jsx'
import {renderWithProviders} from '../../src/test/render.jsx'

vi.mock('axios', () => ({default: vi.fn()}))

function CommandProbe() {
    const {classificationCommand} = useContext(APIContext)
    return <button onClick={() => classificationCommand('delete', 'votes/vote-a',
        {expectedRevision: 2}, 'retry-key-123')}>Delete vote</button>
}

describe('classification API command', () => {
    beforeEach(() => vi.clearAllMocks())

    it('sends the current bearer token, request body, and stable retry key', async () => {
        const getIdToken = vi.fn(async () => 'synthetic-token')
        vi.mocked(axios).mockResolvedValue({data: {data: {id: 'vote-a'}}})
        renderWithProviders(<APIProvider><CommandProbe/></APIProvider>, {
            auth: {user: {uid: 'owner', getIdToken}}
        })

        await userEvent.setup().click(screen.getByRole('button', {name: 'Delete vote'}))
        await waitFor(() => expect(axios).toHaveBeenCalledOnce())
        expect(getIdToken).toHaveBeenCalledOnce()
        expect(vi.mocked(axios).mock.calls[0][0]).toMatchObject({
            method: 'delete', data: {expectedRevision: 2},
            headers: {Authorization: 'Bearer synthetic-token', 'Idempotency-Key': 'retry-key-123'}
        })
        expect(vi.mocked(axios).mock.calls[0][0].url).toMatch(/\/api\/v1\/classification\/votes\/vote-a$/)
    })
})
