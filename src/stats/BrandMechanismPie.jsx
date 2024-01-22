import React from 'react'
import {ResponsivePie} from '@nivo/pie'
import {pieTheme} from './chartDefaults.js'
import useWindowSize from '../util/useWindowSize.jsx'

function BrandBeltPie({beltData}) {

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560

    const chartMargin = {top: 12, right: 40, bottom: 20, left: 40}

    const chartHeight = mobileSmall ? 120
        : mobileMedium ? 140
            :  mobileLarge ? 180
                : smallWindow ? 180
                    : 120

    const arcLinkLabelsSkipAngle = !smallWindow ? 4 : 5
    const arcLabelsSkipAngle = !smallWindow ? 8 : 10
    const arcLinkLabelsStraightLength = !smallWindow ? 8 : 0

    const grayColors = ['#949494', '#6b6b6b', '#565656',
        '#3e3e3e', '#333333', '#2a2a2a']

    return (
        <div key='pie'
             style={{height: chartHeight, padding: '0px 0px 0px 0px', width: '100%', backgroundColor:'#000'}}
        >
            <ResponsivePie
                data={beltData}
                theme={pieTheme}
                colors={grayColors}
                margin={chartMargin}
                startAngle={-90}
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
                arcLinkLabelsDiagonalLength={6}
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

export default BrandBeltPie
