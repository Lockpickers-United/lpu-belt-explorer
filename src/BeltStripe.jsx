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
    const [stripeValue] = (value.match(/\d/) || [0])
    const stripeCount = +stripeValue
    let stripes = null
    if (stripeCount > 1) {
        stripes = Array(stripeCount).fill(0)
            .map((value, index) =>
                <span key={index} style={{
                    width: 8,
                    height: 2,
                    position: 'absolute',
                    left: 0,
                    top: 18 + (index * 6),
                    backgroundColor: '#acacac'
                }}/>
            )
    }
    return (
        <React.Fragment>
            <span style={style}/>
            {stripes}
        </React.Fragment>
    )
}

export default BeltStripe


