import React from 'react'
import LoadingDisplay from '../../util/LoadingDisplay'
import useData from '../../util/useData'
import usePageTitle from '../../util/usePageTitle'
import useWindowSize from '../../util/useWindowSize'
import dayjs from 'dayjs'
import {siteFullNew, raflResponseDetails, raflSiteStats2025} from '../../data/dataUrls'
import RaffleSummary from './RaffleSummary.jsx'
import RafflePageTrackingTable from './RafflePageTrackingTable.jsx'
import RafflePotTable from './RafflePotTable.jsx'
import RaffleCharityTable from './RaffleCharityTable.jsx'
import RaffleReportHistoricalLines from './RaffleReportHistoricalLines.jsx'
import RaffleStatsHeader from '../RaffleStatsHeader.jsx'
import RaffleBeltDistribution from './RaffleBeltDistribution.jsx'
import RaffleYOYLines from './RaffleYOYLines.jsx'

function RaffleReport() {
    usePageTitle('RAFL Report')

    //TODO: switch back to main site stats file for 2026

    const {data, loading, error} = useData({urls})
    const {siteFullNew, raflResponseDetails, raflSiteStats2025} = data || {} //eslint-disable-line
    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const firstHeaderStyle = {
        margin: '0px 0px 36px 0px',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: '1.3rem',
        fontWeight: 700
    }
    const headerStyle = {
        margin: '46px 0px 18px 0px', width: '100%', textAlign: 'center', color: '#fff', fontSize: '1.3rem',
        fontWeight: 700
    }
    const summaryHeaderStyle = firstHeaderStyle

    const updateTime = loading ? '--'
        : '(updated: ' + dayjs(raflResponseDetails?.metadata['updatedDateTime']).format('MM/DD/YY hh:mm') + ')'

    if (loading) return <LoadingDisplay/>
    else if (error) return null
    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#292929',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.0rem'
        }}>
            <div style={summaryHeaderStyle}>
                RAFL REPORT<br/>
                <span style={{fontSize: '0.85rem'}}>{updateTime}</span>
            </div>

            <RaffleStatsHeader animate={false}/>

            <div style={firstHeaderStyle}>Totals Over Time</div>
            <RaffleYOYLines data={raflResponseDetails?.detailedData}/>
            <RaffleReportHistoricalLines data={raflResponseDetails?.detailedData}/>

            <div style={headerStyle}>Site Traffic</div>
            <RaffleSummary data={raflSiteStats2025}/>

            <div style={headerStyle}>Belt Distribution</div>
            <RaffleBeltDistribution data={raflResponseDetails?.summaryData}/>

            <div style={headerStyle}>Page Tracking</div>
            <RafflePageTrackingTable data={raflSiteStats2025}/>

            <div style={headerStyle}>Pot Details</div>
            <RafflePotTable statsData={raflSiteStats2025}/>

            <div style={headerStyle}>Charity Details</div>
            <RaffleCharityTable data={raflSiteStats2025}/>

        </div>
    )
}

const urls = {
    siteFullNew,
    raflSiteStats2025,
    raflResponseDetails
}

export default RaffleReport
