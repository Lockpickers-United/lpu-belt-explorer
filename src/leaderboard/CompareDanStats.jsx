import React from 'react'

export default function CompareDanStats({userData}) {

    if (!userData) return null

    return (
            <div style={{
                textAlign: 'right', padding: '10px 12px 18px 0px', flexGrow: 1
            }}>
                <div style={{fontWeight: 700, marginBottom: 6}}>
                    Eligible for Dan <span style={{fontSize: '1.8rem', lineHeight: '1rem'}}>{userData['danLevel']}</span>
                </div>
                <div style={{marginBottom: 5}}>Dan Points <strong>{userData.danPoints}</strong></div>
                <div style={{marginBottom: 5}}>Eligible Black Belt Locks <strong>{userData.blackBeltCount}</strong></div>
                <div style={{marginBottom: 5}}>Unique Locks <strong>{userData.uniqueLocks}</strong></div>
            </div>
    )

}