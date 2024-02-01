import React from 'react'
import useWindowSize from '../util/useWindowSize'
import statsSiteSummary from '../data/statsSiteSummary.json'
import SiteReport28DaysLine from './siteReport/SiteReport28DaysLine.jsx'

function CollectionsReportMain() {

    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const firstHeaderStyle = {margin: '0px 0px 36px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const headerStyle = {margin: '46px 0px 18px 0px', width: '100%', textAlign: 'center', color: '#fff'}

    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#222',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight: 0.8
        }}>

            <div style={firstHeaderStyle}>Site Summary Report<br/></div>
            <SiteReport28DaysLine lineData={statsSiteSummary}/>

        </div>
    )
}

export default CollectionsReportMain
