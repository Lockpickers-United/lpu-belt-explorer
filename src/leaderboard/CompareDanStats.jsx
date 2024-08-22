import React from 'react'
import useWindowSize from '../util/useWindowSize.jsx'

export default function CompareDanStats({userData}) {

    if (!userData) return null

    console.log(userData)
    const {isMobile} = useWindowSize()
    const danSize = !isMobile ? '1.8rem' : '1.3rem'
    const statsSize = !isMobile ? '1rem' : '0.83rem'
    const bbText = !isMobile ? 'Eligible Black Belt Locks' : 'BB Locks'
    const padding = !isMobile ? '10px 12px 18px 0px' : '10px 4px 18px 0px'


    return (
        <div style={{ placeItems: 'right'}}>
            <div style={{
                textAlign: 'right', padding: padding, backgroundColor: 'inherit', fontSize: statsSize
            }}>
                <div style={{fontWeight: 700, marginBottom: 6}}>
                    <nobr>Eligible for Dan <span
                        style={{fontSize: danSize, lineHeight: '1rem'}}>{userData['danLevel']}</span></nobr>
                </div>
                <div style={{marginBottom: 5}}><nobr>Dan Points <strong>{userData.danPoints}</strong></nobr></div>
                <div style={{marginBottom: 5}}><nobr>{bbText} <strong>{userData.blackBeltCount}</strong></nobr></div>
                <div style={{marginBottom: 5}}><nobr>Unique Locks <strong>{userData['uniqueLocks']}</strong></nobr></div>
                <div style={{marginBottom: 5}}><nobr>Masters Projects <strong>{userData['projects']}</strong></nobr></div>
            </div>
        </div>
    )

}