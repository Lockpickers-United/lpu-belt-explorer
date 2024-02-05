import React from 'react'
import useWindowSize from '../util/useWindowSize'
import statsSiteFull from '../data/statsSiteFull.json'
import LockViewsLine from '../stats/LockViewsLine'
import FirstVisitsLastSevenTable from './siteReport/FirstVisitsLastSevenTable'
import PageTrackingTable from './siteReport/PageTrackingTable'
import SiteReportSummary from './siteReport/SiteReportSummary'

function SiteReportMain() {

    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const firstHeaderStyle = {margin: '0px 0px 36px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const headerStyle = {margin: '46px 0px 18px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const summaryHeaderStyle = statsSiteFull.firstVistsLastSevenDays.countryCount
        ? headerStyle
        : firstHeaderStyle

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
                </React.Fragment>
            }

            <React.Fragment>
                <div style={summaryHeaderStyle}>Site Summary<br/></div>
                <SiteReportSummary/>
            </React.Fragment>

            <div style={headerStyle}>Weekly Lock Views</div>
            <LockViewsLine/>

            <div style={headerStyle}>Page Tracking</div>
            <PageTrackingTable fullData={statsSiteFull}/>

        </div>
    )
}

export default SiteReportMain
