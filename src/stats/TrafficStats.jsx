import React from 'react'
import TrafficPie from './TrafficPie.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import siteStatsData from '../data/statsSiteSummary.json'

function TrafficStats() {

    const data = siteStatsData.trafficTotals

    const platformColors = ['#007de2', '#0367ba', '#005ba0', '#004fa4',
        '#063b87', '#062f6b']

    const browserColors = ['#c34100', '#b33600', '#a02d01', '#7d2900',
        '#6a2200', '#621d00', '#581d00']

    // saving this for later...
    // const greenColors = ['#009e01', '#008d01', '#007804', '#006604',
    //     '#005a04', '#004a02', '#003f01']

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
                    <TrafficPie dataset={data.platform} pieColors={platformColors}/>
                    <TrafficPie dataset={data.browser} pieColors={browserColors}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default TrafficStats
