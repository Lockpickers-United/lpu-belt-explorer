import React, {useCallback, useContext, useMemo} from 'react'
import AuthContext from './AuthContext.jsx'
import dayjs from 'dayjs'
import ClassificationContext from './classificationContextValue.js'
import modernVotes from '../data/classification-samples.json'
import classificationAdminActions from '../data/classification-samples-admin.json'
import classificationChangelogs from '../data/classification-samples-changelog.json'

const voteTime = vote => dayjs(vote.updatedAt ?? vote.createdAt).valueOf()
const newestFirst = (a, b) => voteTime(b) - voteTime(a)

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
const allAdminActions = classificationAdminActions
const allChangelogs = classificationChangelogs
const votesByEntry = groupByEntry(allVotes)
const actionsByEntry = groupByEntry(allAdminActions)

export function ClassificationProvider({children}) {
    const {user} = useContext(AuthContext)

    const getLatestMilestone = useCallback((entry) => {
        const publishDateValues = (actionsByEntry.get(entry.id) ?? [])
            .filter(action => ['Published', 'Settled'].includes(action.status))
            .map(action => dayjs(action.updatedAt).valueOf())
        const currentBeltDate = entry.belt !== 'Unranked' && entry.currentBeltDate
            ? dayjs(entry.currentBeltDate) : null
        const beltDateValue = currentBeltDate?.isValid() ? currentBeltDate.valueOf() : 0
        return dayjs(Math.max(0, ...publishDateValues, beltDateValue))
    }, [])

    const getAdminAction = useCallback((entry) => {
        if (entry.adminActionId) return allAdminActions.find(action => action.id === entry.adminActionId)
        const milestone = getLatestMilestone(entry).valueOf()
        return (actionsByEntry.get(entry?.id) ?? [])
            .find(action => dayjs(action.updatedAt).valueOf() >= milestone) ?? null
    }, [getLatestMilestone])

    const loggedInUserVotes = useMemo(() => {
        return allVotes
            .filter(vote => vote.userId === user?.uid)
            .sort(newestFirst)
    }, [user?.uid])

    const getCurrentVotes = useCallback((entry) => {
        const reopened = getAdminAction(entry)?.status === 'Re-opened'
        const milestone = getLatestMilestone(entry).valueOf()
        return (votesByEntry.get(entry.id) ?? [])
            .filter(vote => vote.type === 'vote' &&
                (reopened || voteTime(vote) >= milestone))
    }, [getAdminAction, getLatestMilestone])

    const getPreviousVotes = useCallback((entry) => {
        if (getAdminAction(entry)?.status === 'Re-opened') return []
        const milestone = getLatestMilestone(entry).valueOf()
        return (votesByEntry.get(entry.id) ?? [])
            .filter(vote => vote.type === 'vote' && voteTime(vote) < milestone)
    }, [getAdminAction, getLatestMilestone])

    const getUserVote = useCallback((entry) => {
        if (!user?.uid) return null
        return getCurrentVotes(entry).find(vote => vote.userId === user.uid) ?? null
    }, [getCurrentVotes, user?.uid])

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
        isActive,
        previousChangelogs: allChangelogs
            .filter(log => log.changes.length > 0)
            .sort((a, b) => dayjs(b.lastPublishedAt).valueOf() - dayjs(a.lastPublishedAt))
    }), [loggedInUserVotes, getUserVote, getAdminAction, getLatestMilestone, getAdminActionStatus, getCurrentVotes, getPreviousVotes, isActive])

    return (
        <ClassificationContext.Provider value={value}>
            {children}
        </ClassificationContext.Provider>
    )
}

export default ClassificationContext
