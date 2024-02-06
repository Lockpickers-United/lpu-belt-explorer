import React from 'react'
import {ResponsivePie} from '@nivo/pie'
import {pieTheme} from './chartDefaults'
import useWindowSize from '../util/useWindowSize'

function LockingMechanisms({data}) {
    const {lockingMechanisms} = data.lockSummary

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560

    const chartMargin = {top: 24, right: 0, bottom: 20, left: 40}
    let chartHeight = 320
    if (mobileSmall) { chartHeight = 145 }
    else if (mobileMedium) { chartHeight = 180 }
    else if (mobileLarge) { chartHeight = 230 }
    else if (smallWindow) { chartHeight = 240 }

    const arcLinkLabelsSkipAngle = !smallWindow ? 4 : 5
    const arcLabelsSkipAngle = !smallWindow ? 8 : 10
    const arcLinkLabelsStraightLength = !smallWindow ? 8 : 0

    return (
        <div key='waffle'
             style={{height: chartHeight, padding: '0px 8px 0px 8px', width: '100%'}}
        >
            <ResponsivePie
                data={lockingMechanisms}
                theme={pieTheme}
                colors={{scheme: 'dark2'}}
                margin={chartMargin}
                startAngle={-70}
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
                arcLinkLabel={e => e.label + ': ' + e.value + ''}
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

export default LockingMechanisms
