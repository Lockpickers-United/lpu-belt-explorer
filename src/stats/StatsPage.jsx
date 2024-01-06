import React from 'react'
import useWindowSize from '../util/useWindowSize'
import LockViewsLine from './LockViewsLine'
import SiteStats from './SiteStats.jsx'
import PhotoStats from './PhotoStats.jsx'

function StatsPage() {
    const {width} = useWindowSize()
    const smallWidth = width < 500
    const chartHeight = !smallWidth ? 350 : 300

    const headerStyle = {margin: '46px 0px 16px 0px', width: '100%', backgroundColor: '#000', textAlign:'center'}
    const firstHeaderStyle = {margin: '0px 0px 16px 0px', width: '100%', backgroundColor: '#000', textAlign:'center'}

    return (
        <React.Fragment>
            <div style={{
                minWidth: '390px', maxWidth: 720, height: '100%',
                padding: '24px', backgroundColor: '#000',
                marginLeft: 'auto', marginRight: 'auto',
                fontSize: '1.5rem'
            }}>

                <div style={firstHeaderStyle}>Site Stats</div>
                <SiteStats/>

                <div style={headerStyle}>Weekly Lock Views</div>
                <LockViewsLine chartHeight={chartHeight}/>

                <div style={headerStyle}>Photo Stats</div>
                <PhotoStats/>

                <div>&nbsp;</div>
            </div>
        </React.Fragment>
    )
}

export default StatsPage
