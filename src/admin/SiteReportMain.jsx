import React from 'react'
import useWindowSize from '../util/useWindowSize'
import statsSiteSummary from '../data/statsSiteSummary.json'
import statsSiteFull from '../data/statsSiteFull.json'
import SiteReport28DaysLine from './siteReport/SiteReport28DaysLine.jsx'
import LockViewsLine from '../stats/LockViewsLine.jsx'
import FirstVisitsLastSevenTable from './siteReport/FirstVisitsLastSevenTable.jsx'
import PageTrackingTable from './siteReport/PageTrackingTable.jsx'

function SiteReportMain() {
    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const firstHeaderStyle = {margin: '0px 0px 36px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const headerStyle = {margin: '46px 0px 18px 0px', width: '100%', textAlign: 'center', color: '#fff'}

    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#292929',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight: 0.8
        }}>
            {!!statsSiteFull.firstVistsLastSevenDays.countryCount &&
                <React.Fragment>
                    <div style={firstHeaderStyle}>First Visits (Last Seven Days)</div>
                    <FirstVisitsLastSevenTable fullData={statsSiteFull} tableWidth={'50%'}/>

                    <div style={headerStyle}>Site Summary Report<br/></div>
                    <SiteReport28DaysLine lineData={statsSiteSummary}/>
                </React.Fragment>
            }

            {!statsSiteFull.firstVistsLastSevenDays.countryCount &&
                <React.Fragment>
                    <div style={firstHeaderStyle}>Site Summary Report<br/></div>
                    <SiteReport28DaysLine lineData={statsSiteSummary}/>
                </React.Fragment>
            }

            <div style={headerStyle}>Weekly Lock Views</div>
            <LockViewsLine/>

            <div style={headerStyle}>Page Tracking</div>
            <PageTrackingTable fullData={statsSiteFull}/>
        </div>
    )
}

export default SiteReportMain
