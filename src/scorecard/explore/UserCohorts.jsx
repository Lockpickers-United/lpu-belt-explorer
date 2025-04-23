import React, {useCallback, useMemo, useState} from 'react'
import {ResponsivePie} from '@nivo/pie'
import {pieTheme, beltColors} from '../../stats/chartDefaults'
import useWindowSize from '../../util/useWindowSize'
import Link from '@mui/material/Link'
import platformBeltCounts from '../../data/platformBeltCounts.json'
import {beltSort} from '../../data/belts'

export default function UserCohorts({data}) {

    /**
     * @prop beltedUsers
     * @prop belts
     * @prop dans
     */

    const {scorecardStats} = data
    const {userCounts} = scorecardStats
    const otherPickers = platformBeltCounts.reddit.Total - userCounts.totalUsers

    const dataSets = useMemo(() => {
        const pickerData = {
            data: [
                {id: 'LPUbelts Users', label: 'LPUbelts Users', value: userCounts.totalUsers},
                {id: 'Other LPU Pickers', label: 'Other LPU Pickers (approx)', value: otherPickers}
            ],
            colors: ['#37bd17', '#17561b'],
            description: 'Click chart for details',
            startAngle: -65
        }

        const userData = {
            parent: 'pickerData',
            data: [
                {id: 'Scorecard Users', label: 'Scorecard Users', value: userCounts.scorecardUsers},
                {
                    id: 'Other LPUbelts Users',
                    label: 'Other LPUbelts Users',
                    value: userCounts.totalUsers - userCounts.scorecardUsers
                }
            ],
            colors: ['#d2bc18', '#444'],
            description: 'LPUbelts Scorecard Usage',
            startAngle: -35
        }

        const scorecardUserData = {
            parent: 'LPUbelts Users',
            data: [
                {id: 'Imported Belts', label: 'Imported Belts', value: userCounts.beltedUsers},
                {
                    id: 'Other Scorecard Users',
                    label: 'Other Scorecard Users',
                    value: userCounts.scorecardUsers - userCounts.beltedUsers
                }
            ],
            colors: ['#189ad2', '#444'],
            description: 'Scorecard Belt Imports',
            startAngle: -120
        }

        const beltedData = {
            parent: 'Scorecard Users',
            data: Object.keys(userCounts.belts)
                .sort((a, b) => {
                    return beltSort(a, b)
                }).map(belt => {
                        return {
                            id: belt,
                            label: belt,
                            value: userCounts.belts[belt]
                        }
                    }
                ),
            colors: beltColors,
            description: 'Imported Belt Breakdown (click Black for Dan breakdown)',
            startAngle: -10
        }

        const dansData = {
            parent: 'Imported Belts',
            data: Object.keys(userCounts.dans)
                .sort((a, b) => {
                    return parseInt(a) - parseInt(b)
                }).map(dan => {
                        return {
                            id: addOrdinal(dan),
                            label: addOrdinal(dan),
                            value: userCounts.dans[dan]
                        }
                    }
                ),
            colors: danColors,
            description: 'Dan Breakdown'
        }

        const otherPickerData = {
            parent: 'pickerData',
            data: [
                {id: 'Discord', label: 'Discord', value: platformBeltCounts.discord.Total},
                {id: 'Reddit', label: 'Reddit', value: platformBeltCounts.reddit.Total}
            ],
            colors: ['#a981ec', '#7833e3'],
            description: 'Platforms users overlap, numbers shown for relative size'
        }

        const redditBelts = {
            parent: 'Other LPU Pickers',
            data: Object.keys(platformBeltCounts.reddit)
                .filter(belt => belt !== 'Total')
                .sort((a, b) => {
                    return beltSort(a, b)
                }).map(belt => {
                        const beltText = belt === 'Black' ? 'Black Belt' : belt
                        return {
                            id: beltText,
                            label: beltText,
                            value: platformBeltCounts.reddit[belt]
                        }
                    }
                ),
            colors: beltColors,
            description: <span>
                Reddit Belt Breakdown | <Link onClick={() => setDataset('Discord')}
                                               style={{color: '#189dea', textDecoration:'none', cursor: 'pointer'}}>Discord</Link>
            </span>,
            startAngle: -10
        }

        const discordBelts = {
            parent: 'Other LPU Pickers',
            data: Object.keys(platformBeltCounts.discord)
                .filter(belt => belt !== 'Total')
                .sort((a, b) => {
                    return beltSort(a, b)
                }).map(belt => {
                        const beltText = belt === 'Black' ? 'Black Belt' : belt
                        return {
                            id: beltText,
                            label: beltText,
                            value: platformBeltCounts.discord[belt]
                        }
                    }
                ),
            colors: beltColors,
            description: <span>
                Discord Belt Breakdown | <Link onClick={() => setDataset('Reddit')}
                                               style={{color: '#189dea', textDecoration:'none', cursor: 'pointer'}}>Reddit</Link>
            </span>,
            startAngle: -10
        }


        return {
            pickerData,
            'LPUbelts Users': userData,
            'Scorecard Users': scorecardUserData,
            'Imported Belts': beltedData,
            'Black': dansData,
            'Other LPU Pickers': otherPickerData,
            'Reddit': redditBelts,
            'Discord': discordBelts
        }
    }, [otherPickers, userCounts])

    const [dataset, setDataset] = useState('pickerData')
    const chartData = dataSets[dataset].data

    const totalCount = dataSets[dataset].data.reduce((acc, current) => {
        return acc + current.value
    }, 0)

    const handleClick = useCallback(data => {
        if (dataSets[data['id']]) {
            document.getElementById('chartDescription').style.opacity = '0.2'
            setTimeout(() => {
                document.getElementById('chartDescription').style.opacity = '1'
                setDataset(data['id'])
            }, 200)
        }
    }, [dataSets])

    const handleBack = useCallback(() => {
        setDataset(dataSets[dataset].parent)
    }, [dataSets, dataset])

    const handleMouseEnter = useCallback((datum, event) => {
        if (dataSets[datum['id']]) {
            event.currentTarget.style.cursor = 'pointer'
        }
    }, [dataSets])

    const {width} = useWindowSize()
    const mobileSmall = width <= 360
    const mobileMedium = width <= 395
    const mobileLarge = width <= 428  // but test also at 412
    const smallWindow = width <= 560

    const chartMargin = {top: 30, right: 0, bottom: 30, left: 0}
    let chartHeight = 320
    if (mobileSmall) {
        chartHeight = 175
    } else if (mobileMedium) {
        chartHeight = 180
    } else if (mobileLarge) {
        chartHeight = 230
    } else if (smallWindow) {
        chartHeight = 240
    }

    const backLinkSize = !smallWindow ? '1.0rem' : '1.0rem'
    const arcLinkLabelsSkipAngle = !smallWindow ? 4 : 5
    const arcLabelsSkipAngle = !smallWindow ? 8 : 10
    const arcLinkLabelsStraightLength = !smallWindow ? 8 : 0


    return (
        <React.Fragment>
            <div
                style={{
                    fontSize: '0.95rem', fontWeight: 500, width: '100%', textAlign: 'center', marginBottom: 4,
                    opacity: 1,
                    transitionProperty: 'opacity, left, top, height',
                    transitionDuration: '0.1s, 0.1s'
                }}
                id='chartDescription'
            >
                {dataSets[dataset].description}
            </div>

            <div key='pickPie'
                 style={{height: chartHeight, margin: '0px 8px 0px 8px', width: '100%', position: 'relative'}}
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
                        colors={dataSets[dataset].colors}
                        margin={chartMargin}
                        startAngle={dataSets[dataset].startAngle || -40}
                        endAngle={360}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        activeOuterRadiusOffset={0}
                        arcLinkLabelsSkipAngle={arcLinkLabelsSkipAngle}
                        arcLinkLabelsTextColor='#ccc'
                        arcLinkLabelsThickness={2}
                        arcLinkLabelsColor={{from: 'color'}}
                        arcLinkLabel={e => e.label + ': ' + Math.round(e.value / totalCount * 100) + '%'}
                        arcLinkLabelsDiagonalLength={14}
                        arcLinkLabelsStraightLength={arcLinkLabelsStraightLength}
                        enableArcLabels={false}
                        arcLabelsRadiusOffset={0.5}
                        arcLabelsSkipAngle={arcLabelsSkipAngle}
                        arcLabelsTextColor='#111'
                        isInteractive={true}
                        transitionMode={'startAngle'}
                        motionConfig={'slow'}
                        sortByValue={false}
                        onClick={(data) => {
                            handleClick(data)
                        }}
                        onMouseEnter={(_datum, event) => {
                            handleMouseEnter(_datum, event)
                        }}

                        // Saving for later
                        tooltip={(datum) => {
                            const label = datum.datum.arc.angleDeg > arcLinkLabelsSkipAngle
                                ? datum.datum.label + ': '
                                : datum.datum.label + ': '
                            const value = datum.datum.value
                            return (
                                <div
                                    style={{
                                        fontSize: '0.8rem',
                                        background: '#555',
                                        padding: '3px 4px',
                                        color: '#ddd',
                                        borderRadius: '5px',
                                        display: smallWindow ? 'none' : 'block'
                                    }}
                                >
                                    <div>{label}{value}</div>
                                </div>
                            )
                        }}
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
                    {dataSets[dataset].parent &&
                        <Link onClick={handleBack}
                              style={{color: '#ccc', cursor: 'pointer', fontSize: backLinkSize}}>back</Link>
                    }
                </div>
            </div>

        </React.Fragment>
    )
}

function addOrdinal(danLevel) {
    const ordinals = ['st', 'nd', 'rd', 'th']
    return danLevel + '' + ordinals[Math.min(4, parseInt(danLevel)) - 1]
}

const danColors = ['#222222', '#2E2E2E', '#3A3A3A', '#464646', '#525252', '#5E5E5E',
    '#6A6A6A', '#767676', '#828282', '#8E8E8E', '#9A9A9A', '#A6A6A6', '#B2B2B2',
    '#BEBEBE', '#CACACA', '#D6D6D6', '#E2E2E2', '#EFEFEF', '#FAFAFA', '#FFFFFF']

