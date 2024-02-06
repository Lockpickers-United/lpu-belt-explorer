import React from 'react'
import {ResponsiveLine} from '@nivo/line'
import {primaryTheme} from './adminChartDefaults'
import useWindowSize from '../util/useWindowSize'

const CollectionsListCountsLine = ({data}) => {
    const lineData = [
        data.ownLocks,
        data.pickedLocks,
        data.recordedLocks,
        data.wishlistLocks
    ]

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560
    const midWindow = width <= 820

    const chartHeight =
        mobileSmall ? 200
            : mobileMedium ? 220
                : mobileLarge ? 230
                    : midWindow ? 260
                        : 290

    const tickRotation = !smallWindow ? 0 : -45

    const chartMargin = {top: 10, right: 20, bottom: 65, left: 50}

    const areaColors = ['#172072', '#2e399b', '#444fb2', '#5966da']

    return (
        <div style={{height: chartHeight, width: '100%'}}>
            <ResponsiveLine
                theme={combinedTheme}
                data={lineData}
                colors={areaColors}
                enableArea={true}
                areaOpacity={1}

                lineWidth={2}
                margin={chartMargin}
                curve='natural'
                yScale={{
                    type: 'linear',
                    min: 0,
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                yFormat=' >-.2f'
                axisLeft={{
                    tickValues: 5,
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: ','
                }}
                xScale={{
                    type: 'time',
                    format: '%Y-%m-%d'
                }}
                xFormat='time:%m/%d/%y'
                enableGridX={false}
                enableGridY={false}

                axisBottom={{
                    format: '%b %d',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: tickRotation,
                    tickValues: 'every week'
                }}
                legends={[
                    {
                        anchor: 'bottom',
                        itemTextColor: '#666',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 65,
                        itemsSpacing: 6,
                        itemWidth: 100,
                        itemHeight: 20,
                        symbolSize: 13,
                        symbolShape: 'circle'
                    }
                ]}
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

export default CollectionsListCountsLine
