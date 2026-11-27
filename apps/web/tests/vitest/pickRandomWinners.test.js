import {afterEach, describe, expect, it, vi} from 'vitest'
import {pickRandomWinners} from '../../src/rafl/admin/pickRandomWinners.js'

afterEach(() => vi.restoreAllMocks())

describe('pickRandomWinners', () => {
    it('draws unique winners without ticket weighting or changing the entrants', () => {
        const entrants = [{id: 'a', potTickets: 100}, {id: 'b', potTickets: 0}, {id: 'c'}]
        const original = entrants.slice()
        vi.spyOn(Math, 'random').mockReturnValueOnce(0.5).mockReturnValueOnce(0.99)

        expect(pickRandomWinners(entrants, 2)).toEqual([entrants[1], entrants[2]])
        expect(entrants).toEqual(original)
    })

    it('returns every entrant once when count exceeds the pool size', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0)

        expect(pickRandomWinners(['a', 'b', 'c'], 5)).toEqual(['a', 'b', 'c'])
    })

    it('defaults to one winner', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0)

        expect(pickRandomWinners(['a', 'b'])).toEqual(['a'])
    })

    it('returns no winners for an empty pool or nonpositive count', () => {
        expect(pickRandomWinners()).toEqual([])
        expect(pickRandomWinners(null)).toEqual([])
        expect(pickRandomWinners(['a'], 0)).toEqual([])
        expect(pickRandomWinners(['a'], -1)).toEqual([])
    })
})
