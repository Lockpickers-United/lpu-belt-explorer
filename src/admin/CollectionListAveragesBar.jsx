import React from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {primaryTheme} from './adminChartDefaults'
import useWindowSize from '../util/useWindowSize'

const CollectionListAveragesBar = ({data}) => {
    const {summary: {data: summaryData}} = data

    const averageData = summaryData
        .map(value => ({
            id: value.list,
            label: value.list,
            count: value.averageItems,
            value: value.averageItems
        }))

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const midWindow = width <= 820

    const chartHeight =
        mobileSmall ? 180
            : mobileMedium ? 190
                : mobileLarge ? 200
                    : midWindow ? 240
                        : 250

    const chartMargin = {top: 0, right: 20, bottom: 30, left: 50}

    const blueColors = ['#aeaeae', '#0364ac', '#0364ac', '#0364ac', '#0364ac']

    return (
        <div style={{height: chartHeight, width: '100%'}}>
            <ResponsiveBar
                data={averageData}
                margin={chartMargin}
                padding={0.15}
                colors={(bar) => blueColors[bar.index % blueColors.length]}
                animate={true}
                enableLabel={true}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0
                }}
                enableGridY={false}
                theme={primaryTheme}
                isInteractive={false}
            />
        </div>
    )
}
export default CollectionListAveragesBar
