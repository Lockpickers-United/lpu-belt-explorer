import React, {useCallback, useContext} from 'react'
import ScoringExceptions from './ScoringExceptions.jsx'
import ScorecardDataContext from './ScorecardDataProvider'
import {useNavigate} from 'react-router-dom'

export default function ScorecardDanStats() {
    const {cardDanPoints, cardBBCount, cardEligibleDan, cardNextDanPoints, cardNextDanLocks} = useContext(ScorecardDataContext)
    const navigate = useNavigate()

    const openUpgrades = useCallback(() => {
        navigate('/profile/scorecard/upgrades')
    }, [navigate])

    return (
        <div style={{display: 'flex'}}>
            <div style={{
                textAlign: 'right', padding: '10px 12px 18px 0px', flexGrow: 1
            }}>
                <div style={{fontWeight: 700, marginBottom: 6}}>
                    Eligible for Dan <span style={{fontSize: '1.8rem', lineHeight: '1rem'}}>{cardEligibleDan}</span>
                </div>
                <div style={{marginBottom: 5}}>Dan Points <strong>{cardDanPoints}</strong></div>
                <div style={{marginBottom: 5}}>Black Belt Locks <strong>{cardBBCount}</strong></div>
                <div style={{fontSize: '0.85rem'}}>
                    {cardNextDanPoints} point{cardNextDanPoints !== 1 && 's'} and {cardNextDanLocks} BB
                    lock{cardNextDanLocks !== 1 && 's'} until next Dan
                </div>
                <div style={{margin: '10px 0px', fontSize: '0.85rem'}}>
                    <a onClick={openUpgrades} style={{cursor: 'pointer'}}>Upgrades list</a></div>

            </div>
            <div style={{textAlign: 'right'}}>
                <ScoringExceptions/>
            </div>
        </div>

    )

}