import {describe, expect, it} from 'vitest'
import {getLockSortComparator, lockSortComparators} from '../../src/locks/lockSortComparators'

const entry = (overrides = {}) => ({
    fuzzy: 'Alpha',
    belt: 'White',
    popularityIndex: 0,
    scorecardCount: 0,
    lastUpdated: '2024-01-01T00:00:00.000Z',
    dateAdded: '2024-01-01T00:00:00.000Z',
    ...overrides
})

const sortedValues = (sort, entries, field = 'fuzzy') => {
    return [...entries].sort(getLockSortComparator(sort)).map(item => item[field])
}

describe('lockSortComparators', () => {
    it('sorts popularity descending and breaks ties alphabetically', () => {
        const entries = [
            entry({fuzzy: 'Zulu', popularityIndex: 5}),
            entry({fuzzy: 'Beta', popularityIndex: 10}),
            entry({fuzzy: 'Alpha', popularityIndex: 10})
        ]

        expect(sortedValues('popularity', entries)).toEqual(['Alpha', 'Beta', 'Zulu'])
    })

    it('sorts scorecard count descending and breaks ties alphabetically', () => {
        const entries = [
            entry({fuzzy: 'Zulu', scorecardCount: 2}),
            entry({fuzzy: 'Beta', scorecardCount: 8}),
            entry({fuzzy: 'Alpha', scorecardCount: 8})
        ]

        expect(sortedValues('scorecardCount', entries)).toEqual(['Alpha', 'Beta', 'Zulu'])
    })

    it('sorts belts in ascending rank order', () => {
        const entries = [
            entry({fuzzy: 'Purple entry', belt: 'Purple'}),
            entry({fuzzy: 'White entry', belt: 'White'}),
            entry({fuzzy: 'Blue entry', belt: 'Blue'})
        ]

        expect(sortedValues('beltAscending', entries)).toEqual(['White entry', 'Blue entry', 'Purple entry'])
    })

    it('sorts belts in descending rank order and breaks belt ties alphabetically', () => {
        const entries = [
            entry({fuzzy: 'Zulu', belt: 'Blue'}),
            entry({fuzzy: 'White entry', belt: 'White'}),
            entry({fuzzy: 'Alpha', belt: 'Blue'}),
            entry({fuzzy: 'Purple entry', belt: 'Purple'})
        ]

        expect(sortedValues('beltDescending', entries)).toEqual([
            'Purple entry',
            'Alpha',
            'Zulu',
            'White entry'
        ])
    })

    it.each([
        ['alphaAscending', ['Alpha', 'Beta', 'Zulu']],
        ['alphaDescending', ['Zulu', 'Beta', 'Alpha']]
    ])('sorts entries with %s', (sort, expected) => {
        const entries = [entry({fuzzy: 'Beta'}), entry({fuzzy: 'Zulu'}), entry({fuzzy: 'Alpha'})]

        expect(sortedValues(sort, entries)).toEqual(expected)
    })

    it('sorts recently updated entries newest first, then by belt and name', () => {
        const entries = [
            entry({fuzzy: 'Zulu', belt: 'Blue'}),
            entry({fuzzy: 'Beta', belt: 'White'}),
            entry({fuzzy: 'Alpha', belt: 'White'}),
            entry({fuzzy: 'Newest', belt: 'Purple', lastUpdated: '2024-02-01T00:00:00.000Z'})
        ]

        expect(sortedValues('recentlyUpdated', entries)).toEqual(['Newest', 'Alpha', 'Beta', 'Zulu'])
    })

    it('sorts newly added entries newest first, then by belt and name', () => {
        const entries = [
            entry({fuzzy: 'Zulu', belt: 'Blue'}),
            entry({fuzzy: 'Beta', belt: 'White'}),
            entry({fuzzy: 'Alpha', belt: 'White'}),
            entry({fuzzy: 'Newest', belt: 'Purple', dateAdded: '2024-02-01T00:00:00.000Z'})
        ]

        expect(sortedValues('dateAdded', entries)).toEqual(['Newest', 'Alpha', 'Beta', 'Zulu'])
    })

    it('exposes a comparator for every supported sort and preserves order for unknown sorts', () => {
        expect(Object.keys(lockSortComparators)).toEqual([
            'popularity',
            'scorecardCount',
            'beltAscending',
            'beltDescending',
            'alphaAscending',
            'alphaDescending',
            'recentlyUpdated',
            'dateAdded'
        ])

        const entries = [entry({fuzzy: 'Zulu'}), entry({fuzzy: 'Alpha'})]
        expect(sortedValues('unsupported', entries)).toEqual(['Zulu', 'Alpha'])
    })
})
