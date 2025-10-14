import React, {useMemo} from 'react'
import belts from '../data/belts'

function BeltStripeMini({value = 'Unranked', style = {}}) {

    const beltColor = value.replace(' Belt', '')
    const bgColor = beltColor.includes('Unranked')
        ? 'inherit'
        : belts[beltColor]
            ? belts[beltColor].color
            : beltColor.includes('Dan')
                ? '#769e49'
                : ''

    //const {color: backgroundColor} = belts[value] || {color: '#769e49'}
    const stripeStyle = {
        width: 4,
        height: '100%',
        position: 'relative',
        left: 0,
        top: 0,
        padding: 0
    }

    const {lineColor: stripeColor} = belts[beltColor] || {}
    const stripes = useMemo(() => {
        const [stripeValue] = (beltColor.match(/\d/) || [0])
        const stripeCount = +stripeValue
        if (stripeCount > 1) {
            return Array(stripeCount).fill(0)
                .map((_beltColor, index) =>
                    <div key={index} style={{
                        width: 4,
                        height: 2,
                        position: 'relative',
                        left: 0,
                        top: 8 + (index * 3),
                        backgroundColor: stripeColor
                        //backgroundColor: '#b00'
                    }}/>
                )
        }
    }, [beltColor, stripeColor])

    return (
        <div style={{height: '100%', padding: 0, backgroundColor: bgColor, ...style}}>
            <div style={stripeStyle}>{stripes}</div>
        </div>
    )
}

export default React.memo(BeltStripeMini)


