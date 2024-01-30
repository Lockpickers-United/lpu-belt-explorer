import React from 'react'
import belts from '../data/belts'

function DanPoints({belt}) {
    const {danPoints} = belts[belt]
    const label = danPoints === 1
        ? 'Point'
        : (danPoints >= 10 ? 'Pts' : 'Points')
    const value = ` (${danPoints} Dan ${label})`
    const style = {textDecoration: 'none', color: '#fff'}

    if (danPoints === 0 || belt === 'Unranked') return null
    return <a style={style} href='/#/dans'>{value}</a>
}

export default DanPoints
