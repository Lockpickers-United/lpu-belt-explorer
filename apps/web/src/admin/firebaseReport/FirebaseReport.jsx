import React from 'react'
import LoadingDisplay from '../../util/LoadingDisplay'
import usePageTitle from '../../util/usePageTitle'
import useWindowSize from '../../util/useWindowSize'
import useData from '../../util/useData.jsx'
import {nodeServerUrl} from '../../data/dataUrls'
import FirebaseDailyTable from './FirebaseDailyTable.jsx'
import FirebaseHourlyLine from './FirebaseHourlyLine.jsx'
import FirebaseSourceTable from './FirebaseSourceTable.jsx'

function FirebaseReport() {
    usePageTitle('Firebase Activity Report')
    const {data, loading, error} = useData({url: `${nodeServerUrl}/process-firebase-log`})

    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const headerStyle = {margin: '56px 0px 18px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const firstHeaderStyle = {margin: '0px 0px 36px 0px', width: '100%', textAlign: 'center', color: '#fff'}

    if (loading) return <LoadingDisplay/>
    if (error) return null
    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#292929',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight: 0.8
        }}>

            <div style={firstHeaderStyle}>
                Firebase Activity Report<br/>
            </div>
            <FirebaseDailyTable data={data} loading={loading} error={error}/>

            <div style={headerStyle}>Hourly Requests</div>
            <FirebaseHourlyLine data={data} loading={loading} error={error}/>

            <div style={headerStyle}>Requests by Source</div>
            <FirebaseSourceTable data={data}/>

        </div>
    )
}

export default FirebaseReport
