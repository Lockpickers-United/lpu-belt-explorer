import React, {useEffect, useState} from 'react'
import useWindowSize from '../util/useWindowSize'
import CollectionsSummaryTable from './CollectionsSummaryTable.jsx'
import CollectionListAveragesBar from './CollectionListAveragesBar.jsx'
import CollectionsListUsersSavesLine from './CollectionsListUsersSavesLine.jsx'
import CollectionsListCountsLine from './CollectionsListCountsLine.jsx'
import CollectionSavesByBeltBar from './CollectionSavesByBeltBar.jsx'
import CollectionsLast28Table from './CollectionsLast28Table.jsx'
import {enqueueSnackbar} from 'notistack'
import Button from '@mui/material/Button'
import skeletonData from './collectionsSkeletonData.json'
import dayjs from 'dayjs'

const dataUrl = 'https://explore.lpubelts.com/data/statsCollectionsFull.json'

function CollectionsReportMain() {

    const [data, setData] = useState({data: [], metadata: {}})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            const response = await fetch(dataUrl)
            const value = await response.json()
            setData(value)
            setLoading(false)
        }
        try {
            load()
        } catch (ex) {
            console.error('Error loading collections data.', ex)
            enqueueSnackbar('Error loading collections data. Please reload the page.', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => window.location.reload()}>Refresh</Button>
            })
            setLoading(false)
        }
    }, [])

    const fullData = loading ? skeletonData : data

    const updateTime = loading ? '--'
        : '(updated: ' + dayjs(fullData.metadata.updatedDateTime).format('MM/DD/YY hh:mm') + ` ${fullData.metadata.timezone})`

    // build line data
    const dailyTableData = fullData.dailyTableData.data
    const metricsList = ['listUsers', 'wishlistLocks', 'recordedLocks', 'pickedLocks', 'ownLocks']
    const lineMetrics = new Map()
    metricsList.map((metricName) => {
        const metricHash = new Map()
        const metricData = []
        dailyTableData.map((value) => {
            const dataPoint = new Map()
            dataPoint['x'] = value['date']
            dataPoint['y'] = value[metricName]
            metricData.push(dataPoint)
        })
        metricHash['data'] = metricData
        metricHash['id'] = metricName
        lineMetrics[metricName] = metricHash
    })

    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const headerStyle = {margin: '46px 0px 18px 0px', width: '100%', textAlign: 'center'}
    const firstHeaderStyle = {margin: '0px 0px 36px 0px', width: '100%', textAlign: 'center'}

    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#efefef',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight:0.8
        }}>

            <div style={firstHeaderStyle}>
                Collections Summary<br/>
                <span style={{fontSize: '0.7rem'}}>{updateTime}</span>
            </div>
            <CollectionsSummaryTable fullData={fullData}/>

            <div style={headerStyle}>List Users</div>
            <CollectionsListUsersSavesLine lineData={lineMetrics}/>

            <div style={headerStyle}>List Locks by Date</div>
            <CollectionsListCountsLine lineData={lineMetrics}/>

            <div style={headerStyle}>Average Items Per List</div>
            <CollectionListAveragesBar fullData={fullData}/>

            <div style={headerStyle}>List Saves by Belt Ranking</div>
            <CollectionSavesByBeltBar fullData={fullData}/>

            <div style={headerStyle}>Last 28 Days</div>
            <CollectionsLast28Table fullData={fullData}/>

        </div>
    )
}

export default CollectionsReportMain
