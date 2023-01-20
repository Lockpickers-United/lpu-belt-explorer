import React from 'react'
import beltIcons from './data/beltIcons.js'

function BeltIcon({belt}) {
    const fixedBelt = belt.startsWith('Black') ? 'black' : belt.toLowerCase()
    return <img src={beltIcons[fixedBelt]} alt={belt} width={32}/>
}

export default BeltIcon
