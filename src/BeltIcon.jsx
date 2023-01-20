import React from 'react'
import beltIcons from './data/beltIcons.js'

function BeltIcon({belt, ...props}) {
    const fixedBelt = belt.startsWith('black') ? 'black' : belt.toLowerCase()
    return <img {...props} src={beltIcons[fixedBelt]} alt={belt} width={32}/>
}

export default BeltIcon
