import React from 'react'
import useWindowSize from '../../util/useWindowSize.jsx'
import SiteReport28DaysLine from './SiteReport28DaysLine.jsx'
import SiteReport7daysTable from './SiteReportSummaryTable.jsx'
import statsSiteFull from '../../data/statsSiteFull.json'

function SiteReportSummary() {

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
                    <SiteReport28DaysLine lineData={statsSiteFull}/>
                    <SiteReport7daysTable fullData={statsSiteFull}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SiteReportSummary
