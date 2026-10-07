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

    const currentUserVotes = useMemo(() => {
        return allVotes
            .sort((a, b) => dayjs(b.updatedAt).valueOf - dayjs(a.updatedAt).valueOf)
            .filter(vote => vote.userId === user?.uid) ?? null
    }, [allVotes, user])

    const getUserVote = useCallback((entryId) => {
        return currentUserVotes
            .find(vote => vote.entryId === entryId) ?? null
    }, [currentUserVotes])

    const getAdminAction = useCallback((entry) => {
        return allAdminActions
            .sort((a, b) => dayjs(b.updatedAt).valueOf - dayjs(a.updatedAt).valueOf)
            .find(action => action.entryId === entry.id) ?? null
    }, [allAdminActions])


    const value = useMemo(() => ({
        allVotes,
        allAdminActions,
        currentUserVotes,
        getUserVote,
        getAdminAction
    }), [allVotes, allAdminActions, currentUserVotes, getUserVote, getAdminAction])

    return (
        <ClassificationContext.Provider value={value}>
            {children}
        </ClassificationContext.Provider>
    )
}

export default ClassificationContext
