import React from 'react'
import belts from '../data/belts'

function DanPoints({belt}) {
    const {danPoints} = belts[belt]
    const label = danPoints === 1
        ? 'Point'
        : (danPoints >= 10 ? 'Pts' : 'Points')
    const value = ` (${danPoints} Dan ${label})`

    if (danPoints === 0 || belt === 'Unranked') return null
    return <span>{value}</span>
}

export default DanPoints
