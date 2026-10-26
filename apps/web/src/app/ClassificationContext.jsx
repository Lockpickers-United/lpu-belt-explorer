import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {collection, onSnapshot, query, where} from 'firebase/firestore'
import {db} from '../auth/firebase.js'
import AuthContext from './AuthContext.jsx'
import ClassificationContext from './classificationContextValue.js'
import {useAccess} from './AccessContext.jsx'

const allowedRoles = ['admin', 'classificationAdmin', 'lpuMod', 'classificationTeam']

function iso(value) {
    return value?.toDate?.().toISOString() ?? value ?? null
}

function snapshotRecords(snapshot) {
    return snapshot.docs.map(doc => {
        const record = doc.data()
        return {
            id: doc.id,
            ...record,
            createdAt: iso(record.createdAt),
            updatedAt: iso(record.updatedAt),
            decisionMilestoneAt: iso(record.decisionMilestoneAt),
            latestVoteAt: iso(record.latestVoteAt),
            currentVoteChips: record.currentVoteChips?.map(chip => ({...chip, updatedAt: iso(chip.updatedAt)})),
            previousVoteChips: record.previousVoteChips?.map(chip => ({...chip, updatedAt: iso(chip.updatedAt)}))
        }
    })
}

function currentVote(vote, state) {
    if (state?.reopened) return true
    const milestone = iso(state?.decisionMilestoneAt)
    return !milestone || new Date(iso(vote.updatedAt ?? vote.createdAt)).getTime() >= new Date(milestone).getTime()
}

export function ClassificationProvider({children}) {
    const {user} = useContext(AuthContext)
    const {accessInfo} = useAccess()
    const uid = user?.uid
    const mayRead = Boolean(uid && allowedRoles.some(role => accessInfo.roles?.[role]))
    const [ownerVotes, setOwnerVotes] = useState([])
    const [matchingStates, setMatchingStates] = useState([])
    const [ownerError, setOwnerError] = useState(null)
    const [votesLoaded, setVotesLoaded] = useState(false)
    const [statesLoaded, setStatesLoaded] = useState(false)
    const ownerLoading = Boolean(mayRead && !ownerError && (!votesLoaded || !statesLoaded))

    useEffect(() => {
        if (!mayRead) return
        const votesQuery = query(collection(db, 'classificationVotes'), where('userId', '==', uid))
        const statesQuery = query(collection(db, 'classificationEntryStates'), where('voterIds', 'array-contains', uid))
        const onError = error => {
            setOwnerError(error)
        }
        setOwnerVotes([])
        setMatchingStates([])
        setOwnerError(null)
        setVotesLoaded(false)
        setStatesLoaded(false)
        const unsubscribeVotes = onSnapshot(votesQuery, snapshot => {
            setOwnerVotes(snapshotRecords(snapshot))
            setVotesLoaded(true)
        }, onError)
        const unsubscribeStates = onSnapshot(statesQuery, snapshot => {
            setMatchingStates(snapshotRecords(snapshot))
            setStatesLoaded(true)
        }, onError)
        return () => {
            unsubscribeVotes()
            unsubscribeStates()
        }
    }, [mayRead, uid])

    const visibleVotes = useMemo(() => mayRead ? ownerVotes.filter(vote => vote.userId === uid) : [],
        [mayRead, ownerVotes, uid])
    const visibleStates = useMemo(() => mayRead
        ? matchingStates.filter(state => state.voterIds?.includes(uid)) : [], [mayRead, matchingStates, uid])
    const votesByEntry = useMemo(() => new Map(visibleVotes.map(vote => [vote.entryId, vote])), [visibleVotes])
    const statesByEntry = useMemo(() => new Map(visibleStates.map(state => [state.entryId, state])), [visibleStates])
    const getUserVote = useCallback(entry => votesByEntry.get(entry.id) ?? null, [votesByEntry])
    const getCurrentUserVote = useCallback(entry => {
        if (!statesLoaded) return null
        const vote = votesByEntry.get(entry.id)
        const state = statesByEntry.get(entry.id)
        return vote && state && currentVote(vote, state) ? vote : null
    }, [statesByEntry, statesLoaded, votesByEntry])

    const value = useMemo(() => ({
        mayRead,
        ownerVotes: visibleVotes,
        ownerLoading,
        ownerError,
        matchingStates: visibleStates,
        getUserVote,
        getCurrentUserVote,
        getAdminAction: () => null,
        getAdminActionStatus: () => 'No Votes',
        getCurrentVotes: () => [],
        getPreviousVotes: () => [],
        isActive: entry => entry.belt === 'Unranked',
        previousChangelogs: []
    }), [mayRead, visibleVotes, ownerLoading, ownerError, visibleStates, getUserVote, getCurrentUserVote])

    return <ClassificationContext.Provider value={value}>{children}</ClassificationContext.Provider>
}

export function ClassificationSummaryProvider({children}) {
    const parent = useContext(ClassificationContext)
    const {accessInfo} = useAccess()
    const {user} = useContext(AuthContext)
    const uid = user?.uid
    const mayRead = Boolean(uid && allowedRoles.some(role => accessInfo.roles?.[role]))
    const [summaries, setSummaries] = useState([])
    const [summaryLoading, setSummaryLoading] = useState(true)
    const [summaryError, setSummaryError] = useState(null)

    useEffect(() => {
        if (!mayRead) return
        setSummaries([])
        setSummaryLoading(true)
        setSummaryError(null)
        return onSnapshot(collection(db, 'classificationEntries'), snapshot => {
            setSummaries(snapshotRecords(snapshot))
            setSummaryLoading(false)
        }, error => {
            setSummaryError(error)
            setSummaryLoading(false)
        })
    }, [mayRead, uid])

    const summariesByEntry = useMemo(() => new Map(summaries.map(summary => [summary.entryId, summary])), [summaries])
    const getSummary = useCallback(entry => summariesByEntry.get(entry.id) ?? null, [summariesByEntry])
    const getCurrentVotes = useCallback(entry => getSummary(entry)?.currentVoteChips ?? [], [getSummary])
    const getPreviousVotes = useCallback(entry => getSummary(entry)?.previousVoteChips ?? [], [getSummary])
    const getAdminAction = useCallback(entry => {
        const summary = getSummary(entry)
        return summary?.currentActionId
            ? {id: summary.currentActionId, status: summary.currentActionStatus} : null
    }, [getSummary])
    const getAdminActionStatus = useCallback(entry => {
        const summary = getSummary(entry)
        return summary?.currentActionStatus ?? (summary?.currentVoteCount ? 'Has Votes' : 'No Votes')
    }, [getSummary])
    const isActive = useCallback(entry => entry.belt === 'Unranked' ||
        ['Re-opened', 'Pending', 'Staged'].includes(getSummary(entry)?.currentActionStatus), [getSummary])

    const value = useMemo(() => ({
        ...parent,
        mayRead,
        summaries,
        summaryLoading,
        summaryError,
        getSummary,
        getCurrentVotes,
        getPreviousVotes,
        getAdminAction,
        getAdminActionStatus,
        isActive
    }), [parent, mayRead, summaries, summaryLoading, summaryError, getSummary, getCurrentVotes, getPreviousVotes, getAdminAction, getAdminActionStatus, isActive])

    return (
        <ClassificationContext.Provider value={value}>
            {children}
        </ClassificationContext.Provider>
    )
}

export default ClassificationContext
