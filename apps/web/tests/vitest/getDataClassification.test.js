import {describe, expect, it, vi} from 'vitest'
import axios from 'axios'
import {getData} from '../../src/formUtils/getData.jsx'

vi.mock('axios', () => ({default: {get: vi.fn(async () => ({data: {data: {votes: []}}}))}}))

describe('classification API query parameters', () => {
    it('can omit the cache key rejected by strict server query validation', async () => {
        const user = {getIdToken: vi.fn(async () => 'synthetic-token')}
        await getData({
            user,
            url: 'http://localhost:3001/api/v1/classification/entries/lock-a/votes',
            json: {limit: 100},
            snackBars: false,
            cacheBust: false
        })
        expect(axios.get).toHaveBeenCalledWith(
            'http://localhost:3001/api/v1/classification/entries/lock-a/votes',
            expect.objectContaining({
                params: {limit: 100},
                headers: {Authorization: 'Bearer synthetic-token'}
            })
        )
    })
})
