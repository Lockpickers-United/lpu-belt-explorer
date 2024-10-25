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
        cardNextDanPoints,
        cardNextDanLocks,
        cardActivity
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

    const danText = cardEligibleDan <= currentDanLevel
        ? 'DAN'
        : 'Eligible for Dan'

    const copyRequest = useCallback(async () => {
        const link = `@LPUBeltBot request ${addOrdinal(cardEligibleDan)} Dan https://lpubelts.com/#/profile/${userId || user?.uid}/scorecard?name=${safeName}`
        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Request copied to clipboard. Take it over to #belt-requests!')
    }, [cardEligibleDan, safeName, user?.uid, userId])


    return (
        <div style={{display: 'flex'}}>
            <div style={{
                textAlign: 'right', padding: '10px 0px 18px 0px', flexGrow: 1
            }}>
                <div style={{fontWeight: 700, marginBottom: 6}}>
                    {danText} <span style={{fontSize: '1.8rem', lineHeight: '1rem'}}>{displayDan}</span>
                </div>
                <div style={{marginBottom: 5}}>Dan Points <strong>{cardDanPoints}</strong></div>
                <div style={{marginBottom: 5}}>Black Belt Locks <strong>{cardBBCount}</strong></div>
                <div style={{fontSize: '0.85rem'}}>
                    {nextDan.points - cardDanPoints} point{cardNextDanPoints !== 1 && 's'} and {nextDan.bbLocks - cardBBCount} BB
                    lock{cardNextDanLocks !== 1 && 's'} to {addOrdinal(displayDan+1)} Dan
                </div>
                <div style={{margin: '10px 0px', fontSize: '0.85rem'}}>
                    {cardEligibleDan > currentDanLevel && owner &&
                        <span>
                            <Link onClick={copyRequest}
                                  style={{color: '#99c2e5', cursor: 'pointer'}}>Copy Request Text</Link>
                            &nbsp;•&nbsp;
                        </span>
                    }
                    <Link onClick={openUpgrades} style={{color: '#99c2e5', cursor: 'pointer'}}>Upgrades list</Link>
                </div>

            </div>
            <div style={{textAlign: 'right', minWidth:20}}>
                <ScoringExceptions/>
            </div>
        </div>

    )

    function addOrdinal(danLevel) {
        const ordinals = ['st', 'nd', 'rd', 'th']
        return danLevel + '' + ordinals[Math.min(4, danLevel) - 1]
    }

}