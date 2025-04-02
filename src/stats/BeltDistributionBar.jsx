import React from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {primaryTheme, beltColors} from './chartDefaults'
import useWindowSize from '../util/useWindowSize'
import pinkify from '../util/pinkify'

const BeltDistributionBar = ({beltDistribution}) => {
    const {width} = useWindowSize()
    const smallWidth = width < 500
    const midWidth = width < 700
    const chartHeight = !midWidth ? 350: !smallWidth ? 325 : 275
    const chartMargin = !smallWidth && !pinkify
        ? {top: 30, right: 20, bottom: 30, left: 50}
        : {top: 30, right: 5, bottom: 60, left: 48}
    const tickRotation = !smallWidth && !pinkify ? 0 : -45

    const beltDistributionData = beltDistribution

    return (
        <div style={{height: chartHeight}}>
            <ResponsiveBar
                data={beltDistributionData}
                maxValue={0.20}
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
export default BeltDistributionBar
