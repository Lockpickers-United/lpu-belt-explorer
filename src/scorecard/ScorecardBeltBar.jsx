import React from 'react'
import {primaryTheme} from '../stats/chartDefaults'
import useWindowSize from '../util/useWindowSize'
import {ResponsiveBar} from '@nivo/bar'

function CollectionBeltBar({beltData}) {

    const {width} = useWindowSize()
    const smallWindow = width <= 560

    const chartHeight = !smallWindow ? 175 : 190
    const tickRotation = !smallWindow ? -45 : -90

    const chartMargin = !smallWindow
        ? {top: 0, right: 0, bottom: 60, left: 15}
        : {top: 0, right: 0, bottom: 80, left: 15}

    const beltColors =
        ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
            '#0090de', '#634b9f', '#9d5918',
            '#ba0303', '#000', '#000', '#000',
            '#000', '#000', '#3e3e3e',
            '#a5a93c', '#a5a93c', '#a5a93c',
            '#a5a93c', '#a5a93c', '#a5a93c']

    const labelColors =
        ['#000', '#000', '#000', '#ddd',
            '#ddd', '#ddd', '#ddd',
            '#ddd', '#ddd', '#ddd', '#ddd',
            '#ddd', '#ddd', '#aaa',
            '#000', '#000','#000'
            ,'#000','#000','#000']

    return (
        <div key='bar'
             style={{height: chartHeight, padding: '0px 0px 0px 0px', width: '100%'}}
        >
            <ResponsiveBar
                data={beltData}
                margin={chartMargin}
                padding={0.15}
                colors={(bar) => beltColors[bar.index % beltColors.length]}
                animate={true}
                axisBottom={{
                    tickRotation: tickRotation,
                }}
                axisLeft={null}
                enableGridY={false}
                theme={primaryTheme}
                isInteractive={false}
                enableLabel={true}
                label={e => e.data.count}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={(bar) => labelColors[bar.index % labelColors.length]}
            />
        </div>
    )
}

export default CollectionBeltBar
