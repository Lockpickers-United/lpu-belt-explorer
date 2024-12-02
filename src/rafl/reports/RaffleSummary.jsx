import React from 'react'
import useWindowSize from '../../util/useWindowSize'
import RaffleReport28DaysLine from './RaffleReport28DaysLine.jsx'

function RaffleSummary({data}) {
    const {width} = useWindowSize()
    const smallWindow = width <= 560

    const divStyle = {
        width: '100%', padding: '0px', marginBottom: 12, alignItems: 'center',
        marginLeft: 'auto', marginRight: 'auto'
    }
    const divFlexStyle = !smallWindow ? {display: 'flex'} : {}
    const combinedDivStyle = {
        ...divStyle,
        ...divFlexStyle
    }

    //                    <SiteReport7daysTable fullData={data}/>

    return (
        <React.Fragment>
            <div style={{textAlign: 'center'}}>
                <div style={combinedDivStyle}>
                    <RaffleReport28DaysLine lineData={data}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default RaffleSummary
