import React, {useCallback, useContext, useMemo} from 'react'
import classificationVotes from '../data/classification-samples.json'
import classificationAdminActions from '../data/classification-samples-admin.json'
import dayjs from 'dayjs'
import AuthContext from './AuthContext.jsx'

const ClassificationContext = React.createContext({})

export function ClassificationProvider({children}) {
    const {user} = useContext(AuthContext)

    const allVotes = useMemo(() => classificationVotes || [], [])
    const allAdminActions = useMemo(() => classificationAdminActions || [], [])

    const getLatestMilestone = useCallback((entry) => {
        const publishDateValues = allAdminActions
            .filter(action => action.entryId === entry.id && action.status === 'Published')
            .map(action => dayjs(action.updatedAt).valueOf())
        return dayjs(Math.max(...publishDateValues, dayjs(entry.currentBeltDate).valueOf()))
    }, [allAdminActions])

    const getAdminAction = useCallback((entry) => {
        return allAdminActions
            .filter(action => action.entryId === entry.id)
            .filter(action => dayjs(action.updatedAt).valueOf() >= getLatestMilestone(entry).valueOf())
            .sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf())[0] ?? null
    }, [allAdminActions, getLatestMilestone])

    const loggedInUserVotes = useMemo(() => {
        return allVotes
            .sort((a, b) => dayjs(b.updatedAt).valueOf - dayjs(a.updatedAt).valueOf)
            .filter(vote => vote.userId === user?.uid) ?? null
    }, [allVotes, user])

    const getCurrentVotes = useCallback((entry) => {
        return allVotes
            .filter(v => v.entryId === entry.id)
            .filter(v => dayjs(v.updatedAt).valueOf() >= getLatestMilestone(entry).valueOf())
    }, [allVotes, getLatestMilestone])

    const getPreviousVotes = useCallback((entry) => {
        return allVotes
            .filter(v => v.entryId === entry.id)
            .filter(v => dayjs(v.updatedAt).valueOf() < getLatestMilestone(entry).valueOf())
    }, [allVotes, getLatestMilestone])

    const getUserVote = useCallback((entry) => {
        return loggedInUserVotes
            .filter(v => dayjs(v.updatedAt).valueOf() >= getLatestMilestone(entry).valueOf())
            .sort((a, b) => dayjs(b.updatedAt).valueOf - dayjs(a.updatedAt).valueOf)
            .find(vote => vote.entryId === entry.id) ?? null
    }, [getLatestMilestone, loggedInUserVotes])

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
        return entry.belt === 'Unranked' || getAdminActionStatus(entry) === 'Re-opened'
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
    isActive
}), [allVotes, allAdminActions, loggedInUserVotes, getUserVote, getAdminAction, getLatestMilestone, getAdminActionStatus, getCurrentVotes, getPreviousVotes, isActive])

return (
    <ClassificationContext.Provider value={value}>
        {children}
    </ClassificationContext.Provider>
)
}

export default ClassificationContext
