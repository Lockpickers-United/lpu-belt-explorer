import React, {useCallback, useContext} from 'react'
import calculateScoreForUser from '../../scorecard/scoring.js'
import useData from '../../util/useData.jsx'
import DBContext from '../../app/DBContext.jsx'
import ProfileContext from '../../app/ProfileContext.jsx'
import {allAwardsById} from '../../entries/entryutils.js'
import {ScorecardDataProvider} from '../../scorecard/ScorecardDataProvider.jsx'
import {ScorecardListProvider} from '../../scorecard/ScorecardListContext.jsx'
import ScorecardDanStats from '../../scorecard/ScorecardDanStats.jsx'


export default function DanStatsWrapper() {
    const {profile, getPickerActivity} = useContext(DBContext)
    const {userId, data, loading, error, isFullProfile} = useContext(ProfileContext)

    const loadFn = useCallback(async () => {
        try {
            const activity = await getPickerActivity(profile.userId)
            return calculateScoreForUser(activity)
        } catch (ex) {
            console.error('Error loading profile and activity.', ex)
            return null
        }
    }, [getPickerActivity, profile.userId])
    const scorecardData = useData({loadFn})

    console.log(scorecardData)

    const cardActivity = data?.scoredActivity.length
        ? data?.scoredActivity
        : scorecardData?.data?.scoredActivity || []
    const cardBBCount = data?.bbCount || scorecardData?.data?.bbCount || 0
    const cardDanPoints = data?.danPoints || scorecardData?.data?.danPoints || 0
    const cardEligibleDan = data?.eligibleDan || scorecardData?.data?.eligibleDan || 0
    const cardNextDanPoints = data?.nextDanPoints || scorecardData?.data?.nextDanPoints || 0
    const cardNextDanLocks = data?.nextDanLocks || scorecardData?.data?.nextDanLocks || 0
    const cardUniqueLocks = data?.uniqueLocks || scorecardData?.data?.uniqueLocks || 0
    const beltAwardsData = data?.scoredActivity.length
        ? data?.scoredActivity
        : scorecardData?.data?.scoredActivity || []
    const beltAwards = beltAwardsData
        ? beltAwardsData
            .filter(activity => activity.collectionDB === 'awards')
            .map(activity => allAwardsById[activity.matchId])
            .filter(award => award['awardType'] === 'belt')
            .sort((a, b) => a.rank - b.rank)
        : []
    const cardMaxBelt = beltAwardsData ? beltAwards[beltAwards.length - 1] : {}


    return (
        <ScorecardDataProvider cardActivity={cardActivity} cardBBCount={cardBBCount}
                               cardDanPoints={cardDanPoints}
                               cardEligibleDan={cardEligibleDan} cardNextDanPoints={cardNextDanPoints}
                               cardNextDanLocks={cardNextDanLocks} cardUniqueLocks={cardUniqueLocks}
                               cardMaxBelt={cardMaxBelt}
                               popularLocks={[]} popularLocksBB={[]}>
            <ScorecardListProvider>
                <ScorecardDanStats profile={profile} owner={false}/>

            </ScorecardListProvider>
        </ScorecardDataProvider>
    )

}