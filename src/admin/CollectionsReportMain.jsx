import React, {useContext} from 'react'
import LoadingDisplay from '../util/LoadingDisplay'
import usePageTitle from '../util/usePageTitle'
import useWindowSize from '../util/useWindowSize'
import dayjs from 'dayjs'
import CollectionsSummaryTable from './collectionsReport/CollectionsSummaryTable'
import CollectionListAveragesBar from './collectionsReport/CollectionListAveragesBar'
import CollectionsListUsersSavesLine from './collectionsReport/CollectionsListUsersSavesLine'
import CollectionSavesByBeltBar from './collectionsReport/CollectionSavesByBeltBar'
import CollectionsLast28Table from './collectionsReport/CollectionsLast28Table'
import TopLocks from './collectionsReport/TopLocks'
import AwardsSummaryTable from './collectionsReport/AwardsSummaryTable.jsx'
import BeltCountMaxBar from './collectionsReport/BeltCountMaxBar.jsx'
import ReportsContext from './ReportsContext.jsx'

function CollectionsReportMain() {
    usePageTitle('Collection Report')

    const {data, loading, error} = useContext(ReportsContext)

    const updateTime = loading ? '--'
        : '(updated: ' + dayjs(data.collectionsFull.metadata.updatedDateTime).format('MM/DD/YY hh:mm') + ' PST)'


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
                <span style={{fontSize: '0.85rem'}}>{updateTime}</span>
            </div>

            <div style={headerStyle}>List Users</div>
            <CollectionsListUsersSavesLine/>

            <div style={headerStyle}>Average Items Per List</div>
            <CollectionListAveragesBar/>

            <div style={headerStyle}>List Details</div>
            <CollectionsSummaryTable/>

            <div style={headerStyle}>Awards Summary</div>
            <AwardsSummaryTable data={data}/>

            <div style={headerStyle}>Import Users by Belt</div>
            <BeltCountMaxBar/>

            <div style={headerStyle}>List Saves by Belt Ranking</div>
            <CollectionSavesByBeltBar/>

            <div style={headerStyle}>Last 14 Days</div>
            <CollectionsLast28Table/>

            <div style={headerStyle}>Top Locks</div>
            <TopLocks/>

        </div>
    )
}

export default CollectionsReportMain
