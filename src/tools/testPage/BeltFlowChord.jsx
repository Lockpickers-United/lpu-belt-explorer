import React, {useState} from 'react'
import {ResponsiveChord} from '@nivo/chord'
import monthlyChordData from './monthlyChordData.json'
import chordDataTotal from './chordDataTotal.json'
import {uniqueBelts} from '../../data/belts'
import dayjs from 'dayjs'
import Link from '@mui/material/Link' //eslint-disable-line

export const beltColorsNew = ['#d5d5d5', '#dcdc1f', '#e16936', '#34732f',
    '#3e71bd', '#9f21e5', '#9d6837',
    '#c52323', '#303030', '#111']

export default function BeltFlowChord() {

    const months = Object.keys(monthlyChordData).sort((a, b) => {
        return dayjs(a).valueOf() - dayjs(b).valueOf()
    })

    const [chordData, setChordData] = useState(chordDataTotal.chords)

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function animate() {
        setChordData(monthlyChordData[months[0]])
        let counter = 0
        while (counter < months.length - 1) {
            setChordData(monthlyChordData[months[counter]].chords)
            await sleep(40)
            counter++
        }
    }


    // for tooltip: {jsonIt('ribbon', ribbon)}

    return (
        <React.Fragment>

            <div style={{textAlign: 'center', height: 20, marginBottom: 5, fontSize: '0.9rem'}}>
                <Link onClick={animate} style={{color: '#ddd', cursor: 'pointer'}}>Animate</Link>
            </div>


            <div style={{height: 600}}>

                <ResponsiveChord
                    data={chordData}
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
        </React.Fragment>
    )
}