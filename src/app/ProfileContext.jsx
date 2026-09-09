import React, {createContext, useContext, useEffect, useMemo, useState} from 'react'
import AuthContext from './AuthContext.jsx'
import DBContext from './DBContext.jsx'
import APIContext from './APIContext.jsx'
import FilterContext from '../context/FilterContext.jsx'
import ScoringContext from '../context/ScoringContext.jsx'

const ProfileContext = createContext({})

const emptyScoreData = {
    scoredActivity: [],
    bbCount: 0,
    danPoints: 0,
    eligibleDan: 0,
    nextDanPoints: 0,
    nextDanLocks: 0,
    uniqueLocks: 0,
    maxBelt: undefined
}

export function ProfileProvider({children, userId: providedUserId}) {
    const {isLoggedIn, user, userClaims = []} = useContext(AuthContext)
    const {dbLoaded, lockCollection, getProfile} = useContext(DBContext)
    const {fetchProfileSummary} = useContext(APIContext)
    const {filters = {}} = useContext(FilterContext)
    const scoringData = useContext(ScoringContext)

    const userId = providedUserId || filters.uid || user?.uid || ''
    const isSelf = Boolean(user?.uid && user.uid === userId)
    const adminUser = isLoggedIn && user && ['lpuAdmin', 'admin'].some(claim => userClaims.includes(claim))

    const [summaryState, setSummaryState] = useState({
        loading: false,
        error: null,
        data: null
    })

    useEffect(() => {
        let cancelled = false

        async function loadProfile() {
            if (!userId || isSelf) {
                setSummaryState({loading: false, error: null, data: null})
                return
            }

            setSummaryState({loading: true, error: null, data: null})

            try {
                const profile = adminUser
                    ? await getProfile(userId)
                    : await fetchProfileSummary(userId)
                if (cancelled) return

                setSummaryState({
                    loading: false,
                    error: null,
                    data: {
                        source: adminUser ? 'db-full-admin' : 'api-summary',
                        isFullProfile: adminUser,
                        profile,
                        ...emptyScoreData
                    }
                })
            } catch (error) {
                if (cancelled) return
                setSummaryState({loading: false, error, data: null})
            }
        }

        loadProfile().then()

        return () => {
            cancelled = true
        }
    }, [adminUser, fetchProfileSummary, getProfile, isSelf, userId])

    const selfData = useMemo(() => {
        if (!userId || !isSelf || !dbLoaded) return null

        return {
            source: 'db-full',
            isFullProfile: true,
            profile: lockCollection,
            ...emptyScoreData,
            ...scoringData
        }
    }, [dbLoaded, isSelf, lockCollection, scoringData, userId])

    const data = isSelf ? selfData : summaryState.data
    const loading = isSelf ? !dbLoaded : summaryState.loading
    const error = isSelf ? null : summaryState.error

    const value = useMemo(() => ({
        userId,
        isSelf,
        adminUser,
        isFullProfile: data?.isFullProfile === true,
        source: data?.source,
        data,
        loading,
        error
    }), [adminUser, data, error, isSelf, loading, userId])

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    )
}

export default ProfileContext
