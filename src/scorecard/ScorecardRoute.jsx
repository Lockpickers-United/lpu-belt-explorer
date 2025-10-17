import React, {useContext, useCallback, useState} from 'react'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {collectionsStatsCurrent} from '../data/dataUrls'
import {FilterProvider} from '../context/FilterContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {ScorecardDataProvider} from './ScorecardDataProvider.jsx'
import {scorecardFilterFields} from '../data/filterFields'
import {ScorecardListProvider} from './ScorecardListContext.jsx'
import {useParams} from 'react-router-dom'
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

function ScorecardRoute({mostPopular}) {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)
    const {getProfile, getPickerActivity} = useContext(DBContext)
    const {
        scoredActivity,
        bbCount,
        danPoints,
        eligibleDan,
        nextDanPoints,
        nextDanLocks,
        uniqueLocks,
        maxBelt
    } = useContext(ScoringContext)

    usePageTitle('Scorecard')

    const [triggerState, setTriggerState] = useState(false)
    const handleAdminAction = useCallback(() => {
        setTriggerState(!triggerState)
    }, [triggerState])

    const loadFn = useCallback(async () => {
        if (triggerState) {
            // Terrible hack to reload data when an admin takes action to modify
            // another user's scorecard. The dependency array will trigger eval,
            // and this removes lint error without suppressing other dep problems.
            triggerState
        }
        try {
            const profile = await getProfile(userId)

            if (profile) {
                const ownerName = profile.displayName && !profile['privacyAnonymous']
                    ? profile.displayName.toLowerCase().endsWith('s')
                        ? `${profile.displayName}'`
                        : `${profile.displayName}'s`
                    : 'Anonymous'
                document.title = `LPU Belt Explorer - ${ownerName} Scorecard`
            }
            if (user?.uid !== userId) {
                const activity = await getPickerActivity(userId)
                return {profile, ...calculateScoreForUser(activity)}
            } else {
                return {
                    profile,
                    scoredActivity,
                    bbCount,
                    danPoints,
                    eligibleDan,
                    nextDanPoints,
                    nextDanLocks,
                    uniqueLocks,
                    maxBelt
                }
            }
        } catch (ex) {
            console.error('Error loading profile and activity.', ex)
            return null
        }
    }, [triggerState, getProfile, userId, user, getPickerActivity, scoredActivity, bbCount, danPoints, eligibleDan, nextDanPoints, nextDanLocks, uniqueLocks, maxBelt])
    const {data = {}, loading, error} = useData({loadFn})

    const owner = user?.uid === userId

    const profile = data ? data.profile : {}
    const blackBeltScorecard = data?.profile?.blackBeltAwardedAt > 0

    const cardActivity = data ? data.scoredActivity : []
    const cardBBCount = data ? data.bbCount : 0
    const cardDanPoints = data ? data.danPoints : 0
    const cardEligibleDan = data ? data.eligibleDan : 0
    const cardNextDanPoints = data ? data.nextDanPoints : 0
    const cardNextDanLocks = data ? data.nextDanLocks : 0
    const cardUniqueLocks = data ? data.uniqueLocks : 0
    const beltAwards = data
        ? data.scoredActivity
            .filter(activity => activity.collectionDB === 'awards')
            .map(activity => allAwardsById[activity.matchId])
            .filter(award => award['awardType'] === 'belt')
            .sort((a, b) => a.rank - b.rank)
        : []
    const cardMaxBelt = data ? beltAwards[beltAwards.length - 1] : {}

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
                                   profile={profile} blackBeltScorecard={blackBeltScorecard}>
                <ScorecardListProvider>
                    <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

                        {loading && <LoadingDisplay/>}

                        {!loading && data && !error &&
                            <Scorecard owner={user && user?.uid === userId} profile={profile}
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