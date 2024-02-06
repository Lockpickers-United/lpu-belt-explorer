import React from 'react'
import useWindowSize from '../../util/useWindowSize'
import SiteReport28DaysLine from './SiteReport28DaysLine'
import SiteReport7daysTable from './SiteReportSummaryTable'

function SiteReportSummary({data}) {
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

    return (
        <React.Fragment>
            <div style={{textAlign: 'center'}}>
                <div style={combinedDivStyle}>
                    <SiteReport28DaysLine lineData={data}/>
                    <SiteReport7daysTable fullData={data}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SiteReportSummary
