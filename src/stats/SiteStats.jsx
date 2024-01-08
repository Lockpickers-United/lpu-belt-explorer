import React from 'react'
import SsidChartIcon from '@mui/icons-material/SsidChart'
import SiteStatsTable from './SiteStatsTable.jsx'
import useWindowSize from '../util/useWindowSize'
import lockSummaryData from '../data/lockSummaryData.json'
import siteStatsData from '../data/siteSummaryData.json'

const SiteStats = () => {

    const {width} = useWindowSize()
    const smallWidth = width < 500
    const midWidth = width < 700
    const divStyle = !midWidth ? {display: 'flex', padding: '0xp 20px', maxWidth: 660} : {padding: '0xp 20px'}
    const divSpacing = !midWidth ? '10px' : !smallWidth ? '26px' : '26px'

    const lockCounts = lockSummaryData.lockCounts
    const siteData = siteStatsData

    return (
        <React.Fragment>
            <div style={{height: 10, backgroundColor: '#000', fontSize: '.1rem'}}>&nbsp;</div>

            <div style={divStyle}>
                <div style={{
                    border: '1px solid #666', padding: 12, flexGrow: 1,
                    margin: '10px 0px 0px 26px', minWidth: '180px', maxWidth: '306px', height: 140
                }}>

                    <div style={{
                        border: '1px solid #999', borderRadius: 20, paddingTop: 5, width: 40, height: 40,
                        margin: '-33px 0px 0px -33px', backgroundColor: '#000', textAlign: 'center'
                    }}>
                        <SsidChartIcon style={{fontSize: 'x-large'}}/>
                    </div>
                    <SiteStatsTable tableData={siteData.dailyAverages}/>
                </div>

                <div style={{
                    backgroundColor: '#000', border: '1px solid #666', padding: '18px 12px 12px 12px',
                    margin: `10px 0px 0px ${divSpacing}`, minWidth: '200px', maxWidth: '306px', height: 140
                }}>
                    <SiteStatsTable tableData={siteData.totals}/>
                </div>

                <div style={{
                    backgroundColor: '#000', border: '1px solid #666', padding: '18px 12px 12px 12px',
                    margin: `10px 0px 0px ${divSpacing}`, minWidth: '200px', maxWidth: '306px', height: 140
                }}>
                    <SiteStatsTable tableData={lockCounts}/>
                </div>
            </div>
        </React.Fragment>
    )
}

export default SiteStats