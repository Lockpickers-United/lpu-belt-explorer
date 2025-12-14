import React, {useContext} from 'react'
import LoadingDisplay from '../../util/LoadingDisplay'
import useData from '../../util/useData'
import usePageTitle from '../../util/usePageTitle'
import useWindowSize from '../../util/useWindowSize'
import dayjs from 'dayjs'
import {raflResponseDetails, raflSiteStats} from '../../data/dataUrls'
import RaffleSummary from './RaffleSummary.jsx'
import RafflePageTrackingTable from './RafflePageTrackingTable.jsx'
import RaffleReportsPotTable from './RaffleReportsPotTable.jsx'
import RaffleReportsCharityTable from './RaffleReportsCharityTable.jsx'
import RaffleReportDonationsDonorsLines from './RaffleReportDonationsDonorsLines.jsx'
import RaffleStatsHeader from '../RaffleStatsHeader.jsx'
import RaffleBeltDistribution from './RaffleBeltDistribution.jsx'
import RaffleYOYLines from './RaffleYOYLines.jsx'
import RaffleContext from '../RaffleContext.jsx'

function RaffleReport() {
    usePageTitle('RAFL Report')

    //TODO: switch back to main site stats file for 2026

    const {data, loading, error} = useData({urls})
    const {raflResponseDetails, raflSiteStats} = data || {} //eslint-disable-line
    const {allPots} = useContext(RaffleContext)

    const {summary} = useContext(RaffleContext)

    console.log('summary', summary)

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
            <RaffleYOYLines/>
            <RaffleReportDonationsDonorsLines data={summary}/>

            <div style={headerStyle}>Site Traffic</div>
            <RaffleSummary data={raflSiteStats}/>

            <div style={headerStyle}>Belt Distribution</div>
            <RaffleBeltDistribution data={summary}/>

            <div style={headerStyle}>Page Tracking</div>
            <RafflePageTrackingTable data={raflSiteStats}/>

            <div style={headerStyle}>Pot Details</div>
            <RaffleReportsPotTable statsData={raflSiteStats} allPots={allPots}/>

            <div style={headerStyle}>Charity Details</div>
            <RaffleReportsCharityTable/>


        </div>
    )
}

const urls = {
    raflSiteStats,
    raflResponseDetails
}

export default RaffleReport
