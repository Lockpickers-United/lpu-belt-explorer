import React from 'react'
import {primaryTheme} from '../stats/chartDefaults'
import useWindowSize from '../util/useWindowSize'
import {ResponsiveBar} from '@nivo/bar'
import {danBelts} from '../data/belts'

function CompareBeltBar({userData, max}) {

    if (!userData) return null

    const beltData = danBelts.reduce((acc, belt) => {
        const count = userData['beltCounts'][belt] ? userData['beltCounts'][belt] : 0
        acc.push({id: belt, label: belt, count: count, value: count})
        return acc
    }, [])

    const {isMobile} = useWindowSize()
    const chartHeight = !isMobile ? 210 : 160
    const tickRotation = !isMobile ? -45 : -90
    const chartMargin = !isMobile
        ? {top: 0, right: 0, bottom: 60, left: 15}
        : {top: 0, right: 0, bottom: 60, left: 0}

    const beltColors =
        ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
            '#0090de', '#634b9f', '#9d5918',
            '#ba0303', '#000', '#000', '#000',
            '#000', '#000', '#3e3e3e',
            '#a5a93c', '#a5a93c', '#a5a93c',
            '#a5a93c', '#a5a93c', '#a5a93c'
        ]

    const labelColors =
        ['#000', '#000', '#000', '#ddd',
            '#ddd', '#ddd', '#ddd',
            '#ddd', '#ddd', '#ddd', '#ddd',
            '#ddd', '#ddd', '#aaa',
            '#000', '#000','#000'
            ,'#000','#000','#000',
        ]

    return (
        <div key='bar'
             style={{height: chartHeight, padding: '0px 8px 0px 8px', width: '100%', flexGrow: 2, backgroundColor:'inherit'}}
        >
            <ResponsiveBar
                data={beltData}
                maxValue={max}
                margin={chartMargin}
                padding={0.15}
                colors={(bar) => beltColors[bar.index % beltColors.length]}
                animate={true}
                axisBottom={{
                    tickRotation: tickRotation
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

export default CompareBeltBar
