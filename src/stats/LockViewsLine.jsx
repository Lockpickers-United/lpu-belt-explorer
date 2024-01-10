import React from 'react'
import {ResponsiveLine} from '@nivo/line'
import {primaryTheme} from './chartDefaults.js'
import siteStatsData from '../data/siteSummaryData.json'
import useWindowSize from '../util/useWindowSize.jsx'

function LockViewsLine() {
    const data = siteStatsData.lockViews

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const smallWindow = width <= 560

    const chartHeight = mobileSmall ? 260
        : !smallWindow ? 350 : 300

    return (
        <div style={{height: chartHeight}}>
            <ResponsiveLine
                theme={combinedTheme}
                data={data}
                colors={['#4fa720']}
                lineWidth={3}
                margin={{top: 10, right: 20, bottom: 50, left: 55}}
                xScale={{
                    type: 'time',
                    format: '%Y-%m-%d'
                }}
                xFormat='time:%m/%d/%y'
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                curve='natural'
                axisBottom={{
                    format: '%b',
                    tickValues: 'every 1 month',
                    legendOffset: -12
                }}
                axisLeft={{
                    tickSize: 0,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: ','
                }}
                enableGridX={false}
                enablePoints={false}
                useMesh={true}
                isInteractive={false}
            />
        </div>
    )
}

const gridTheme = {
    grid: {
        line: {
            stroke: '#333',
            strokeWidth: 1
        }
    }
}

const combinedTheme = {
    ...primaryTheme,
    ...gridTheme
}

export default LockViewsLine
