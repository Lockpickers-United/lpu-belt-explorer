import React, {useMemo} from 'react'
import belts from '../data/belts'

function BeltStripe({value = 'Unranked'}) {

    const bgColor = belts[value]
        ? belts[value].color
        : value.includes('Dan')
            ? '#769e49'
            : ''

    //const {color: backgroundColor} = belts[value] || {color: '#769e49'}
    const style = {
        width: 8,
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: bgColor
    }

    const {lineColor: stripeColor} = belts[value] || {}
    const stripes = useMemo(() => {
        const [stripeValue] = (value.match(/\d/) || [0])
        const stripeCount = +stripeValue
        if (stripeCount > 1) {
            return Array(stripeCount).fill(0)
                .map((_value, index) =>
                    <span key={index} style={{
                        width: 8,
                        height: 2,
                        position: 'absolute',
                        left: 0,
                        top: 18 + (index * 6),
                        backgroundColor: stripeColor
                    }}/>
                )
        }
    }, [value, stripeColor])

    if (value === 'Unranked') return null
    return (
        <React.Fragment>
            <span style={style}/>
            {stripes}
        </React.Fragment>
    )
}

export default React.memo(BeltStripe)


