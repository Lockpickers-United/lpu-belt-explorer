import React from 'react'
import {ResponsiveLine} from '@nivo/line'
import {primaryTheme} from './chartDefaults'
import useWindowSize from '../util/useWindowSize'

function LockViewsLine({data}) {
    const {lockViews} = data

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const smallWindow = width <= 560

    const chartHeight = mobileSmall ? 260
        : !smallWindow ? 350 : 300
    const tickRotation = !smallWindow ? 0 : -45
    const lineWidth = !smallWindow ? 3 : 2

    return (
        <div style={{height: chartHeight}}>
            <ResponsiveLine
                theme={combinedTheme}
                data={lockViews}
                colors={['#4fa720']}
                lineWidth={lineWidth}
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
                    tickValues: 'every 2 month',
                    legendOffset: -12,
                    tickRotation: tickRotation,
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
                isInteractive={true}
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
