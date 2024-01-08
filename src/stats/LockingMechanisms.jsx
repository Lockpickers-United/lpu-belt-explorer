import React from 'react'
import {ResponsivePie} from '@nivo/pie'
import {pieTheme} from './chartDefaults.js'
import lockSummaryData from '../data/lockSummaryData.json'
import useWindowSize from '../util/useWindowSize.jsx'

function LockingMechanisms() {
    const data = lockSummaryData.lockingMechanisms

    const {width} = useWindowSize()
    const smallWidth = width < 500

    const myChartHeight = !smallWidth ? 320 : 200
    const chartMargin = !smallWidth
        ? {top: 24, right: 0, bottom: 20, left: 0}
        : {top: 0, right: 80, bottom: 0, left: 120}
    const arcLinkLabelsSkipAngle = !smallWidth ? 4 : 5
    const arcLabelsSkipAngle = !smallWidth ? 8 : 10
    const arcLinkLabelsStraightLength = !smallWidth ? 8 : 0

    return (
        <div key='waffle'
             style={{height: myChartHeight, padding: '0px 8px', width: '100%'}}
        >
            <ResponsivePie
                data={data}
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
