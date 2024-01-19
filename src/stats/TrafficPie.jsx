import React from 'react'
import {ResponsivePie} from '@nivo/pie'
import {pieTheme} from './chartDefaults.js'
import useWindowSize from '../util/useWindowSize.jsx'

const TrafficPie = ({dataset, pieColors}) => {

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560

    const chartMargin = smallWindow
        ? {top: 20, right: 50, bottom: 20, left: 80}
        : {top: -50, right: 50, bottom: 20, left: 80}

    let chartHeight = 320
    if (mobileSmall) {
        chartHeight = 165
    } else if (mobileMedium) {
        chartHeight = 180
    } else if (mobileLarge) {
        chartHeight = 230
    } else if (smallWindow) {
        chartHeight = 240
    }


    const arcLinkLabelsSkipAngle = !smallWindow ? 4 : 6
    const arcLabelsSkipAngle = !smallWindow ? 0 : 4
    const arcLinkLabelsStraightLength = !smallWindow ? 8 : 4

    return (
        <div key='pie'
             style={{height: chartHeight, padding: '0px 8px 0px 8px', width: '100%', backgroundColor: '#000'}}
        >
            <ResponsivePie
                data={dataset}
                theme={pieTheme}
                colors={pieColors}
                margin={chartMargin}
                startAngle={-45}
                endAngle={360}
                sortByValue={false}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={arcLinkLabelsSkipAngle}
                arcLinkLabelsTextColor='#ccc'
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{from: 'color'}}
                arcLinkLabel={e => e.label}
                arcLinkLabelsDiagonalLength={14}
                arcLinkLabelsStraightLength={arcLinkLabelsStraightLength}
                enableArcLabels={false}
                arcLabelsRadiusOffset={0.5}
                arcLabelsSkipAngle={arcLabelsSkipAngle}
                arcLabelsTextColor='#111'
                isInteractive={false}
            />
        </div>
    )
}

export default TrafficPie
