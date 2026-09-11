import React, {useContext, useMemo} from 'react'
import Nav from '../../nav/Nav.jsx'
import useWindowSize from '../../util/useWindowSize.jsx'
import usePageTitle from '../../util/usePageTitle.jsx'
import BeltRequestForm from './BeltRequestForm.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import {ScorecardDataProvider} from '../../scorecard/ScorecardDataProvider.jsx'
import ScoringContext from '../../context/ScoringContext.jsx'
import {allAwardsById} from '../../entries/entryutils'
import {ScorecardListProvider} from '../../scorecard/ScorecardListContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs/index.d.ts'
import LoadingDisplay from '../../util/LoadingDisplay.jsx'
import ProfileContext from '../../app/ProfileContext.jsx'

export default function BeltRequestSubmitRoute() {

    const {data, loading, error} = useContext(ProfileContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])

    const {
        scoredActivity,
        bbCount,
        danPoints,
        eligibleDan,
        nextDanPoints,
        nextDanLocks,
        uniqueLocks,
    } = useContext(ScoringContext)

    const cardActivity = scoredActivity || []
    const cardBBCount = bbCount || 0
    const cardDanPoints = danPoints || 0
    const cardEligibleDan = eligibleDan || 0
    const cardNextDanPoints = nextDanPoints || 0
    const cardNextDanLocks = nextDanLocks || 0
    const cardUniqueLocks = uniqueLocks || 0
    const beltAwardsData = scoredActivity || []
    const beltAwards = beltAwardsData
        ? beltAwardsData
            .filter(activity => activity.collectionDB === 'awards')
            .map(activity => allAwardsById[activity.matchId])
            .filter(award => award['awardType'] === 'belt')
            .sort((a, b) => a.rank - b.rank)
        : []
    const cardMaxBelt = beltAwardsData ? beltAwards[beltAwards.length - 1] : {}

    const blackBeltScorecard = data?.profile?.blackBeltAwardedAt > 0


    usePageTitle('Belt Request Composer')

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

                        <Nav title='Belt Request Composer' extras={extras}/>

                        {loading && <LoadingDisplay/>}

                        {!loading && !error &&
                            <BeltRequestForm/>
                        }


                    </LocalizationProvider>
                </ScorecardListProvider>
            </ScorecardDataProvider>
        </FilterProvider>
    )
}