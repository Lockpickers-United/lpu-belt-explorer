import React, {useContext} from 'react'
import {ResponsiveLine} from '@nivo/line'
import {primaryTheme} from '../adminChartDefaults'
import useWindowSize from '../../util/useWindowSize'
import ReportsContext from '../ReportsContext.jsx'
import dayjs from 'dayjs'

const CollectionsListUsersSavesLine = ({cohort}) => {

    const {data} = useContext(ReportsContext)
    const {collectionStatsDaily} = data
    const listUserData = collectionStatsDaily.dayData.map(day => {
        return {
            x: day[cohort].date,
            y: day[cohort].listUsers || 0
        }
    })

    const listUserValues = cohort === 'blackBeltOnly'
        ? listUserData.filter(day => {
            return dayjs(day.x) > dayjs('2024-07-15')
        })
        : listUserData

    const listUserLine = [{id: 'listUsers', data: listUserValues}]

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560
    const midWindow = width <= 820

    const chartHeight =
        mobileSmall ? 200
            : mobileMedium ? 200
                : mobileLarge ? 210
                    : midWindow ? 230
                        : 300

    const tickRotation = !smallWindow ? 0 : -45

    const chartMargin = !smallWindow
        ? {top: 10, right: 20, bottom: 45, left: 50}
        : {top: 10, right: 20, bottom: 50, left: 50}

    return (
        <div style={{height: chartHeight}}>
            <ResponsiveLine
                theme={combinedTheme}
                data={listUserLine}
                enableGridX={false}
                enableGridY={false}
                colors={['#007de2', '#16325d']}
                lineWidth={3}
                margin={chartMargin}
                height={chartHeight}
                curve='natural'
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
                    format: '%Y-%m-%d'
                }}
                xFormat='time:%m/%d/%y'
                axisBottom={{
                    format: '%b',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: tickRotation,
                    direction: 'row',
                    legendOffset: -12,
                    tickValues: 'every month'
                }}
                legends={[
                    {
                        anchor: 'bottom',
                        itemTextColor: '#ddd',
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

export default CollectionsListUsersSavesLine
