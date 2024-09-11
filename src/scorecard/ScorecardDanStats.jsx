import React, {useCallback, useContext} from 'react'
import ScoringExceptions from './ScoringExceptions.jsx'
import ScorecardDataContext from './ScorecardDataProvider'
import {useNavigate, useParams} from 'react-router-dom'
import Link from '@mui/material/Link'
import {enqueueSnackbar} from 'notistack'
import AuthContext from '../app/AuthContext.jsx'

export default function ScorecardDanStats({profile, owner}) {
    const {userId} = useParams()
    const {user} = useContext(AuthContext)

    const safeName = profile?.displayName?.replace(/\s/g, '_')

    const {
        cardDanPoints,
        cardBBCount,
        cardEligibleDan,
        cardNextDanPoints,
        cardNextDanLocks
    } = useContext(ScorecardDataContext)
    const navigate = useNavigate()

    const openUpgrades = useCallback(() => {
        navigate('/profile/scorecard/upgrades')
    }, [navigate])

    const suffixes = {1: 'st', 2: 'nd', 3: 'rd'}
    const requestLevel = suffixes[[cardEligibleDan]]
        ? cardEligibleDan + suffixes[[cardEligibleDan]]
        : cardEligibleDan + 'th'

    const copyRequest = useCallback(async () => {
        const link = `@LPUBeltBot request ${requestLevel} Dan https://lpubelts.com/#/profile/${userId || user?.uid}/scorecard?name=${safeName}`

        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Request copied to clipboard. Take it over to #belt-requests!')
    }, [requestLevel, safeName, user?.uid, userId])


    const danText = profile?.blackBeltAwardedAt > 0 && cardEligibleDan === 1
        ? 'DAN'
        : 'Eligible for Dan'

    return (
        <div style={{display: 'flex'}}>
            <div style={{
                textAlign: 'right', padding: '10px 12px 18px 0px', flexGrow: 1
            }}>
                <div style={{fontWeight: 700, marginBottom: 6}}>
                    {danText} <span style={{fontSize: '1.8rem', lineHeight: '1rem'}}>{cardEligibleDan}</span>
                </div>
                <div style={{marginBottom: 5}}>Dan Points <strong>{cardDanPoints}</strong></div>
                <div style={{marginBottom: 5}}>Black Belt Locks <strong>{cardBBCount}</strong></div>
                <div style={{fontSize: '0.85rem'}}>
                    {cardNextDanPoints} point{cardNextDanPoints !== 1 && 's'} and {cardNextDanLocks} BB
                    lock{cardNextDanLocks !== 1 && 's'} to next Dan
                </div>
                <div style={{margin: '10px 0px', fontSize: '0.85rem'}}>
                    {cardEligibleDan > 1 && owner &&
                        <span>
                            <Link onClick={copyRequest}
                                  style={{color: '#99c2e5', cursor: 'pointer'}}>Copy Request</Link>
                            &nbsp;•&nbsp;
                        </span>
                    }
                    <Link onClick={openUpgrades} style={{color: '#99c2e5', cursor: 'pointer'}}>Upgrades list</Link>
                </div>

            </div>
            <div style={{textAlign: 'right'}}>
                <ScoringExceptions/>
            </div>
        </div>

    )

}