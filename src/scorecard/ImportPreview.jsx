import React, {useContext, useCallback, useState, useMemo} from 'react'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {collectionsStatsCurrent} from '../data/dataUrls'
import {FilterProvider} from '../context/FilterContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {ScorecardDataProvider} from './ScorecardDataProvider.jsx'
import {scorecardFilterFields} from '../data/filterFields'
import {ScorecardListProvider} from './ScorecardListContext.jsx'
import dayjs from 'dayjs'
import Footer from '../nav/Footer.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import Nav from '../nav/Nav.jsx'
import ScoringContext from '../context/ScoringContext.jsx'
import Tracker from '../app/Tracker.jsx'
import useData from '../util/useData.jsx'
import ImportPreviewDisplay from './ImportPreviewDisplay.jsx'
import SystemMessage from '../systemMessage/SystemMessage.jsx'
import SystemMessageContext from '../systemMessage/SystemMessageContext.jsx'
import ProfileContext from '../app/ProfileContext.jsx'
import {allAwardsById} from '../entries/entryutils'

function ImportPreview({syncStatus, syncResult, service}) {
    const {getMessageById} = useContext(SystemMessageContext)

    const [triggerState, setTriggerState] = useState(false)
    const handleAdminAction = useCallback(() => {
        setTriggerState(!triggerState)
    }, [triggerState])

    const {data, loading, error} = useContext(ProfileContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])

    const {
        scoredActivity,
        bbCount,
        danPoints,
        eligibleDan,
        nextDanPoints,
        nextDanLocks,
        uniqueLocks
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

    const collectionsStats = useData({url: collectionsStatsCurrent})
    const popularLocksBB = collectionsStats.data ? collectionsStats.data.blackBeltOnly.listStats.recordedLocks.topItems : []
    const popularLocks = collectionsStats.data ? collectionsStats.data.allUsers.listStats.recordedLocks.topItems : []

    const nav = null

    const statusMessages = {
        none_found: 'none_found',
        access_denied: 'access_denied',
        token_failed: 'token_failed',
        data_failed: 'data_failed',
        token_expired: 'token_expired',
        debug_download: 'debug_download'
    }
    const msg = getMessageById(statusMessages[[syncStatus]])

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
                                   cardNextDanLocks={cardNextDanLocks} cardUniqueLocks={cardUniqueLocks}
                                   cardMaxBelt={cardMaxBelt}
                                   popularLocks={popularLocks} popularLocksBB={popularLocksBB}
                                   profile={profile}>
                <ScorecardListProvider>
                    <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

                        <Nav title={title} extras={nav}/>
                        {!syncStatus &&
                            <div style={{textAlign: 'center'}}>
                                <LoadingDisplay/>
                                Please wait, this may take a minute or so.<br/><br/>
                            </div>
                        }

                        {syncStatus === 'debug_download' &&
                            <div style={{
                                maxWidth: 500, padding: 40, backgroundColor: '#222',
                                marginLeft: 'auto', marginRight: 'auto', marginTop: 16,
                                textAlign: 'center'
                            }}>
                                <strong>Your Reddit modmail has been downloaded!</strong><br/><br/>
                                Please send the <strong>reddit-modmail-debug.json</strong> file to your friendly LPU Belts developers
                                so they can help fix the problem we are debugging.

                            </div>

                        }
                        {syncStatus === 'complete' &&
                            <ImportPreviewDisplay profile={profile}
                                                  adminAction={handleAdminAction} importResults={syncResult}
                                                  syncStatus={syncStatus} service={service}/>
                        }

                        {syncStatus === 'debug_download' &&
                            <SystemMessage override={msg}/>
                        }

                        {syncStatus === 'token_expired' &&
                            <div>
                                <SystemMessage override={msg}/>
                                <ImportPreviewDisplay profile={profile}
                                                      adminAction={handleAdminAction} importResults={syncResult}
                                                      syncStatus={syncStatus} service={service}/>

                            </div>
                        }

                        {syncStatus === 'token_failed' &&
                            <div>
                                <SystemMessage override={msg}/>
                                <ImportPreviewDisplay profile={profile}
                                                      adminAction={handleAdminAction} importResults={syncResult}
                                                      syncStatus={syncStatus} service={service}/>
                                <Tracker feature='authError-token_failed'/>
                            </div>
                        }

                        {syncStatus === 'access_denied' &&
                            <div style={{textAlign: 'left'}}>
                                <SystemMessage override={msg}/>
                                <ImportPreviewDisplay profile={profile}
                                                      adminAction={handleAdminAction} importResults={syncResult}
                                                      syncStatus={syncStatus} service={service}/>
                                <Tracker feature='authError-access_denied'/>
                            </div>
                        }

                        {syncStatus === 'none_found' &&
                            <div style={{textAlign: 'left'}}>
                                <SystemMessage override={msg}/>
                                <ImportPreviewDisplay profile={profile}
                                                      adminAction={handleAdminAction} importResults={syncResult}
                                                      syncStatus={syncStatus} service={service}/>
                            </div>
                        }

                        {syncStatus === 'data_failed' &&
                            <div style={{textAlign: 'center'}}>
                                <SystemMessage override={msg}/>
                                <ImportPreviewDisplay profile={profile}
                                                      adminAction={handleAdminAction} importResults={syncResult}
                                                      syncStatus={syncStatus} service={service}/>
                                <Tracker feature='authError-data_failed'/>
                            </div>
                        }

                        <Footer extras={footer}/>

                    </LocalizationProvider>
                    <Tracker feature='importPreview'/>
                </ScorecardListProvider>
            </ScorecardDataProvider>
        </FilterProvider>
    )
}

export default ImportPreview