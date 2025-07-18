import React, {useCallback, useContext} from 'react'
import ScoringExceptions from './ScoringExceptions.jsx'
import ScorecardDataContext from './ScorecardDataProvider'
import {useNavigate, useParams} from 'react-router-dom'
import Link from '@mui/material/Link'
import {enqueueSnackbar} from 'notistack'
import AuthContext from '../app/AuthContext.jsx'
import {getAwardEntryFromId} from '../entries/entryutils'
import Dans from '../data/dans.json'

export default function ScorecardDanStats({profile, owner}) {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)

    const safeName = profile?.displayName?.replace(/\s/g, '_')
    const navigate = useNavigate()
    const openUpgrades = useCallback(() => {
        navigate('/profile/scorecard/upgrades')
    }, [navigate])

    const {
        cardDanPoints,
        cardBBCount,
        cardEligibleDan,
        cardNextDanLocks,
        cardUniqueLocks,
        cardActivity,
        cardMaxBelt
    } = useContext(ScorecardDataContext)

    const currentDanLevel = cardActivity.reduce((acc, activity) => {
        const award = getAwardEntryFromId(activity.matchId)
        acc = award?.awardType === 'dan'
            ? Math.max(acc, award.rank)
            : acc
        return acc
    }, 0)
    const displayDan = Math.max(cardEligibleDan, currentDanLevel)

    const nextDan = Dans.find(dan => dan.level === displayDan + 1)

    const danPreText = cardEligibleDan <= currentDanLevel
        ? ''
        : 'Eligible for '

    const danPostText = cardEligibleDan <= currentDanLevel
        ? 'DAN'
        : 'DAN'

    const copyRequest = useCallback(async () => {
        const link = `@LPUBeltBot request ${addOrdinal(cardEligibleDan)} Dan https://lpubelts.com/#/profile/${userId || user?.uid}/scorecard?name=${safeName}`
        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Request copied to clipboard. Take it over to #belt-requests!')
    }, [cardEligibleDan, safeName, user?.uid, userId])

    const nextBBLocks = currentDanLevel < 20 ? Math.max(0, nextDan?.bbLocks - cardBBCount) : 0
    const nextBBPoints = currentDanLevel < 20 ? Math.max(0, nextDan?.points - cardDanPoints) : 0

    return (
        <div style={{display: 'flex'}}>
            <div style={{
                textAlign: 'right', padding: '10px 0px 18px 0px', flexGrow: 1
            }}>
                {cardEligibleDan > 0
                    ? <div style={{fontWeight: 700, marginBottom: 6}}>
                        {danPreText} <span
                        style={{
                            fontSize: '1.8rem',
                            lineHeight: '1rem'
                        }}>{addOrdinal(displayDan)}</span> {danPostText}
                    </div>
                    : <div style={{fontWeight: 700, marginBottom: 6, marginTop:8}}>
                                <span
                                    style={{
                                        fontSize: '1.8rem',
                                        lineHeight: '1rem'
                                    }}>{cardMaxBelt?.name}</span>
                    </div>
                }

                {profile.danLevel > 0 &&
                    <div style={{marginBottom: 5}}>Dan Points <strong>{cardDanPoints}</strong></div>
                }
                <div style={{marginBottom: 5}}>Unique Locks <strong>{cardUniqueLocks}</strong></div>
                <div style={{marginBottom: 5}}>Black Belt Locks <strong>{cardBBCount}</strong></div>

                {currentDanLevel > 0 && currentDanLevel < 20 &&
                    <React.Fragment>
                        <div style={{fontSize: '0.85rem'}}>
                            {nextBBPoints} point{nextBBPoints !== 1 && 's'} and {nextBBLocks} BB
                            lock{cardNextDanLocks !== 1 && 's'} to {addOrdinal(displayDan + 1)} Dan
                        </div>
                        <div style={{margin: '10px 0px', fontSize: '0.85rem'}}>
                            {cardEligibleDan > currentDanLevel && owner &&
                                <span>
                                        <Link onClick={copyRequest}
                                              style={{color: '#99c2e5', cursor: 'pointer'}}>Copy Request Text</Link>
                                    &nbsp;•&nbsp;
                                    </span>
                            }
                            <Link onClick={openUpgrades} style={{color: '#99c2e5', cursor: 'pointer'}}>Upgrades
                                list</Link>
                        </div>
                    </React.Fragment>
                }

                {currentDanLevel === 20 &&
                    <div style={{fontSize: '0.85rem'}}>
                        You&#39;ve reached the highest Dan level. Congratulations!
                    </div>
                }

                    </div>
            <div style={{textAlign: 'right', minWidth: 20}}>
                <ScoringExceptions/>
            </div>
        </div>
    )

    function addOrdinal(danLevel) {
        const ordinals = ['st', 'nd', 'rd', 'th']
        return danLevel + '' + ordinals[Math.min(4, danLevel) - 1]
    }

}