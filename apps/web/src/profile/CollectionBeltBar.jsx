import React from 'react'
import {primaryTheme} from '../stats/chartDefaults'
import useWindowSize from '../util/useWindowSize'
import {ResponsiveBar} from '@nivo/bar'

function CollectionBeltBar({beltData}) {

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const smallWindow = width <= 560

    const chartHeight = mobileSmall ? 175
        : smallWindow ? 175
            : 175

    const chartMargin = !smallWindow
        ? {top: 0, right: 10, bottom: 60, left: 10}
        : {top: 15, right: 20, bottom: 60, left: 20}

    const beltColors =
        ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
            '#0090de', '#634b9f', '#9d5918',
            '#ba0303', '#000', '#373737']

    const labelColors =
        ['#000', '#000', '#000', '#000',
            '#000', '#000', '#000',
            '#000', '#ddd', '#ddd']

    return (
        <div>
            <div key='bar'
                 style={{height: chartHeight, padding: '0px 8px 0px 8px', width: '100%'}}
            >
                <ResponsiveBar
                    data={beltData}
                    margin={chartMargin}
                    padding={0.15}
                    colors={(bar) => beltColors[bar.index % beltColors.length]}
                    animate={true}
                    axisBottom={{
                        tickRotation: -45
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

            <div className='chart-legend' style={{
                fontSize: '.9rem', color: '#ddd', textAlign: 'center', width: '100%', marginTop: '3px'
            }}>
                Belt Distribution
            </div>
        </div>
    )
}

export default CollectionBeltBar
