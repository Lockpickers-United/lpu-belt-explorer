import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize'
import LockViewsLine from './LockViewsLine'
import SiteStats from './SiteStats'
import PhotoStats from './PhotoStats'
import BeltDistribution from './BeltDistribution'
import RedditBeltGrowth from './RedditBeltGrowth'
import CollectionStatsBar from './CollectionStatsBar'
import CollectionTopLocks from './CollectionTopLocks'
import HourlyRequestsLine from './HourlyRequestsLine'
import TrafficStats from './TrafficStats'
import BrandDistribution from './BrandDistribution'
import DBContext from '../app/DBContext.jsx'
import LockingMechanismsByBelt from './LockingMechanismsByBelt.jsx'
import PlatformBeltCountsChart from './PlatformBeltCountsChart.jsx'
import PlatformBeltCountsTable from './PlatformBeltCountsTable.jsx'

function StatsMainPage({data}) {

    const {lockCollection} = useContext(DBContext)

    const {width, flexStyle} = useWindowSize()
    const mobileSmall = width <= 360
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const collectionBarHeight = !smallWindow ? 320 : !mobileSmall ? 230 : 200
    const headerStyle = {margin: '46px 0px 26px 0px', width: '100%', backgroundColor: '#000', textAlign: 'center'}
    const firstHeaderStyle = {margin: '0px 0px 26px 0px', width: '100%', backgroundColor: '#000', textAlign: 'center'}

    return (
        <div style={{
            minWidth: '320px', maxWidth: 720, height: '100%',
            padding: pagePadding, backgroundColor: '#000',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem'
        }}>

            <div style={firstHeaderStyle} role='heading' aria-label='Site Stats'>Site Stats</div>
            <SiteStats data={data}/>

            <div style={headerStyle} role='heading'>Weekly Lock Views</div>
            <LockViewsLine data={data.siteFullNew}/>

            <div style={headerStyle} role='heading'>Photo Stats</div>
            <PhotoStats data={data}/>

            <div style={headerStyle} role='heading'>Belt Distribution</div>
            <BeltDistribution data={data}/>

            <div style={headerStyle} role='heading'>Brand Lock Distribution</div>
            <BrandDistribution data={data}/>

            <div style={headerStyle} role='heading'>Locking Mechanisms By Belt</div>
            <LockingMechanismsByBelt data={data}/>

            <div style={headerStyle} role='heading'>
                Discord & Reddit Belt Distribution
            </div>
            <div style={{display: flexStyle, marginTop: 0, justifyItems: 'center', backgroundColor: '#000'}}>
                <PlatformBeltCountsTable data={data}/>
                <PlatformBeltCountsChart data={data}/>
            </div>

            <div style={headerStyle} role='heading'>Reddit Belts Over Time</div>
            <RedditBeltGrowth data={data}/>

            <div style={headerStyle} role='heading'>Collection Stats</div>
            <CollectionStatsBar data={data} lockCollection={lockCollection} userText={'You'}
                                collectionBarHeight={collectionBarHeight}/>

            <div style={headerStyle} role='heading'>Collections Top Locks</div>
            <CollectionTopLocks data={data}/>

            <div style={headerStyle} role='heading'>Hourly Traffic</div>
            <HourlyRequestsLine data={data}/>

            <div style={headerStyle} role='heading'>Visits by Platform & Browser</div>
            <TrafficStats data={data}/>

        </div>
    )
}

export default StatsMainPage
