import React from 'react'
import LoadingDisplay from '../../util/LoadingDisplay'
import useData from '../../util/useData'
import usePageTitle from '../../util/usePageTitle'
import useWindowSize from '../../util/useWindowSize'
import dayjs from 'dayjs'
import {siteFullNew} from '../../data/dataUrls'
import LockViewsLine from '../../stats/LockViewsLine'
import PopularCountries from '../../admin/siteReport/PopularCountries'
import PopularAreas from '../../admin/siteReport/PopularAreas.jsx'
import ScreenWidthsTable from '../../admin/siteReport/ScreenWidthsTable.jsx'
import RaffleSummary from './RaffleSummary.jsx'
import RafflePageTrackingTable from './RafflePageTrackingTable.jsx'
import RafflePotTable from './RafflePotTable.jsx'

function RaffleReport() {
    usePageTitle('RAFL Report')
    const {data, loading, error} = useData({urls})
    const {siteFullNew} = data || {}
    const {width} = useWindowSize()
    const smallWindow = width < 560
    const pagePadding = !smallWindow
        ? '24px 24px 32px 24px'
        : '8px 8px 32px 8px'

    const firstHeaderStyle = {margin: '0px 0px 36px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const headerStyle = {margin: '46px 0px 18px 0px', width: '100%', textAlign: 'center', color: '#fff'}
    const summaryHeaderStyle = siteFullNew?.firstVistsLastSevenDays?.countryCount
        ? headerStyle
        : firstHeaderStyle

    const updateTime = loading ? '--'
        : '(updated: ' + dayjs(siteFullNew?.metadata.updatedDateTime).format('MM/DD/YY hh:mm') + ` ${siteFullNew?.metadata.timezone})`

    if (loading) return <LoadingDisplay/>
    else if (error) return null
    return (
        <div style={{
            minWidth: '320px', maxWidth: 900, height: '100%',
            padding: pagePadding, backgroundColor: '#292929',
            marginLeft: 'auto', marginRight: 'auto',
            fontSize: '1.5rem', lineHeight: 0.8
        }}>
            <div style={summaryHeaderStyle}>
                RAFL Summary<br/>
                <span style={{fontSize: '0.85rem'}}>{updateTime}</span>
            </div>
            <RaffleSummary data={siteFullNew}/>

            <div style={headerStyle}>Page Tracking</div>
            <RafflePageTrackingTable data={siteFullNew}/>

            <div style={headerStyle}>Pot Details</div>
            <RafflePotTable data={siteFullNew}/>

            <React.Fragment>
                {1 === 0 &&
                    <React.Fragment>

                        <div style={headerStyle}>Weekly Lock Views</div>
                        <LockViewsLine data={siteFullNew}/>

                        <div style={headerStyle}>Popular Areas</div>
                        <PopularAreas data={siteFullNew}/>

                        {!!siteFullNew.popularCountries1 &&
                            <React.Fragment>
                                <div style={headerStyle}>Popular Countries</div>
                                <PopularCountries data={siteFullNew}/>
                            </React.Fragment>
                        }

                        <div style={headerStyle}>Lock Views by Screen Width</div>
                        <ScreenWidthsTable data={siteFullNew}/>
                    </React.Fragment>
                }
            </React.Fragment>

        </div>
    )
}

const urls = {
    siteFullNew
}

export default RaffleReport
