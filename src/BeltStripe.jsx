import React from 'react'
import belts from './data/belts.js'

function BeltStripe({value}) {
    const {color: backgroundColor} = belts[value]
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


