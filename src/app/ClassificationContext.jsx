import React, {useCallback, useContext, useMemo} from 'react'
import modernVotes from '../data/classification-samples.json'
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

const allVotes = modernVotes
const allAdminActions = classificationAdminActions || []
const votesByEntry = groupByEntry(allVotes)
const actionsByEntry = groupByEntry(allAdminActions)

export function ClassificationProvider({children}) {
    const {user} = useContext(AuthContext)

    const getLatestMilestone = useCallback((entry) => {
        const publishDateValues = (actionsByEntry.get(entry.id) ?? [])
            .filter(action => action.status === 'Published')
            .map(action => dayjs(action.updatedAt).valueOf())
        const currentBeltDate = entry.currentBeltDate ? dayjs(entry.currentBeltDate) : null
        const beltDateValue = currentBeltDate?.isValid() ? currentBeltDate.valueOf() : 0
        return dayjs(Math.max(0, ...publishDateValues, beltDateValue))
    }, [])

    const getAdminAction = useCallback((entry) => {
        const milestone = getLatestMilestone(entry).valueOf()
        return (actionsByEntry.get(entry.id) ?? [])
            .find(action => dayjs(action.updatedAt).valueOf() >= milestone) ?? null
    }, [getLatestMilestone])

    const loggedInUserVotes = useMemo(() => {
        return allVotes
            .filter(vote => vote.userId === user?.uid)
            .sort(newestFirst)
    }, [user?.uid])

    const getCurrentVotes = useCallback((entry) => {
        const milestone = getLatestMilestone(entry).valueOf()
        return (votesByEntry.get(entry.id) ?? [])
            .filter(vote => dayjs(vote.updatedAt).valueOf() >= milestone && vote.type === 'vote')
    }, [getLatestMilestone])

    const getPreviousVotes = useCallback((entry) => {
        const milestone = getLatestMilestone(entry).valueOf()
        return (votesByEntry.get(entry.id) ?? [])
            .filter(vote => vote.type === 'vote' && dayjs(vote.updatedAt).valueOf() < milestone)
    }, [getLatestMilestone])

    const getUserVote = useCallback((entry) => {
        if (!user?.uid) return null
        const milestone = getLatestMilestone(entry).valueOf()
        return (votesByEntry.get(entry.id) ?? [])
            .find(vote => vote.type === 'vote' && vote.userId === user.uid &&
                dayjs(vote.updatedAt).valueOf() >= milestone) ?? null
    }, [getLatestMilestone, user?.uid])

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
            ['Re-opened', 'Pending', 'Staged'].includes(getAdminAction(entry)?.status)
    }, [getAdminAction])

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
        isActive
    }), [loggedInUserVotes, getUserVote, getAdminAction, getLatestMilestone, getAdminActionStatus, getCurrentVotes, getPreviousVotes, isActive])

    return (
        <ClassificationContext.Provider value={value}>
            {children}
        </ClassificationContext.Provider>
    )
}

export default ClassificationContext
