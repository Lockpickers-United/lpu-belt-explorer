import React, {useContext} from 'react'
import useWindowSize from '../util/useWindowSize'
import LockViewsLine from './LockViewsLine'
import SiteStats from './SiteStats'
import PhotoStats from './PhotoStats'
import PopularAreas from './PopularAreas'
import BeltDistribution from './BeltDistribution'
import LockingMechanisms from './LockingMechanisms'
import RedditBeltGrowth from './RedditBeltGrowth'
import CollectionStatsBar from './CollectionStatsBar'
import CollectionTopLocks from './CollectionTopLocks'
import HourlyRequestsLine from './HourlyRequestsLine'
import TrafficStats from './TrafficStats'
import BrandDistribution from './BrandDistribution'
import DBContext from '../app/DBContext.jsx'

function StatsMainPage({data}) {

    const {lockCollection} = useContext(DBContext)

    const {width} = useWindowSize()
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

            <div style={firstHeaderStyle}>Site Stats</div>
            <SiteStats data={data}/>

            <div style={headerStyle}>Weekly Lock Views</div>
            <LockViewsLine data={data.siteSummary}/>

            <div style={headerStyle}>Popular Countries</div>
            <PopularAreas data={data}/>

            <div style={headerStyle}>Photo Stats</div>
            <PhotoStats data={data}/>

            <div style={headerStyle}>Belt Distribution</div>
            <BeltDistribution data={data}/>

            <div style={headerStyle}>Brand Lock Distribution</div>
            <BrandDistribution data={data}/>

            <div style={headerStyle}>Locking Mechanisms</div>
            <LockingMechanisms data={data}/>

            <div style={headerStyle}>Reddit User Belt Rankings</div>
            <RedditBeltGrowth data={data}/>

            <div style={headerStyle}>Collection Stats</div>
            <CollectionStatsBar data={data} lockCollection={lockCollection} userText={'You'} collectionBarHeight={collectionBarHeight}/>

            <div style={headerStyle}>Collections Top Locks</div>
            <CollectionTopLocks data={data}/>

            <div style={headerStyle}>Hourly Traffic</div>
            <HourlyRequestsLine data={data}/>

            <div style={headerStyle}>Visits by Platform & Browser</div>
            <TrafficStats data={data}/>

        </div>
    )
}

export default StatsMainPage
