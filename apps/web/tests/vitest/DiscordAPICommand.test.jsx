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
    const {startDiscordOAuth, exchangeDiscordOAuth, postDiscordBeltRequest} = useContext(APIContext)
    return <>
        <button onClick={() => startDiscordOAuth({purpose: 'import', nonce: 'a'.repeat(32),
            redirectUri: 'https://lpubelts.com/'})}>Start</button>
        <button onClick={() => exchangeDiscordOAuth({code: 'code', state: 'A'.repeat(43),
            nonce: 'a'.repeat(32)})}>Exchange</button>
        <button onClick={() => postDiscordBeltRequest({postingGrant: 'grant', request: {requestBelt: 'White Belt'}})}>
            Post
        </button>
    </>
}

describe('Discord API commands', () => {
    beforeEach(() => vi.clearAllMocks())

    it('sends start and exchange through the authenticated API', async () => {
        const getIdToken = vi.fn(async () => 'synthetic-token')
        vi.mocked(axios).mockResolvedValue({data: {data: {state: 'opaque-state'}}})
        renderWithProviders(<APIProvider><CommandProbe/></APIProvider>, {
            auth: {user: {uid: 'owner', getIdToken}}
        })

        await userEvent.setup().click(screen.getByRole('button', {name: 'Start'}))
        await userEvent.setup().click(screen.getByRole('button', {name: 'Exchange'}))
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post'}))
        await waitFor(() => expect(axios).toHaveBeenCalledTimes(3))
        expect(getIdToken).toHaveBeenCalledTimes(3)
        expect(vi.mocked(axios).mock.calls.map(([request]) => request.url)).toEqual([
            expect.stringMatching(/\/api\/v1\/discord\/oauth\/start$/),
            expect.stringMatching(/\/api\/v1\/discord\/oauth\/exchange$/),
            expect.stringMatching(/\/api\/v1\/belt-requests\/discord$/)
        ])
        for (const [request] of vi.mocked(axios).mock.calls) {
            expect(request).toMatchObject({method: 'post',
                headers: {Authorization: 'Bearer synthetic-token'}})
        }
        expect(vi.mocked(axios).mock.calls[1][0].data).toEqual({
            code: 'code', state: 'A'.repeat(43), nonce: 'a'.repeat(32)
        })
        expect(vi.mocked(axios).mock.calls[2][0].data).toEqual({
            postingGrant: 'grant', request: {requestBelt: 'White Belt'}
        })
    })
})
