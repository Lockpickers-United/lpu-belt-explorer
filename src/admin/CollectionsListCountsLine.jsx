import React from 'react'
import {ResponsiveLine} from '@nivo/line'
import {primaryTheme} from './AdminChartDefaults.js'
import useWindowSize from '../util/useWindowSize.jsx'

const CollectionsListCountsLine = ({lineData}) => {

    const data = [lineData.ownLocks, lineData.pickedLocks, lineData.recordedLocks, lineData.wishlistLocks]

    const blueColors = ['#074674', '#085792', '#246497', '#628fc0',
        '#063b87', '#062f6b']

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

    return (
        <div style={{height: chartHeight, width: '100%'}}>
            <ResponsiveLine
                theme={combinedTheme}
                data={data}
                colors={blueColors}
                enableArea={true}
                lineWidth={1}
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
                    direction: 'row',
                    legendOffset: -12,
                    tickValues: 'every week'
                }}
                legends={[
                    {
                        anchor: 'bottom',
                        itemTextColor: '#666',
                        text: {
                            fontSize: 18 //not working
                        },
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
