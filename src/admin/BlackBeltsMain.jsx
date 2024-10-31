import React from 'react'
import LoadingDisplay from '../util/LoadingDisplay'
import useData from '../util/useData'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import dayjs from 'dayjs'
import CollectionsSummaryTable from './collectionsReport/CollectionsSummaryTable'
import CollectionListAveragesBar from './collectionsReport/CollectionListAveragesBar'
import CollectionsListUsersSavesLine from './collectionsReport/CollectionsListUsersSavesLine'
import CollectionsListCountsLine from './collectionsReport/CollectionsListCountsLine'
import CollectionSavesByBeltBar from './collectionsReport/CollectionSavesByBeltBar'
import CollectionsLast28Table from './collectionsReport/CollectionsLast28Table'
import TopLocks from './collectionsReport/TopLocks'
import {collectionsFullBB, leaderboardData2} from '../data/dataUrls'
import BlackBeltsTable from './blackBeltsReport/BlackBeltsTable.jsx'

function BlackBeltsMain() {
    usePageTitle('Black Belts Report')
    const {data, loading, error} = useData({urls})
    
    const collectionsData = data?.collectionsFullBB
    const blackBeltData = data?.leaderboardData2?.blackBelts

    const updateTime = loading ? '--'
        : '(updated: ' + dayjs(data?.leaderboardData2.metadata.updatedDateTime).format('MM/DD/YY hh:mm') + ')'

    // build line data
    const metricsList = ['listUsers', 'wishlistLocks', 'scorecardLocks', 'pickedLocks', 'ownLocks']

    const filteredData = collectionsData?.dailyTableData.data.filter(datum => dayjs(datum.date).isAfter(dayjs('2024-08-17')))

    const lineMetrics = metricsList.reduce((acc, metricName) => {
        if (!data) return {}
        const metricData = filteredData.map(value => ({
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
    if (error) return null
    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#292929',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight: 0.8
        }}>

            <div style={firstHeaderStyle}>
                Black Belt Report<br/>
                <span style={{fontSize: '0.85rem'}}>{updateTime}</span>
            </div>
            <BlackBeltsTable tableData={blackBeltData} collectionsData={collectionsData}/>

            <div style={headerStyle}>Collection Summary</div>
            <CollectionsSummaryTable data={collectionsData}/>

            <div style={headerStyle}>List Users</div>
            <CollectionsListUsersSavesLine data={lineMetrics}/>

            <div style={headerStyle}>List Locks by Date</div>
            <CollectionsListCountsLine data={lineMetrics}/>

            <div style={headerStyle}>Average Items Per List</div>
            <CollectionListAveragesBar data={collectionsData}/>

            <div style={headerStyle}>List Saves by Belt Ranking</div>
            <CollectionSavesByBeltBar data={collectionsData}/>

            <div style={headerStyle}>Last 28 Days</div>
            <CollectionsLast28Table data={collectionsData}/>

            <div style={headerStyle}>Top Locks</div>
            <TopLocks data={collectionsData}/>
        </div>
    )
}

const urls = {
    collectionsFullBB,
    leaderboardData2
}

export default BlackBeltsMain
