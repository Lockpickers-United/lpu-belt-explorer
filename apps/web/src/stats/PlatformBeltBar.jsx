import React, {useCallback} from 'react'
import {ResponsiveBar} from '@nivo/bar'
import {primaryTheme, beltColors} from './chartDefaults'
import useWindowSize from '../util/useWindowSize.jsx'

const PlatformBeltBar = ({beltDistribution}) => {

    const {isMobile} = useWindowSize()
    const chartHeight = !isMobile ? 480 : 320
    const chartMargin = !isMobile
        ? {top: 0, right: 5, bottom: 40, left: 60}
        : {top: 0, right: 45, bottom: 40, left: 60}
    const legendSymbolSize = !isMobile ? 20 : 15
    const tickRotation = !isMobile ? -45 : -45

    let beltColorsReverse = [...beltColors]
    beltColorsReverse.pop()
    beltColorsReverse.reverse()

    const handleClick = useCallback((data, e) => { //eslint-disable-line
        //console.log('data', data, e)
        //console.log('e', e)
    },[])

    return (
        <div style={{height: chartHeight, width: '100%'}}>
            <ResponsiveBar
                data={beltDistribution}
                keys={[
                    'Discord', 'Reddit'
                ]}
                indexBy='belt'
                layout='horizontal'
                reverse={false}
                groupMode='grouped'
                margin={chartMargin}
                background={'#fff'}
                padding={0.13}
                innerPadding={2}
                borderRadius={1}
                valueScale={{type: 'linear'}}
                indexScale={{type: 'band', round: true}}
                maxValue={'auto'}
                theme={{...primaryTheme, background: '#000'}}
                colors={beltColorsReverse}
                colorBy='indexValue'
                enableLabel={false}
                enableGridY={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={'#222'}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0
                }}
                axisBottom={{
                    tickRotation: tickRotation,
                    format: '.0%'
                }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#333',
                        size: 1.3,
                        padding: 2,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#444',
                        rotation: 60,
                        lineWidth: 1,
                        spacing: 15
                    },
                    {
                        id: 'dotsLegend',
                        type: 'patternDots',
                        background: '#ccc',
                        color: '#333',
                        size: 1.3,
                        padding: 2,
                        stagger: true
                    },
                    {
                        id: 'linesLegend',
                        type: 'patternLines',
                        background: '#ccc',
                        color: '#444',
                        rotation: 60,
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
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'Reddit'
                        },
                        id: 'dots'
                    }
                ]}
                legends={[
                    {
                        dataFrom: 'keys',
                        itemTextColor: '#ccc',
                        symbolShape: ({x, y, size, borderWidth, borderColor, id}) => {
                            // pick your pattern
                            const patternId = id === 'Reddit' ? 'dotsLegend' : 'plainLegend'
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
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 20,
                        translateY: -40,
                        itemsSpacing: 8,
                        itemWidth: 90,
                        itemHeight: legendSymbolSize,
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: legendSymbolSize,
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
                animate={true}
                isInteractive={true}
                tooltip={({
                              id,
                              value,
                              indexValue,
                              color
                          }) =>
                    <div style={{
                        padding: 12,
                        background: '#444',
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                        <div style={{width: 15, height:15, background: color}}/>
                        <div style={{fontSize: 12, marginLeft: 10}}>
                            {id} - {indexValue}: {(value * 100).toFixed(0) + '%'}
                        </div>
                    </div>}
                onClick={(data, e) => { handleClick(data, e) }}
            />
        </div>
    )
}
export default PlatformBeltBar
