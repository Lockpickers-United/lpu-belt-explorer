import React, {useContext, useCallback, useEffect, useMemo, useState} from 'react'
import {ScorecardDataProvider} from '../scorecard/ScorecardDataProvider.jsx'
import {ScorecardListProvider} from '../scorecard/ScorecardListContext.jsx'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import ProfileDataContext from '../app/ProfileDataContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {collectionsStatsCurrent} from '../data/dataUrls'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import Footer from '../nav/Footer.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import useData from '../util/useData.jsx'
import {allAwardsById} from '../entries/entryutils'
import {TextField, Button} from '@mui/material'
import calculateScoreForUser from '../scorecard/scoring'
import AppContext from '../app/AppContext.jsx'

export default function UserInfoMain() {
    const {user, userClaims} = useContext(AuthContext)
    const {adminRole, getPickerActivity} = useContext(DBContext)
    const {admin} = useContext(AppContext)

    // TODO get full profile if admin (maybe always in ProfileDataContext?)
    // const isAdmin = ['lpuAdmin', 'admin'].some(claim => userClaims.includes(claim))

    const {userId, data, loading, error, isFullProfile} = useContext(ProfileDataContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])

    admin && console.log('profile', {isFullProfile, data})


    const {filters = {}, addFilters} = useContext(FilterContext)
    const {uid, name} = filters
    const [uidInput, setUidInput] = useState(uid || user?.uid || '')


    useEffect(() => {
        setUidInput(userId || '')
    }, [userId])

    useEffect(() => {
        if (profile) {
            const ownerName = profile.displayName && !profile['privacyAnonymous']
                ? profile?.displayName?.toLowerCase().endsWith('s')
                    ? `${profile.displayName}'`
                    : `${profile.displayName}'s`
                : 'Anonymous'
            document.title = `LPU Belt Explorer - ${ownerName} User Info`
        }
    }, [profile])

    useEffect(() => {
        if (user && !uid) {
            addFilters([
                {key: 'uid', value: user.uid}
            ], true)
        }
    }, [addFilters, uid, user])

    useEffect(() => {
        if (profile && (!name || (profile.displayName && name !== profile.displayName))) {
            addFilters([
                {key: 'name', value: encodeURIComponent(profile?.displayName)}
            ], true)
        }
    }, [addFilters, name, profile])

    const loadFn = useCallback(async () => {
        try {
            const activity = await getPickerActivity(userId)
            return calculateScoreForUser(activity)
        } catch (ex) {
            console.error('Error loading profile and activity.', ex)
            return null
        }
    }, [getPickerActivity, userId])
    const scorecardData = useData({loadFn})

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

    const collectionsStats = useData({url: collectionsStatsCurrent})
    const popularLocksBB = collectionsStats.data ? collectionsStats.data.blackBeltOnly.listStats.recordedLocks.topItems : []
    const popularLocks = collectionsStats.data ? collectionsStats.data.allUsers.listStats.recordedLocks.topItems : []

    const footerBefore = undefined

    const headerStyle = {fontWeight: 700, backgroundColor: '#333', padding: 2, textAlign: 'left', marginTop: 10}
    const varStyle = {fontWeight: 700, paddingRight: 10}

    const handleUidApply = useCallback(() => {
        const value = (uidInput || '').trim()
        const next = value || user?.uid || ''
        addFilters([
            {key: 'uid', value: next},
            {key: 'name', value: undefined}
        ], true)
    }, [uidInput, addFilters, user])

    const handleUidClear = useCallback(() => {
        const self = user?.uid || ''
        setUidInput(self)
        addFilters([
            {key: 'uid', value: self},
            {key: 'name', value: undefined}
        ], true)
    }, [addFilters, user])

    if (loading) {
        return null
    }

    return (
        <ScorecardDataProvider cardActivity={cardActivity} cardBBCount={cardBBCount}
                               cardDanPoints={cardDanPoints}
                               cardEligibleDan={cardEligibleDan} cardNextDanPoints={cardNextDanPoints}
                               cardNextDanLocks={cardNextDanLocks} cardUniqueLocks={cardUniqueLocks}
                               cardMaxBelt={cardMaxBelt}
                               popularLocks={popularLocks} popularLocksBB={popularLocksBB}>
            <ScorecardListProvider>
                <LocalizationProvider adapterLocale={dayjs.locale()} dateAdapter={AdapterDayjs}>

                    {loading && <LoadingDisplay/>}

                    {!loading && data && !error &&
                        <div style={{
                            minWidth: '320px', height: '100%',
                            padding: 20, backgroundColor: '#000',
                            marginLeft: 'auto', marginRight: 'auto',
                            justifyItems: 'center', fontSize: '0.95rem'
                        }}>
                            {adminRole &&
                                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
                                    <TextField
                                        label='View user by UID'
                                        variant='outlined'
                                        size='small'
                                        value={uidInput}
                                        onChange={(e) => setUidInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleUidApply()
                                        }}
                                        style={{flex: 1, minWidth: 360}}
                                    />
                                    <Button variant='contained' color='secondary' size='small'
                                            onClick={handleUidApply}>Load</Button>
                                    <Button variant='text' color='inherit' size='small' onClick={handleUidClear}>Reset
                                        to me</Button>
                                </div>
                            }
                            <table id='userInfo'>
                                <thead>
                                <tr style={headerStyle}>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr style={{height: 10}}></tr>
                                <tr>
                                    <td style={varStyle}>source</td>
                                    <td>{data?.source}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>Is Full Profile</td>
                                    <td>{data?.isFullProfile ? 'Yes' : 'No'}</td>
                                </tr>
                                <tr style={{height: 10}}></tr>
                                <tr>
                                    <td style={varStyle}>display name</td>
                                    <td>{profile?.displayName}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>user id</td>
                                    <td>{userId}</td>
                                </tr>
                                {user?.uid === userId &&
                                    <tr>
                                        <td style={varStyle}>user claims</td>
                                        <td>{userClaims.join(', ')}</td>
                                    </tr>
                                }
                                {isFullProfile && profile?.admin &&
                                    <tr>
                                        <td style={varStyle}>profile.admin</td>
                                        <td>true</td>
                                    </tr>
                                }

                                <tr style={{height: 10}}></tr>
                                <tr>
                                    <td style={headerStyle} colSpan={2}>SCORECARD</td>
                                </tr>
                                {isFullProfile &&
                                    <tr>
                                        <td style={varStyle}>blackBeltAwarded</td>
                                        <td>{profile?.blackBeltAwardedAt ? 'true' : ''}</td>
                                    </tr>
                                }
                                <tr>
                                    <td style={varStyle}>cardMaxBelt</td>
                                    <td>{cardMaxBelt?.name}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>cardBBCount</td>
                                    <td>{cardBBCount}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>cardDanPoints</td>
                                    <td>{cardDanPoints}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>cardEligibleDan</td>
                                    <td>{cardEligibleDan}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>cardNextDanPoints</td>
                                    <td>{cardNextDanPoints}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>cardNextDanLocks</td>
                                    <td>{cardNextDanLocks}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>cardUniqueLocks</td>
                                    <td>{cardUniqueLocks}</td>
                                </tr>
                                {isFullProfile &&
                                    <>
                                        <tr>
                                            <td style={varStyle}>projects</td>
                                            <td>{profile?.projects?.length}</td>
                                        </tr>
                                        <tr>
                                            <td style={varStyle}>tabClaimed</td>
                                            <td>{profile?.tabClaimed}</td>
                                        </tr>
                                        <tr>
                                            <td style={varStyle}>redditUsername</td>
                                            <td>{profile?.redditUsername}</td>
                                        </tr>
                                        <tr>
                                            <td style={varStyle}>discordUsername</td>
                                            <td>{profile?.discordUsername}</td>
                                        </tr>
                                    </>
                                }

                                <tr style={{height: 10}}></tr>
                                <tr>
                                    <td style={headerStyle} colSpan={2}>LOCK COLLECTION</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>any</td>
                                    <td>{profile?.any?.length}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>own</td>
                                    <td>{profile?.own?.length}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>picked</td>
                                    <td>{profile?.picked?.length}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>recorded</td>
                                    <td>{profile?.recorded?.length}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>wishlist</td>
                                    <td>{profile?.wishlist?.length}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>safelocksAny</td>
                                    <td>{profile?.safelocksAny?.length}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>safelocksCracked</td>
                                    <td>{profile?.safelocksCracked?.length}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>safelocksOwn</td>
                                    <td>{profile?.safelocksOwn?.length}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>safelocksWishlist</td>
                                    <td>{profile?.safelocksWishlist?.length}</td>
                                </tr>

                                </tbody>
                            </table>

                        </div>
                    }

                    {!loading && (!data || error) &&
                        <div style={{
                            minWidth: '320px', height: '100%',
                            padding: 20, backgroundColor: '#000',
                            marginLeft: 'auto', marginRight: 'auto',
                            justifyItems: 'center', fontSize: '0.95rem',
                            textalign: 'center'
                        }}>
                            no user
                        </div>
                    }

                    <Footer before={footerBefore}/>
                </LocalizationProvider>
            </ScorecardListProvider>
        </ScorecardDataProvider>
    )
}
