import React, {useContext, useCallback, useEffect, useMemo} from 'react'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {collectionsStatsCurrent} from '../data/dataUrls'
import FilterContext from '../context/FilterContext.jsx'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {ScorecardDataProvider} from '../scorecard/ScorecardDataProvider.jsx'
import {ScorecardListProvider} from '../scorecard/ScorecardListContext.jsx'
import AuthContext from '../app/AuthContext.jsx'
import calculateScoreForUser from '../scorecard/scoring'
import dayjs from 'dayjs'
import DBContext from '../app/DBContext.jsx'
import Footer from '../nav/Footer.jsx'
import LoadingDisplay from '../misc/LoadingDisplay.jsx'
import ScoringContext from '../context/ScoringContext.jsx'
import useData from '../util/useData.jsx'
import {allAwardsById} from '../entries/entryutils'

export default function UserInfoMain() {
    const {user, userClaims} = useContext(AuthContext)
    const {getProfile, getPickerActivity} = useContext(DBContext)
    const {filters = {}, addFilters} = useContext(FilterContext)
    const {uid, name} = filters

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

    const userId = user?.uid

    const loadFn = useCallback(async () => {
        try {
            const profile = await getProfile(userId)
            if (profile) {
                const ownerName = profile.displayName && !profile['privacyAnonymous']
                    ? profile?.displayName?.toLowerCase().endsWith('s')
                        ? `${profile.displayName}'`
                        : `${profile.displayName}'s`
                    : 'Anonymous'
                document.title = `LPU Belt Explorer - ${ownerName} User Info`
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
    const profile = useMemo(() => data ? data.profile : {}, [data])

    useEffect(() => {
        if (user && !uid) {
            addFilters([
                {key: 'uid', value: user.uid},
            ], true)
        }
        if (profile && !name) {
            addFilters([
                {key: 'name', value: encodeURIComponent(profile?.displayName)}
            ], true)
        }
    }, [addFilters, filters, name, profile, uid, user])

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

    const footerBefore = undefined

    if (loading || error) {
        return null
    }

    const headerStyle = {fontWeight: 700, backgroundColor: '#333', padding: 2, textAlign: 'left', marginTop: 10}
    const varStyle = {fontWeight: 700, paddingRight: 10}

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
                            <table>
                                <thead>
                                <tr style={headerStyle}>
                                    <th>Parameter</th>
                                    <th>Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr style={{height: 10}}></tr>
                                <tr>
                                    <td style={varStyle}>display name</td>
                                    <td>{profile?.displayName}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>user id</td>
                                    <td>{user.uid}</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>user claims</td>
                                    <td>{userClaims.join(', ')}</td>
                                </tr>
                                {profile?.admin &&
                                    <tr>
                                        <td style={varStyle}>profile.admin</td>
                                        <td>true</td>
                                    </tr>
                                }

                                <tr style={{height: 10}}></tr>
                                <tr>
                                    <td style={headerStyle} colSpan={2}>SCORECARD</td>
                                </tr>
                                <tr>
                                    <td style={varStyle}>blackBeltAwarded</td>
                                    <td>{profile?.blackBeltAwardedAt ? 'true' : ''}</td>
                                </tr>
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