import React from 'react'
import {ResponsiveChord} from '@nivo/chord'
import data from './chordData.json'
import {beltColorsNew} from '../../admin/adminChartDefaults'
import {uniqueBelts} from '../../data/belts'
import {jsonIt} from '../../util/jsonIt.js' //eslint-disable-line

export default function BeltFlowChord() {

    // for tooltip: {jsonIt('ribbon', ribbon)}

    return (
        <div style={{height: 600}}>

            <ResponsiveChord
                data={data.chords}
                keys={uniqueBelts}
                margin={{top: 60, right: 60, bottom: 90, left: 60}}
                valueFormat='.0f'
                padAngle={0.02}
                innerRadiusRatio={0.96}
                innerRadiusOffset={0.02}
                inactiveArcOpacity={0.25}
                arcBorderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.6
                        ]
                    ]
                }}
                activeRibbonOpacity={0.75}
                inactiveRibbonOpacity={0.15}
                ribbonBorderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.6
                        ]
                    ]
                }}
                labelRotation={-90}
                labelTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'brighter',
                            0.6
                        ]
                    ]
                }}
                colors={beltColorsNew}
                motionConfig='stiff'
                arcTooltip={({arc}) =>
                    <div style={{
                        fontSize: '0.8rem',
                        background: '#666',
                        padding: '3px 4px',
                        color: '#ddd',
                        borderRadius: '5px'
                    }}>
                        <strong>{arc.label}</strong>
                        &nbsp;({arc.value} total)
                    </div>
                }
                ribbonTooltip={({ribbon}) =>
                    <div style={{
                        fontSize: '0.8rem',
                        background: '#666',
                        padding: '3px 4px',
                        color: '#ddd',
                        borderRadius: '5px'
                    }}>
                        <strong>{ribbon.source.label}</strong> to <strong>{ribbon.target.label}</strong>
                        &nbsp;({ribbon.source.value})
                    </div>
                }
            />
        </div>
    )
}