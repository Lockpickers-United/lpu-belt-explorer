import React, {useContext, useCallback, useState, useMemo, useEffect} from 'react'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {collectionsStatsCurrent} from '../data/dataUrls'
import {FilterProvider} from '../context/FilterContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {ScorecardDataProvider} from './ScorecardDataProvider.jsx'
import {scorecardFilterFields} from '../data/filterFields'
import {ScorecardListProvider} from './ScorecardListContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import calculateScoreForUser from '../scorecard/scoring'
import dayjs from 'dayjs'
import DBContext from '../app/DBContext.jsx'
import Footer from '../nav/Footer.jsx'
import LoadingDisplay from '../util/LoadingDisplay.jsx'
import Scorecard from './Scorecard.jsx'
import ScorecardExportButton from './ScorecardExportButton.jsx'
import ScorecardProfileNotFound from './ScorecardProfileNotFound.jsx'
import ScoringContext from '../context/ScoringContext.jsx'
import Tracker from '../app/Tracker.jsx'
import useData from '../util/useData.jsx'
import {allAwardsById} from '../entries/entryutils'
import usePageTitle from '../util/usePageTitle.jsx'
import ProfileContext from '../app/ProfileContext.jsx'
import AppContext from '../app/AppContext.jsx'

function ScorecardRoute({mostPopular}) {
    const {user} = useContext(AuthContext)
    const {adminEnabled} = useContext(AppContext)
    const {getPickerActivity} = useContext(DBContext)

    usePageTitle('Scorecard')

    const [triggerState, setTriggerState] = useState(false)
    const handleAdminAction = useCallback(() => {
        setTriggerState(!triggerState)
    }, [triggerState])

    const {userId, data, loading, error} = useContext(ProfileContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])

    adminEnabled && console.log('ScorecardRoute', {userId, data, loading, error})

    const {
        scoredActivity,
        bbCount,
        danPoints,
        eligibleDan,
        nextDanPoints,
        nextDanLocks,
        uniqueLocks
    } = useContext(ScoringContext)

    useEffect(() => {
        if (profile) {
            const ownerName = profile.displayName && !profile['privacyAnonymous']
                ? profile?.displayName?.toLowerCase().endsWith('s')
                    ? `${profile.displayName}'`
                    : `${profile.displayName}'s`
                : 'Anonymous'
            document.title = `LPU Belt Explorer - ${ownerName} Scorecard`
        }
    }, [profile])

    const loadFn = useCallback(async () => {
        if (triggerState) {
            // Terrible hack to reload data when an admin takes action to modify
            // another user's scorecard. The dependency array will trigger eval,
            // and this removes lint error without suppressing other dep problems.
            triggerState
        }
        try {
            if (user?.uid === userId) {
                return {
                    scoredActivity,
                    bbCount,
                    danPoints,
                    eligibleDan,
                    nextDanPoints,
                    nextDanLocks,
                    uniqueLocks
                }
            } else {
                const activity = await getPickerActivity(userId)
                return calculateScoreForUser(activity)
            }
        } catch (ex) {
            console.error('Error loading profile and activity.', ex)
            return null
        }
    }, [bbCount, danPoints, eligibleDan, getPickerActivity, nextDanLocks, nextDanPoints, scoredActivity, triggerState, uniqueLocks, user?.uid, userId])

    const scorecardData = useData({loadFn})
    const combinedProfile = useMemo(() => ({...profile, ...scorecardData.data}), [profile, scorecardData.data])
    const blackBeltScorecard = !!combinedProfile?.blackBeltAwardedAt

    adminEnabled && console.log('combinedProfile', combinedProfile)

    const owner = user?.uid === userId

    const cardSourceData = scorecardData?.data || {}

    const cardActivity = cardSourceData.scoredActivity || []
    const cardBBCount = cardSourceData.bbCount || 0
    const cardDanPoints = cardSourceData.danPoints || 0
    const cardEligibleDan = cardSourceData.eligibleDan || 0
    const cardNextDanPoints = cardSourceData.nextDanPoints || 0
    const cardNextDanLocks = cardSourceData.nextDanLocks || 0
    const cardUniqueLocks = cardSourceData.uniqueLocks || 0
    const beltAwardsData = cardSourceData.scoredActivity || []
    const beltAwards = beltAwardsData
        ? beltAwardsData
            .filter(activity => activity.collectionDB === 'awards')
            .map(activity => allAwardsById[activity.matchId])
            .filter(award => award['awardType'] === 'belt')
            .sort((a, b) => a.rank - b.rank)
        : []
    const cardMaxBelt = beltAwardsData ? beltAwards[beltAwards.length - 1] : {}

    const collectionsStats = useData({url: collectionsStatsCurrent})
    const popularLocksBB = collectionsStats.data ? collectionsStats.data.blackBeltOnly.listStats.recordedLocks.topItems : []
    const popularLocks = collectionsStats.data ? collectionsStats.data.allUsers.listStats.recordedLocks.topItems : []

    const footerBefore = (<div style={{margin: '30px 0px'}}><ScorecardExportButton text={true} profile={profile}/></div>)

    if (loading || error) {
        return null
    }

    return (
        <FilterProvider filterFields={scorecardFilterFields}>
            <ScorecardDataProvider cardActivity={cardActivity} cardBBCount={cardBBCount}
                                   cardDanPoints={cardDanPoints}
                                   cardEligibleDan={cardEligibleDan} cardNextDanPoints={cardNextDanPoints}
                                   cardNextDanLocks={cardNextDanLocks} cardUniqueLocks={cardUniqueLocks}
                                   cardMaxBelt={cardMaxBelt}
                                   popularLocks={popularLocks} popularLocksBB={popularLocksBB}
                                   profile={combinedProfile} blackBeltScorecard={blackBeltScorecard}>
                <ScorecardListProvider>
                    <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

                        {loading && <LoadingDisplay/>}

                        {!loading && data && !error &&
                            <Scorecard owner={user && user?.uid === userId} profile={combinedProfile}
                                       adminAction={handleAdminAction} popular={mostPopular}/>}

                        {!loading && (!data || error) && <ScorecardProfileNotFound/>}

                        <Footer before={footerBefore}/>
                    </LocalizationProvider>
                    <Tracker feature='scorecard' own={owner}/>
                </ScorecardListProvider>
            </ScorecardDataProvider>
        </FilterProvider>
    )
}

export default ScorecardRoute
