import React from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {primaryTheme} from '../../stats/chartDefaults'
import useWindowSize from '../../util/useWindowSize'

const RaffleBeltDistributionBar = ({beltDistribution}) => {
    const {width} = useWindowSize()
    const smallWidth = width < 500
    const chartHeight = 250
    const chartMargin = !smallWidth
        ? {top: 30, right: 20, bottom: 30, left: 50}
        : {top: 30, right: 5, bottom: 55, left: 48}
    const tickRotation = !smallWidth ? 0 : -45

    const beltColors =
        ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
            '#0090de', '#634b9f', '#9d5918',
            '#ba0303', '#000000', '#000000']

    return (
        <div style={{height: chartHeight}}>
            <ResponsiveBar
                data={beltDistribution}
                maxValue={'auto'}
                margin={chartMargin}
                padding={0.15}
                colors={(bar) => beltColors[bar.index % beltColors.length]}
                animate={true}
                enableLabel={false}
                axisBottom={{
                    tickRotation: tickRotation
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: '.0%',
                }}
                enableGridY={false}
                theme={primaryTheme}
                isInteractive={false}
            />
        </div>
    )
}
export default RaffleBeltDistributionBar
