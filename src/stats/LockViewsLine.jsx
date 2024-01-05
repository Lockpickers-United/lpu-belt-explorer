import React, {useContext} from 'react'
import {ResponsiveLine} from '@nivo/line'
import merge from 'lodash.merge'
import {primaryTheme} from './chartDefaults.js'
import siteStatsData from './siteStatsData.json'
import DataContext from '../locks/DataContext.jsx'

const LockViewsLine = () => {

    const data = siteStatsData.lockViews

    const {chartHeight} = useContext(DataContext)
    const gridTheme = {
        grid: {
            line: {
                stroke: '#333',
                strokeWidth: 1
            }
        }
    }
    const combinedTheme = merge({}, primaryTheme, gridTheme)

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
                    format: '%m/%d/%Y'
                    //precision: 'month'
                }}
                xFormat='time:%Y-%m-%d'
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

export default LockViewsLine
