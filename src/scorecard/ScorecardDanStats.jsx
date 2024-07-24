import React from 'react'
import ScoringExceptions from './ScoringExceptions.jsx'
import dans from '../data/dans.json'

export default function ScorecardDanStats({cardDanPoints, cardBBCount}) {

    const eligibleDan = dans
        ? dans.filter(dan => {
            return (cardDanPoints >= dan.points) && (cardBBCount >= dan.bbLocks)
        }).pop()?.level
        : 0
    const nextDan = dans[eligibleDan + 1]
    const nextDanPoints = Math.max(0, (nextDan.points - cardDanPoints))
    const nextDanLocks = Math.max(0, (nextDan.bbLocks - cardBBCount))

    return (
        <div style={{display: 'flex'}}>
            <div style={{
                textAlign: 'right', padding: '10px 12px 18px 0px', flexGrow: 1
            }}>
                <div style={{fontWeight: 700, marginBottom: 6}}>
                    Eligible for Dan <span style={{fontSize: '1.8rem', lineHeight: '1rem'}}>{eligibleDan}</span>
                </div>
                <div style={{marginBottom: 5}}>Dan Points <strong>{cardDanPoints}</strong></div>
                <div style={{marginBottom: 5}}>Black Belt Locks <strong>{cardBBCount}</strong></div>
                <div style={{fontSize: '0.85rem'}}>
                    {nextDanPoints} point{nextDanPoints !== 1 && 's'} and {nextDanLocks} BB
                    lock{nextDanLocks !== 1 && 's'} until next Dan
                </div>
            </div>
            <div style={{textAlign: 'right'}}>
                <ScoringExceptions/>
            </div>
        </div>

    )

}