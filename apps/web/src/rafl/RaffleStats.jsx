import React, {useContext} from 'react'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import dayjs from 'dayjs'
import {raflResponseDetails} from '../data/dataUrls'
import RaffleStatsPotTable from './RaffleStatsPotTable.jsx'
import RaffleStatsCharityTable from './RaffleStatsCharityTable.jsx'
import RaffleStatsHeader from './RaffleStatsHeader.jsx'
import RaffleHiddenDialog from './RaffleHiddenDialog.jsx'
import RaffleYOYLines from './reports/RaffleYOYLines.jsx'
import RaffleContext from './RaffleContext.jsx'

export default function RaffleStats() {
    usePageTitle('RAFL Stats')

    const {summary} = useContext(RaffleContext)

    const {data, loading, error} = useData({urls})
    const {raflResponseDetails} = data || {} //eslint-disable-line
    const {width, isMobile} = useWindowSize()
    const updateTime = loading ? '--'
        : '(updated: ' + dayjs(summary.updatedAt).format('MM/DD/YY hh:mm') + ')'

    const firstHeaderStyle = {
        margin: '26px 0px 18px 0px',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: '1.3rem',
        fontWeight: 700
    }
    const headerStyle = {
        margin: '46px 0px 18px 0px',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: '1.3rem',
        fontWeight: 700
    }

    const pagePadding = !isMobile
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const tableWidth = width <= 560
        ? width - 20
        : 640

    const nameLength = !isMobile ? 48 : 24

    if (loading) return <LoadingDisplay/>
    else if (error) return null
    return (
        <React.Fragment>
            <div style={{
                minWidth: '320px', maxWidth: 700, height: '100%',
                padding: pagePadding, backgroundColor: '#292929',
                marginLeft: 'auto', marginRight: 'auto'
            }}>
                <RaffleStatsHeader/>

                <div style={{width: '100%', textAlign: 'center', color: '#fff'}}>
                    <span style={{fontSize: '0.8rem', marginTop: 0}}>{updateTime}</span>
                </div>

                <RaffleYOYLines data={raflResponseDetails['detailedData']}/>

                <div style={firstHeaderStyle}>Pots</div>
                <RaffleStatsPotTable summary={summary} tableWidth={tableWidth} nameLength={nameLength}/>

                <div style={headerStyle}>Charities</div>
                <RaffleStatsCharityTable summary={summary} tableWidth={tableWidth} nameLength={nameLength}/>

            </div>
            <RaffleHiddenDialog/>
        </React.Fragment>
    )
}

const urls = {
    raflResponseDetails,
}
