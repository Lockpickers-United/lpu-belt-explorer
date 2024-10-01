import React, {useContext, useCallback, useState} from 'react'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {collectionsFullBB} from '../data/dataUrls'
import {FilterProvider} from '../context/FilterContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {ScorecardDataProvider} from './ScorecardDataProvider.jsx'
import {scorecardFilterFields} from '../data/filterFields'
import {ScorecardListProvider} from './ScorecardListContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import dayjs from 'dayjs'
import DBContext from '../app/DBContext.jsx'
import Footer from '../nav/Footer.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import Nav from '../nav/Nav.jsx'
import ScoringContext from '../context/ScoringContext.jsx'
import Tracker from '../app/Tracker.jsx'
import useData from '../util/useData.jsx'
import ImportPreviewDisplay from './ImportPreviewDisplay.jsx'

function ImportPreview({syncComplete, syncResult, service}) {
    const {user} = useContext(AuthContext)
    const {getProfile} = useContext(DBContext)
    const {scoredActivity, bbCount, danPoints, eligibleDan, nextDanPoints, nextDanLocks} = useContext(ScoringContext)

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
            const profile = user?.uid ? await getProfile(user?.uid) : {}
            return {profile, scoredActivity, bbCount, danPoints, eligibleDan, nextDanPoints, nextDanLocks}

        } catch (ex) {
            console.error('Error loading profile and activity.', ex)
            return null
        }
    }, [triggerState, getProfile, user, scoredActivity, bbCount, danPoints, eligibleDan, nextDanPoints, nextDanLocks])
    const {data = {}, loading, error} = useData({loadFn})

    const profile = data ? data.profile : {}
    const cardActivity = data ? data.scoredActivity : []
    const cardBBCount = data ? data.bbCount : 0
    const cardDanPoints = data ? data.danPoints : 0
    const cardEligibleDan = data ? data.eligibleDan : 0
    const cardNextDanPoints = data ? data.nextDanPoints : 0
    const cardNextDanLocks = data ? data.nextDanLocks : 0

    const bbDataResult = useData({url: collectionsFullBB})
    const popularLocks = bbDataResult.data ? bbDataResult.data.scorecardLocks : []

    const nav = null

    const footer = (
        <React.Fragment>
            <br/>
        </React.Fragment>
    )

    const title = loading ? 'Loading...' : 'Profile'

    if (loading || error) {
        return null
    }

    return (
        <FilterProvider filterFields={scorecardFilterFields}>
            <ScorecardDataProvider cardActivity={cardActivity} cardBBCount={cardBBCount}
                                   cardDanPoints={cardDanPoints}
                                   cardEligibleDan={cardEligibleDan} cardNextDanPoints={cardNextDanPoints}
                                   cardNextDanLocks={cardNextDanLocks} popularLocks={popularLocks}>
                <ScorecardListProvider>
                    <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

                        <Nav title={title} extras={nav}/>

                        {!syncComplete &&
                            <div style={{textAlign:'center'}}>
                                <LoadingDisplay/>
                                Please wait, this may take a minute or so.<br/><br/>
                            </div>
                        }

                        {syncComplete &&
                            <ImportPreviewDisplay profile={profile}
                                                  adminAction={handleAdminAction} importResults={syncResult}
                                                  service={service}/>
                        }

                        <Footer extras={footer}/>

                    </LocalizationProvider>
                    <Tracker feature='scorecard'/>
                </ScorecardListProvider>
            </ScorecardDataProvider>
        </FilterProvider>
    )
}

export default ImportPreview