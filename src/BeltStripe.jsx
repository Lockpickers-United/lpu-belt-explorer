import React from 'react'
import beltColors from './data/beltColors.js'

function BeltStripe({value}) {
    const color = value.toLowerCase().replace(/\s/g, '')
    const backgroundColor = beltColors[color]
    const style = {
        width: 8,
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor
    }
    return <span style={style}/>
}

export default BeltStripe


