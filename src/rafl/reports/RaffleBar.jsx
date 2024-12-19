import React from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {primaryTheme} from '../../admin/adminChartDefaults'
import dayjs from 'dayjs'

const RaffleBar = ({data}) => {

    console.log('data', data)

    const barData = data.map(day => {
        return {
            id: dayjs(day.x).format('MM/DD'),
            label: day.x,
            count: day.y,
            value: day.y
        }
    }).filter(x => x)


    const chartHeight = 150

    const chartMargin = {top: 0, right: 20, bottom: 80, left: 50}


    return (
        <div style={{height: chartHeight, width: '100%'}}>
            <ResponsiveBar
                data={barData}
                margin={chartMargin}
                padding={0.15}
                colors={['#0090de']}
                //labelTextColor={['#0090de']}
                animate={true}
                enableLabel={true}
                labelSkipHeight={1}
                axisLeft={{
                    tickValues:0,
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: ','
                }}
                enableTotals={true}
                axisBottom={{
                    tickRotation: -45
                }}
                enableGridY={false}
                theme={primaryTheme}
                isInteractive={false}
            />
        </div>
    )
}
export default RaffleBar
