import React, {useMemo} from 'react'
import {ResponsivePie} from '@nivo/pie'
import {pieTheme, pieColors} from './chartDefaults'
import useWindowSize from '../util/useWindowSize'
import {uniqueBelts} from '../data/belts'

/**
 * @prop byBeltByMechanism
 * @prop byMechanism
 */

function PicksByLockingMechanism({data, belt}) {
    const {pickStatsData} = data

    const byBeltByMechanism = Object.keys(pickStatsData.byBeltByMechanism).reduce((beltAcc, belt) => {
        beltAcc[belt] = Object.keys(pickStatsData.byBeltByMechanism[belt]).reduce((acc, key) => {
            acc.push({
                id: key,
                label: key,
                value: pickStatsData.byBeltByMechanism[belt][key]
            })
            return acc
        }, [])

        return beltAcc
    }, {})

    const allByMechanism = Object.keys(pickStatsData.byMechanism).map(key => {
        return {
            id: key,
            label: key,
            value: pickStatsData.byMechanism[key]
        }
    })
    const uniqueBeltsAll = useMemo(() => ['All Belts', ...uniqueBelts], [])

    const chartData = useMemo(() => {
        const lockingMechanismsByBeltAll = {...byBeltByMechanism, 'All Belts': allByMechanism}
        const mechanisms = ['Pin-tumbler', 'Dimple', 'Multiple', 'Lever', 'Disc detainer', 'Slider',
            'Pump/push', 'Lever/sidebar', 'Wafer', 'Magnet', 'Other', 'Various']
        return lockingMechanismsByBeltAll[uniqueBeltsAll[belt]]
            .sort((a, b) => mechanisms.indexOf(a.label) - mechanisms.indexOf(b.label))
    }, [byBeltByMechanism, allByMechanism, uniqueBeltsAll, belt])

    const totalLocks = useMemo(() => {
        return chartData.reduce((acc, mechanism) => acc + mechanism.value, 0)
    }, [chartData])

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560

    const chartMargin = {top: 30, right: 0, bottom: 30, left: 0}
    let chartHeight = 320
    if (mobileSmall) {
        chartHeight = 145
    } else if (mobileMedium) {
        chartHeight = 180
    } else if (mobileLarge) {
        chartHeight = 230
    } else if (smallWindow) {
        chartHeight = 240
    }

    const arcLinkLabelsSkipAngle = !smallWindow ? 4 : 5
    const arcLabelsSkipAngle = !smallWindow ? 8 : 10
    const arcLinkLabelsStraightLength = !smallWindow ? 8 : 0


    return (
        <React.Fragment>

                <div key='pickPie'
                     style={{height: chartHeight, margin: '20px 8px 0px 8px', width: '100%', position: 'relative'}}
                >
                    <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}>
                        <ResponsivePie
                            data={chartData}
                            theme={pieTheme}
                            colors={pieColors}
                            margin={chartMargin}
                            startAngle={-70}
                            endAngle={360}
                            innerRadius={0.5}
                            padAngle={0.7}
                            cornerRadius={3}
                            activeOuterRadiusOffset={8}
                            arcLinkLabelsSkipAngle={arcLinkLabelsSkipAngle}
                            arcLinkLabelsTextColor='#ccc'
                            arcLinkLabelsThickness={2}
                            arcLinkLabelsColor={{from: 'color'}}
                            arcLinkLabel={e => e.label + ': ' + Math.round(e.value / totalLocks * 100) + '%'}
                            arcLinkLabelsDiagonalLength={14}
                            arcLinkLabelsStraightLength={arcLinkLabelsStraightLength}
                            enableArcLabels={false}
                            arcLabelsRadiusOffset={0.5}
                            arcLabelsSkipAngle={arcLabelsSkipAngle}
                            arcLabelsTextColor='#111'
                            isInteractive={true}
                            sortByValue={false}

                            /*
                                                    // Saving for later
                                                    tooltip={(datum) => {
                                                        const label = datum.datum.arc.angleDeg < arcLinkLabelsSkipAngle
                                                            ? datum.datum.label + ': '
                                                            : ''
                                                        const value = Math.round(datum.datum.value / totalLocks * 100)
                                                        return (
                                                            <div
                                                                style={{
                                                                    fontSize: '0.8rem',
                                                                    background: '#444',
                                                                    padding: '3px 4px',
                                                                    color: '#ddd',
                                                                    borderRadius: '5px'
                                                                }}
                                                            >
                                                                <div>{label}{value}%</div>
                                                            </div>
                                                        )
                                                    }}
                            */
                        />
                    </div>
                    <div style={{
                        width: '100%',
                        position: 'absolute',
                        top: chartHeight / 2 - 14,
                        left: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        fontSize: '1.1rem'
                    }}>
                        Picks
                    </div>
                </div>

        </React.Fragment>
    )
}

export default PicksByLockingMechanism
