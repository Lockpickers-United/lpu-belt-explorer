import React, {useMemo} from 'react'
import belts from '../data/belts'

function BeltStripe({value = 'Unranked', style = {}}) {

    const bgColor = belts[value]
        ? belts[value].color
        : value.includes('Dan')
            ? '#769e49'
            : ''

    //const {color: backgroundColor} = belts[value] || {color: '#769e49'}
    const fullStyle = {
        width: 4,
        height: '100%',
        position: 'relative',
        left: 0,
        top: 0,
        backgroundColor: bgColor,
        //backgroundColor: '#b00',
        padding:0,
        ...style
    }

    const {lineColor: stripeColor} = belts[value] || {}
    const stripes = useMemo(() => {
        const [stripeValue] = (value.match(/\d/) || [0])
        const stripeCount = +stripeValue
        if (stripeCount > 1) {
            return Array(stripeCount).fill(0)
                .map((value, index) =>
                    <div key={index} style={{
                        width: 4,
                        height: 2,
                        position: 'relative',
                        left: 0,
                        top: 8 + (index*3),
                        backgroundColor: stripeColor
                        //backgroundColor: '#b00'
                    }}/>
                )
        }
    }, [value, stripeColor])

    if (value === 'Unranked') return null
    return (
        <div style={{height: '100%', padding:0}}>
            <div style={fullStyle}>{stripes}</div>
        </div>
    )
}

export default React.memo(BeltStripe)


