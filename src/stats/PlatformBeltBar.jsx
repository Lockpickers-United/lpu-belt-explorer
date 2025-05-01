import React from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {primaryTheme, beltColors} from './chartDefaults'
import useWindowSize from '../util/useWindowSize.jsx'

const PlatformBeltBar = ({beltDistribution}) => {

    const {width} = useWindowSize()
    const smallWidth = width < 500
    const midWidth = width < 700
    const chartHeight = !midWidth ? 250 : !smallWidth ? 250 : 250
    const chartMargin = !smallWidth
        ? {top: 10, right: 75, bottom: 50, left: 85}
        : {top: 10, right: 5, bottom: 80, left: 48}
    const borderRadius = !smallWidth ? 1 : 1
    const tickRotation = !smallWidth ? 0 : -45

    return (
        <div style={{height: chartHeight}}>
            <ResponsiveBar
                data={beltDistribution}
                keys={[
                    'Discord', 'Reddit'
                ]}
                indexBy='belt'
                groupMode='grouped'
                margin={chartMargin}
                background={'#fff'}
                padding={0.12}
                innerPadding={2}
                borderRadius={borderRadius}
                valueScale={{type: 'linear'}}
                indexScale={{type: 'band', round: true}}
                maxValue={'auto'}
                theme={{...primaryTheme, background: '#000'}}
                colors={beltColors}
                colorBy='indexValue'
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#000',
                        size: 1,
                        padding: 3,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#444',
                        rotation: 30,
                        lineWidth: 1,
                        spacing:18,
                    },
                    {
                        id: 'dotsLegend',
                        type: 'patternDots',
                        background: '#ccc',
                        color: '#000',
                        size: 1,
                        padding: 3,
                        stagger: true
                    },
                    {
                        id: 'linesLegend',
                        type: 'patternLines',
                        background: '#ccc',
                        color: '#444',
                        rotation: 30,
                        lineWidth: 1,
                        spacing: 10
                    },
                    {
                        id: 'plainLegend',
                        type: 'patternLines',
                        background: '#ccc',
                        color: '#ccc',
                        rotation: -45,
                        lineWidth: 1,
                        spacing: 10
                    },
                ]}
                fill={[
                    {
                        match: {
                            id: 'Reddit'
                        },
                        id: 'lines'
                    }
                ]}
                animate={true}
                enableLabel={false}
                enableGridY={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={'#222'}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    format: '.0%',
                }}
                legends={[
                    {
                        dataFrom: 'keys',
                        itemTextColor: '#ccc',
                        symbolShape: ({ x, y, size, borderWidth, borderColor, id }) => {
                            // pick your pattern
                            const patternId = id === 'Reddit' ? 'linesLegend' : 'plainLegend'
                            return (
                                <g>
                                    {/* background rectangle for the symbol */}
                                    {/* pattern overlay */}
                                    <rect
                                        x={x}
                                        y={y}
                                        width={size}
                                        height={size}
                                        fill={`url(#${patternId})`}
                                        stroke={borderColor}
                                        strokeWidth={borderWidth}
                                    />
                                </g>
                            )
                        },
                        anchor: 'top-right',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 20,
                        itemsSpacing: 2,
                        itemWidth: 90,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                axisBottom={{
                    tickRotation: tickRotation
                }}
                isInteractive={false}

            />
        </div>
    )
}
export default PlatformBeltBar
