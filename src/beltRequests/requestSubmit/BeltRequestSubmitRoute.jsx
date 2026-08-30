import React, {useCallback, useContext} from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import BeltRequestSubmit from './BeltRequestSubmit.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {ScorecardDataProvider} from '../../scorecard/ScorecardDataProvider.jsx'
import AuthContext from '../../app/AuthContext.jsx'
import DBContext from '../../app/DBContext.jsx'
import ScoringContext from '../../context/ScoringContext.jsx'
import calculateScoreForUser from '../../scorecard/scoring'
import useData from '../../util/useData.jsx'
import {allAwardsById} from '../../entries/entryutils'
import {ScorecardListProvider} from '../../scorecard/ScorecardListContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs/index.d.ts'
import LoadingDisplay from '../../util/LoadingDisplay.jsx'
import ScorecardProfileNotFound from '../../scorecard/ScorecardProfileNotFound.jsx'

export default function BeltRequestSubmitRoute() {
    const {user} = useContext(AuthContext)
    const userId = user?.uid

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

    const loadFn = useCallback(async () => {
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
    }, [getProfile, userId, user, getPickerActivity, scoredActivity, bbCount, danPoints, eligibleDan, nextDanPoints, nextDanLocks, uniqueLocks, maxBelt])
    const {data = {}, loading, error} = useData({loadFn})

    const profile = data ? data.profile : {}

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
    const blackBeltScorecard = data?.profile?.blackBeltAwardedAt > 0


    usePageTitle('Request Belt')

    const {isMobile} = useWindowSize()


    const extras = (
        <React.Fragment>{!isMobile && <div style={{flexGrow: 1, minWidth: '10px'}}/>}</React.Fragment>
    )

    return (
        <FilterProvider>
            <ScorecardDataProvider cardActivity={cardActivity} cardBBCount={cardBBCount}
                                   cardDanPoints={cardDanPoints}
                                   cardEligibleDan={cardEligibleDan} cardNextDanPoints={cardNextDanPoints}
                                   cardNextDanLocks={cardNextDanLocks} cardUniqueLocks={cardUniqueLocks}
                                   cardMaxBelt={cardMaxBelt}
                                   popularLocks={[]} popularLocksBB={[]}
                                   profile={profile} blackBeltScorecard={blackBeltScorecard}>
                <ScorecardListProvider>
                    <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

                        <Nav title='Belt Request' extras={extras}/>

                        {loading && <LoadingDisplay/>}

                        {!loading && data && !error &&
                            <BeltRequestSubmit profile={profile} user={user}/>
                        }

                        {!loading && (!data || error) && <ScorecardProfileNotFound/>}

                    </LocalizationProvider>
                </ScorecardListProvider>
            </ScorecardDataProvider>
        </FilterProvider>
    )
}