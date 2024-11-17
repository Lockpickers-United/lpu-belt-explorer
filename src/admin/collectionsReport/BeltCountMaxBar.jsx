import React from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {primaryTheme} from '../adminChartDefaults'
import useWindowSize from '../../util/useWindowSize'
import awards from '../../data/awards.json'

const BeltCountMaxBar = ({data}) => {
    const {maxBeltCounts} = data

    const barData = awards.map(award => {
        if( award.rank > 20) return null
        return {
            id: award.name,
            label: award.makeModels[0].model,
            count: maxBeltCounts[award.id] || 0,
            value: maxBeltCounts[award.id] || 0
        }
    }).filter(x => x)

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

    const chartMargin = {top: 0, right: 20, bottom: 80, left: 50}

    const beltColors =
        ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
            '#0090de', '#634b9f', '#9d5918',
            '#ba0303', '#1a1a1a', '#baba12',
            '#baba12', '#baba12', '#baba12',
            '#baba12', '#baba12', '#baba12',
            '#baba12', '#baba12', '#baba12',
            '#baba12', '#baba12', '#baba12',
            '#baba12', '#baba12', '#baba12',
            '#baba12', '#baba12', '#baba12',
        ]

    const labelColors =
        ['#000','#000','#000','#000',
            '#000','#000','#000',
            '#000','#ddd','#000',
            '#000','#000','#000',
            '#000','#000','#000',
            '#000','#000','#000',
            '#000','#000','#000',
            '#000','#000','#000',
            '#000','#000','#000',
            '#000','#000','#000',
        ]


    return (
        <div style={{height: chartHeight, width: '100%'}}>
            <ResponsiveBar
                data={barData}
                margin={chartMargin}
                padding={0.15}
                colors={(bar) => beltColors[bar.index % beltColors.length]}
                labelTextColor={(bar) => labelColors[bar.index % labelColors.length]}
                animate={true}
                enableLabel={true}
                labelSkipHeight={1}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: ','
                }}
                enableTotals={true}
                axisBottom={{
                    tickRotation: -45
                }}
                enableGridY={false}
                theme={primaryTheme}
                isInteractive={false}
            />
        </div>
    )
}
export default BeltCountMaxBar
