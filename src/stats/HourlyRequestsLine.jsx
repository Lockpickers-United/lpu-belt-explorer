import React from 'react'
import {ResponsiveLine} from '@nivo/line'
import {primaryTheme} from './chartDefaults'
import useWindowSize from '../util/useWindowSize'

function HourlyRequestsLine({data}) {
    const {hourlyRequests} = data.siteSummary

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const smallWindow = width <= 560

    const chartHeight =
        mobileSmall ? 230
            : mobileMedium ? 270
                : smallWindow ? 290
                    : 350

    const tickValueSet = !smallWindow
        ? ['midnight', '1 am', '2 am', '3 am', '4 am', '5 am', '6 am',
            '7 am', '8 am', '9 am', '10 am', '11 am', 'noon', '1 pm', '2 pm', '3 pm',
            '4 pm', '5 pm', '6 pm', '7 pm', '8 pm', '9 pm', '10 pm', '11 pm']
        : ['midnight', '2 am', '4 am', '6 am', '8 am', '10 am', 'noon', '2 pm', '4 pm', '6 pm', '8 pm', '10 pm']

    return (
        <div style={{height: chartHeight}}>
            <ResponsiveLine
                theme={combinedTheme}
                data={hourlyRequests}
                colors={['#007de2', '#16325d']}
                lineWidth={3}
                margin={{top: 10, right: 20, bottom: 75, left: 55}}
                curve='natural'
                xScale={{
                    type: 'point'
                }}
                yScale={{
                    type: 'linear',
                    min: 0,
                    max: 'auto',
                    stacked: false,
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
                axisBottom={{
                    tickValues: tickValueSet,
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    direction: 'row'
                }}
                legends={[
                    {
                        anchor: 'bottom',
                        itemTextColor: '#ddd',
                        text: {
                            fontSize: 18 //not working
                        },
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 75,
                        itemsSpacing: 0,
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

export default HourlyRequestsLine
