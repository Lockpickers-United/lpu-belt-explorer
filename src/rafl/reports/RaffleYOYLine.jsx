import {ResponsiveLine} from '@nivo/line'
import {primaryTheme} from '../../admin/adminChartDefaults'
import React from 'react'
import useWindowSize from '../../util/useWindowSize.jsx'

export default function RaffleYOYLine({chartHeight, chartdata, colors, curve}) {
    const {isMobile} = useWindowSize()

    const chartMargin = {top: 10, right: 20, bottom: 75, left: 50}


    const tickValues = isMobile ? 'every 2 days' : 'every day'
    const legendAnchor = 'bottom'

    const legendTranslateY = 75
    const legendTranslateX = 0

    return (
        <div style={{height: chartHeight, width: '100%'}}>
            <ResponsiveLine
                theme={primaryTheme}
                data={chartdata}
                enableGridX={false}
                enableGridY={false}
                colors={colors}
                lineWidth={3}
                margin={chartMargin}
                height={chartHeight}
                curve={curve ?? 'natural'}
                yScale={{
                    type: 'linear',
                    min: 0,
                    max: 'auto',
                    stacked: false,
                    reverse: false
                }}
                yFormat=' >-.0f'
                axisLeft={{
                    tickValues: 5,
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: ','
                }}
                xScale={{
                    type: 'time',
                    format: '%Y-%m-%d %H:%M:%S'
                }}
                xFormat='time:%m/%d/%y'
                axisBottom={{
                    format: '%b %d',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    direction: 'row',
                    legendOffset: -12,
                    tickValues: tickValues
                }}
                legends={[
                        {
                            anchor: legendAnchor,
                            itemTextColor: '#bbb',
                            direction: 'row',
                            justify: false,
                            translateX: legendTranslateX,
                            translateY: legendTranslateY,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 20,
                            symbolSize: 13,
                            symbolShape: 'circle'
                        }
                    ]
                }
                enablePoints={false}
                useMesh={true}
                isInteractive={true}
            />
        </div>
    )
}