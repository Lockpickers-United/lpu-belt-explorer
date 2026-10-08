import React, {useCallback, useContext, useMemo, useSyncExternalStore} from 'react'
import classificationVotes from '../data/classification-samples.json'
import classificationAdminActions from '../data/classification-samples-admin.json'
import dayjs from 'dayjs'
import AuthContext from './AuthContext.jsx'

const ClassificationContext = React.createContext({})
const newestFirst = (a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf()

function groupByEntry(records) {
    const grouped = new Map()
    records.forEach(record => {
        const entryRecords = grouped.get(record.entryId) ?? []
        entryRecords.push(record)
        grouped.set(record.entryId, entryRecords)
    })
    grouped.forEach(entryRecords => entryRecords.sort(newestFirst))
    return grouped
}

let historicalVotesByEntry = null
let historicalVotesPromise
const historicalVoteListeners = new Set()

function subscribeToHistoricalVotes(listener) {
    historicalVoteListeners.add(listener)
    return () => historicalVoteListeners.delete(listener)
}

function getHistoricalVotesSnapshot() {
    return historicalVotesByEntry
}

function loadHistoricalVotes() {
    if (!historicalVotesPromise) {
        historicalVotesPromise = import('../data/classification-votes-historical.json')
            .then(({default: votes}) => {
                historicalVotesByEntry = groupByEntry(votes)
                historicalVoteListeners.forEach(listener => listener())
                return votes
            })
            .catch(error => {
                historicalVotesPromise = null
                throw error
            })
    }
    return historicalVotesPromise
}

export function ClassificationProvider({children}) {
    const {user} = useContext(AuthContext)

    const allVotes = useMemo(() => classificationVotes || [], [])
    const allAdminActions = useMemo(() => classificationAdminActions || [], [])
    const votesByEntry = useMemo(() => groupByEntry(allVotes), [allVotes])
    const actionsByEntry = useMemo(() => groupByEntry(allAdminActions), [allAdminActions])
    const historicalVotes = useSyncExternalStore(
        subscribeToHistoricalVotes,
        getHistoricalVotesSnapshot,
        getHistoricalVotesSnapshot
    )
    const historicalVotesLoaded = historicalVotes !== null
    const getHistoricalVotes = useCallback((entryId) => {
        return historicalVotes?.get(entryId) ?? []
    }, [historicalVotes])

    const getLatestMilestone = useCallback((entry) => {
        const publishDateValues = (actionsByEntry.get(entry.id) ?? [])
            .filter(action => action.status === 'Published')
            .map(action => dayjs(action.updatedAt).valueOf())
        const currentBeltDate = entry.currentBeltDate ? dayjs(entry.currentBeltDate) : null
        const beltDateValue = currentBeltDate?.isValid() ? currentBeltDate.valueOf() : 0
        return dayjs(Math.max(0, ...publishDateValues, beltDateValue))
    }, [actionsByEntry])

    const getAdminAction = useCallback((entry) => {
        const milestone = getLatestMilestone(entry).valueOf()
        return (actionsByEntry.get(entry.id) ?? [])
            .find(action => dayjs(action.updatedAt).valueOf() >= milestone) ?? null
    }, [actionsByEntry, getLatestMilestone])

    const loggedInUserVotes = useMemo(() => {
        return allVotes
            .filter(vote => vote.userId === user?.uid)
            .sort(newestFirst)
    }, [allVotes, user?.uid])

    const getCurrentVotes = useCallback((entry) => {
        const milestone = getLatestMilestone(entry).valueOf()
        return (votesByEntry.get(entry.id) ?? [])
            .filter(vote => dayjs(vote.updatedAt).valueOf() >= milestone)
    }, [votesByEntry, getLatestMilestone])

    const getPreviousVotes = useCallback((entry) => {
        const milestone = getLatestMilestone(entry).valueOf()
        return (votesByEntry.get(entry.id) ?? [])
            .filter(vote => dayjs(vote.updatedAt).valueOf() < milestone)
    }, [votesByEntry, getLatestMilestone])

    const getUserVote = useCallback((entry) => {
        if (!user?.uid) return null
        const milestone = getLatestMilestone(entry).valueOf()
        return (votesByEntry.get(entry.id) ?? [])
            .find(vote => vote.userId === user.uid && dayjs(vote.updatedAt).valueOf() >= milestone) ?? null
    }, [getLatestMilestone, user?.uid, votesByEntry])

    const getAdminActionStatus = useCallback((entry) => {
        const action = getAdminAction(entry)
        const votes = getCurrentVotes(entry)
        return action?.status
            ? action?.status
            : votes?.length > 0
                ? 'Has Votes'
                : 'No Votes'
    }, [getCurrentVotes, getAdminAction])

    const isActive = useCallback((entry) => {
        return entry.belt === 'Unranked' ||
            ['Re-opened', 'Pending', 'Staged', 'Has Votes'].includes(getAdminActionStatus(entry))
    }, [getAdminActionStatus])


    const value = useMemo(() => ({
        allVotes,
        allAdminActions,
        loggedInUserVotes,
        getUserVote,
        getAdminAction,
        getLatestMilestone,
        getAdminActionStatus,
        getCurrentVotes,
        getPreviousVotes,
        getHistoricalVotes,
        loadHistoricalVotes,
        historicalVotesLoaded,
        isActive
    }), [allVotes, allAdminActions, loggedInUserVotes, getUserVote, getAdminAction, getLatestMilestone, getAdminActionStatus, getCurrentVotes, getPreviousVotes, getHistoricalVotes, historicalVotesLoaded, isActive])

    return (
        <ClassificationContext.Provider value={value}>
            {children}
        </ClassificationContext.Provider>
    )
}

export default ClassificationContext
