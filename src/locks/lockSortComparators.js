import dayjs from 'dayjs'
import {beltSort, beltSortReverse} from '../data/belts'

export const lockSortComparators = Object.freeze({
    popularity: (a, b) => {
        return b.popularityIndex - a.popularityIndex
            || a.fuzzy.localeCompare(b.fuzzy)
    },
    scorecardCount: (a, b) => {
        return b.scorecardCount - a.scorecardCount
            || a.fuzzy.localeCompare(b.fuzzy)
    },
    beltAscending: (a, b) => beltSort(a.belt, b.belt),
    beltDescending: (a, b) => {
        return beltSortReverse(a.belt, b.belt)
            || a.fuzzy.localeCompare(b.fuzzy)
    },
    alphaAscending: (a, b) => a.fuzzy.localeCompare(b.fuzzy),
    alphaDescending: (a, b) => b.fuzzy.localeCompare(a.fuzzy),
    recentlyUpdated: (a, b) => {
        return Math.floor(dayjs(b.lastUpdated).valueOf() / 3600) - Math.floor(dayjs(a.lastUpdated).valueOf() / 3600)
            || beltSort(a.belt, b.belt)
            || a.fuzzy.localeCompare(b.fuzzy)
    },
    dateAdded: (a, b) => {
        return Math.floor(dayjs(b.dateAdded).valueOf() / 3600 * 24) - Math.floor(dayjs(a.dateAdded).valueOf() / 3600 * 24)
            || beltSort(a.belt, b.belt)
            || a.fuzzy.localeCompare(b.fuzzy)
    },
    voteCount: (a, b) => {
        return b.voteCount - a.voteCount
            || a.fuzzy.localeCompare(b.fuzzy)
    },
    highestVoteBelt: (a, b) => {
        return beltSortReverse(a.highestVoteBelt, b.highestVoteBelt)
            || a.fuzzy.localeCompare(b.fuzzy)
    },
    latestVoteDate: (a, b) => {
        const firstDate = a.latestVoteDate ?? null
        const secondDate = b.latestVoteDate ?? null
        if (firstDate === null && secondDate === null) return a.fuzzy.localeCompare(b.fuzzy)
        if (firstDate === null) return 1
        if (secondDate === null) return -1
        return secondDate - firstDate || a.fuzzy.localeCompare(b.fuzzy)
    },
})

export function getLockSortComparator(sort) {
    return lockSortComparators[sort] || (() => 0)
}
