import React, {useContext, useCallback, useEffect, useMemo, useState} from 'react'
import {ScorecardDataProvider} from '../scorecard/ScorecardDataProvider.jsx'
import {ScorecardListProvider} from '../scorecard/ScorecardListContext.jsx'
import DBContext from '../app/DBContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import ProfileContext from '../app/ProfileContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {collectionsStatsCurrent} from '../data/dataUrls'
import FilterContext from '../context/FilterContext.jsx'
import dayjs from 'dayjs'
import Footer from '../nav/Footer.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import useData from '../util/useData.jsx'
import {allAwardsById} from '../entries/entryutils'
import {TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material'
import calculateScoreForUser from '../scorecard/scoring'
import {useAccess} from '../app/AccessContext.jsx'

export default function UserInfoMain() {
    const {user, userClaims} = useContext(AuthContext)
    const {adminRole, getPickerActivity} = useContext(DBContext)
    const {accessInfo} = useAccess()
    const adminEnabled = accessInfo.enabledRoles.admin

    console.log('accessInfo', accessInfo)
    console.log('userClaims', userClaims)

    const {userId, data, loading, error, isFullProfile} = useContext(ProfileContext)
    const profile = useMemo(() => data ? data.profile : {}, [data])

    console.log('userinfo', {userId, data, loading, error, isFullProfile})
    adminEnabled && console.log('admin log: profile', {isFullProfile, data})

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

    const headerStyle = {fontWeight: 700, backgroundColor: '#333', padding: '2px 8px', textAlign: 'left'}
    const varStyle = {fontWeight: 700, paddingRight: '10px'}

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
                            <TableContainer id='userInfo' sx={{width: 'auto', backgroundColor: '#000'}}>
                                <Table size='small' sx={{minWidth: 360, color: '#fff'}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{...headerStyle, color: '#fff'}}>Parameter</TableCell>
                                            <TableCell sx={{...headerStyle, color: '#fff'}}>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody sx={{'& .MuiTableRow-root:nth-of-type(even) .MuiTableCell-root': {backgroundColor: '#191919'}}}>
                                <TableRow><TableCell colSpan={2} sx={{height: 10, padding: 0, border: 0}} /></TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>display name</TableCell>
                                    <TableCell>{profile?.displayName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>user id</TableCell>
                                    <TableCell>{userId}</TableCell>
                                </TableRow>
                                <TableRow><TableCell colSpan={2} sx={{height: 10, padding: 0, border: 0}} /></TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>source</TableCell>
                                    <TableCell>{data?.source}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>Is Full Profile</TableCell>
                                    <TableCell>{data?.isFullProfile ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                                {(user?.uid === userId) &&
                                    <TableRow>
                                        <TableCell sx={varStyle}>user claims</TableCell>
                                        <TableCell>{userClaims?.join(', ')}</TableCell>
                                    </TableRow>
                                }
                                {isFullProfile &&
                                    <TableRow>
                                        <TableCell sx={varStyle}>profile.admin</TableCell>
                                        <TableCell>true</TableCell>
                                    </TableRow>
                                }

                                <TableRow><TableCell colSpan={2} sx={{height: 10, padding: 0, border: 0}} /></TableRow>
                                <TableRow>
                                    <TableCell sx={{...headerStyle, color: '#fff'}} colSpan={2}>ACCESS CONTEXT</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>activeRole</TableCell>
                                    <TableCell>{accessInfo?.activeRole}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>level</TableCell>
                                    <TableCell>{accessInfo?.level}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>enabledLevel</TableCell>
                                    <TableCell>{accessInfo?.enabledLevel}</TableCell>
                                </TableRow>
                                {accessInfo.roles &&
                                    <TableRow>
                                        <TableCell sx={varStyle}>Roles</TableCell>
                                        <TableCell>
                                            {Object.keys(accessInfo?.roles).map((role, index) => (
                                                <div
                                                    key={'role' + index}>{role}: {accessInfo.roles[role] ? 'True' : 'False'}</div>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                }
                                {accessInfo.enabledRoles &&
                                    <TableRow>
                                        <TableCell sx={varStyle}>Enabled Roles</TableCell>
                                        <TableCell>
                                            {Object.keys(accessInfo?.enabledRoles).map((role, index) => (
                                                <div
                                                    key={'role' + index}>{role}: {accessInfo.enabledRoles[role] ? 'True' : 'False'}</div>
                                            ))}
                                        </TableCell>
                                    </TableRow>
                                }
                                <TableRow><TableCell colSpan={2} sx={{height: 10, padding: 0, border: 0}} /></TableRow>
                                <TableRow><TableCell sx={{...headerStyle, color: '#fff'}} colSpan={2}>SCORECARD</TableCell></TableRow>
                                {isFullProfile &&
                                    <TableRow>
                                        <TableCell sx={varStyle}>blackBeltAwarded</TableCell>
                                        <TableCell>{profile?.blackBeltAwardedAt ? 'true' : ''}</TableCell>
                                    </TableRow>
                                }
                                <TableRow>
                                    <TableCell sx={varStyle}>cardMaxBelt</TableCell>
                                    <TableCell>{cardMaxBelt?.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>cardBBCount</TableCell>
                                    <TableCell>{cardBBCount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>cardDanPoints</TableCell>
                                    <TableCell>{cardDanPoints}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>cardEligibleDan</TableCell>
                                    <TableCell>{cardEligibleDan}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>cardNextDanPoints</TableCell>
                                    <TableCell>{cardNextDanPoints}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>cardNextDanLocks</TableCell>
                                    <TableCell>{cardNextDanLocks}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>cardUniqueLocks</TableCell>
                                    <TableCell>{cardUniqueLocks}</TableCell>
                                </TableRow>
                                {isFullProfile &&
                                    <>
                                        <TableRow>
                                            <TableCell sx={varStyle}>projects</TableCell>
                                            <TableCell>{profile?.projects?.length}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={varStyle}>tabClaimed</TableCell>
                                            <TableCell>{profile?.tabClaimed}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={varStyle}>redditUsername</TableCell>
                                            <TableCell>{profile?.redditUsername}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={varStyle}>discordUsername</TableCell>
                                            <TableCell>{profile?.discordUsername}</TableCell>
                                        </TableRow>
                                    </>
                                }
                                <TableRow><TableCell colSpan={2} sx={{height: 10, padding: 0, border: 0}} /></TableRow>
                                <TableRow>
                                    <TableCell sx={{...headerStyle, color: '#fff'}} colSpan={2}>LOCK COLLECTION</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>any</TableCell>
                                    <TableCell>{profile?.any?.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>own</TableCell>
                                    <TableCell>{profile?.own?.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>picked</TableCell>
                                    <TableCell>{profile?.picked?.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>recorded</TableCell>
                                    <TableCell>{profile?.recorded?.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>wishlist</TableCell>
                                    <TableCell>{profile?.wishlist?.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>safelocksAny</TableCell>
                                    <TableCell>{profile?.safelocksAny?.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>safelocksCracked</TableCell>
                                    <TableCell>{profile?.safelocksCracked?.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>safelocksOwn</TableCell>
                                    <TableCell>{profile?.safelocksOwn?.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={varStyle}>safelocksWishlist</TableCell>
                                    <TableCell>{profile?.safelocksWishlist?.length}</TableCell>
                                </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

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
