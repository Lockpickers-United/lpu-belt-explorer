import React from 'react'
import useWindowSize from '../util/useWindowSize'
import LockViewsLine from './LockViewsLine'
import SiteStats from './SiteStats.jsx'
import PhotoStats from './PhotoStats.jsx'
import PopularAreas from './PopularAreas.jsx'
import BeltDistribution from './BeltDistribution.jsx'
import BrandBeltStats from './BrandBeltStats.jsx'
import LockingMechanisms from './LockingMechanisms.jsx'
import RedditBeltGrowth from './RedditBeltGrowth.jsx'

function StatsMainPage() {
    const {width} = useWindowSize()
    const smallWidth = width < 500
    const chartHeight = !smallWidth ? 350 : 300
    const pagePadding = !smallWidth
        ? '24px'
        : '8px'

    const headerStyle = {margin: '46px 0px 16px 0px', width: '100%', backgroundColor: '#000', textAlign:'center'}
    const firstHeaderStyle = {margin: '0px 0px 16px 0px', width: '100%', backgroundColor: '#000', textAlign:'center'}

    return (
        <React.Fragment>
            <div style={{
                minWidth: '390px', maxWidth: 720, height: '100%',
                padding: pagePadding, backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto',
                fontSize: '1.5rem'
            }}>
                <div style={firstHeaderStyle}>Site Stats</div>
                <SiteStats/>

                <div style={headerStyle}>Weekly Lock Views</div>
                <LockViewsLine chartHeight={chartHeight}/>

                <div style={headerStyle}>Popular Countries</div>
                <PopularAreas/>

                <div style={headerStyle}>Photo Stats</div>
                <PhotoStats/>

                <div style={headerStyle}>Belt Distribution</div>
                <BeltDistribution/>

                <div style={headerStyle}>Brand Lock Distribution By Belt</div>
                <BrandBeltStats/>

                <div style={headerStyle}>Locking Mechanisms</div>
                <LockingMechanisms/>

                <div style={headerStyle}>Reddit User Belt Rankings</div>
                <RedditBeltGrowth/>

                <div>&nbsp;</div>
                <img alt='stats' src={'https://images.lpubelts.com/i/stats.gif'} width={10} height={10}/>
            </div>
        </React.Fragment>
    )
}

export default StatsMainPage
