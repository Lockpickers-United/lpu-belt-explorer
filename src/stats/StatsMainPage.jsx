import React from 'react'
import useWindowSize from '../util/useWindowSize'
import LockViewsLine from './LockViewsLine'
import SiteStats from './SiteStats.jsx'
import PhotoStats from './PhotoStats.jsx'
import PopularAreas from './PopularAreas.jsx'
import BeltDistribution from './BeltDistribution.jsx'
import LockingMechanisms from './LockingMechanisms.jsx'
import RedditBeltGrowth from './RedditBeltGrowth.jsx'
import CollectionStatsBar from './CollectionStatsBar.jsx'
import CollectionTopLocks from './CollectionTopLocks.jsx'
import HourlyRequestsLine from './HourlyRequestsLine.jsx'
import TrafficStats from './TrafficStats.jsx'
import BrandDistribution from './BrandDistribution.jsx'

function StatsMainPage() {
    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

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
            <SiteStats/>

            <div style={headerStyle}>Weekly Lock Views</div>
            <LockViewsLine/>

            <div style={headerStyle}>Popular Countries</div>
            <PopularAreas/>

            <div style={headerStyle}>Photo Stats</div>
            <PhotoStats/>

            <div style={headerStyle}>Belt Distribution</div>
            <BeltDistribution/>

            <div style={headerStyle}>Brand Lock Distribution</div>
            <BrandDistribution/>

            <div style={headerStyle}>Locking Mechanisms</div>
            <LockingMechanisms/>

            <div style={headerStyle}>Reddit User Belt Rankings</div>
            <RedditBeltGrowth/>

            <div style={headerStyle}>Collection Stats</div>
            <CollectionStatsBar/>

            <div style={headerStyle}>Collections Top Locks</div>
            <CollectionTopLocks/>

            <div style={headerStyle}>Hourly Traffic</div>
            <HourlyRequestsLine/>

            <div style={headerStyle}>Visits by Platform & Browser</div>
            <TrafficStats/>

        </div>
    )
}

export default StatsMainPage
