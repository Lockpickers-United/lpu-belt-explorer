import React, {useMemo} from 'react'
import belts from '../data/belts'

function BeltStripe({value}) {
    const {color: backgroundColor, lineColor} = belts[value] || {}
    const style = {
        width: 8,
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor
    }
    if (value === 'Unranked') {
        style.backgroundImage = `linear-gradient(-45deg, ${lineColor} 25%, ${backgroundColor} 25%, 
                ${backgroundColor} 50%, ${lineColor} 50%, ${lineColor} 75%, ${backgroundColor} 75%, 
                ${backgroundColor} 100%)`
        style.backgroundSize = '25px 35px'
    }

    const stripes = useMemo(() => {
        const [stripeValue] = (value.match(/\d/) || [0])
        const stripeCount = +stripeValue
        if (stripeCount > 1) {
            return Array(stripeCount).fill(0)
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
    }, [value])

    return (
        <React.Fragment>
            <span style={style}/>
            {stripes}
        </React.Fragment>
    )
}

export default React.memo(BeltStripe)


