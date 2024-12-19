import React from 'react'
import LoadingDisplay from '../../util/LoadingDisplay'
import useData from '../../util/useData'
import usePageTitle from '../../util/usePageTitle'
import useWindowSize from '../../util/useWindowSize'
import dayjs from 'dayjs'
import {siteFullNew, raflResponseDetails} from '../../data/dataUrls'
import RaffleSummary from './RaffleSummary.jsx'
import RafflePageTrackingTable from './RafflePageTrackingTable.jsx'
import RafflePotTable from './RafflePotTable.jsx'
import RaffleCharityTable from './RaffleCharityTable.jsx'
import RaffleReportHistoricalLines from './RaffleReportHistoricalLines.jsx'

function RaffleReport() {
    usePageTitle('RAFL Report')
    const {data, loading, error} = useData({urls})
    const {siteFullNew, raflResponseDetails} = data || {}
    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const firstHeaderStyle = {margin: '0px 0px 36px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const headerStyle = {margin: '46px 0px 18px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const summaryHeaderStyle = firstHeaderStyle

    const updateTime = loading ? '--'
        : '(updated: ' + dayjs(siteFullNew?.metadata.updatedDateTime).format('MM/DD/YY hh:mm') + ` ${siteFullNew?.metadata.timezone})`

    if (loading) return <LoadingDisplay/>
    else if (error) return null
    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#292929',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight: 0.8
        }}>
            <div style={summaryHeaderStyle}>
                RAFL Summary<br/>
                <span style={{fontSize: '0.85rem'}}>{updateTime}</span>
            </div>
            <RaffleSummary data={siteFullNew}/>

            <div style={headerStyle}>Totals Over Time</div>
            <RaffleReportHistoricalLines data={raflResponseDetails}/>

            <div style={headerStyle}>Page Tracking</div>
            <RafflePageTrackingTable data={siteFullNew}/>

            <div style={headerStyle}>Pot Details</div>
            <RafflePotTable data={siteFullNew}/>

            <div style={headerStyle}>Charity Details</div>
            <RaffleCharityTable data={siteFullNew}/>

        </div>
    )
}

const urls = {
    siteFullNew,
    raflResponseDetails
}

export default RaffleReport
