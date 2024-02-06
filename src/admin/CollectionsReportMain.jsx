import React from 'react'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import useWindowSize from '../util/useWindowSize'
import CollectionsSummaryTable from './CollectionsSummaryTable'
import CollectionListAveragesBar from './CollectionListAveragesBar'
import CollectionsListUsersSavesLine from './CollectionsListUsersSavesLine'
import CollectionsListCountsLine from './CollectionsListCountsLine'
import CollectionSavesByBeltBar from './CollectionSavesByBeltBar'
import CollectionsLast28Table from './CollectionsLast28Table'
import dayjs from 'dayjs'

function CollectionsReportMain() {
    const {data, loading, error} = useData({url})

    const updateTime = loading ? '--'
        : '(updated: ' + dayjs(data.metadata.updatedDateTime).format('MM/DD/YY hh:mm') + ` ${data.metadata.timezone})`

    // build line data
    const metricsList = ['listUsers', 'wishlistLocks', 'recordedLocks', 'pickedLocks', 'ownLocks']
    const lineMetrics = metricsList.reduce((acc, metricName) => {
        if (!data) return {}
        const metricData = data.dailyTableData.data.map(value => ({
            x: value.date,
            y: value[metricName]
        }))

        acc[metricName] = {
            data: metricData,
            id: metricName
        }

        return acc
    }, {})

    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const headerStyle = {margin: '46px 0px 18px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const firstHeaderStyle = {margin: '0px 0px 36px 0px', width: '100%', textAlign: 'center', color: '#fff'}

    if (loading) return <LoadingDisplay/>
    else if (error) return null
    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#292929',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight: 0.8
        }}>

            <div style={firstHeaderStyle}>
                Collections Summary<br/>
                <span style={{fontSize: '0.7rem'}}>{updateTime}</span>
            </div>
            <CollectionsSummaryTable data={data}/>

            <div style={headerStyle}>List Users</div>
            <CollectionsListUsersSavesLine data={lineMetrics}/>

            <div style={headerStyle}>List Locks by Date</div>
            <CollectionsListCountsLine data={lineMetrics}/>

            <div style={headerStyle}>Average Items Per List</div>
            <CollectionListAveragesBar data={data}/>

            <div style={headerStyle}>List Saves by Belt Ranking</div>
            <CollectionSavesByBeltBar data={data}/>

            <div style={headerStyle}>Last 28 Days</div>
            <CollectionsLast28Table data={data}/>
        </div>
    )
}

const url = 'https://explore.lpubelts.com/data/statsCollectionsFullAdmin.json'

export default CollectionsReportMain
