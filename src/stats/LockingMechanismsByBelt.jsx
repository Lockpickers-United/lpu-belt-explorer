import React, {useCallback, useMemo, useState} from 'react'
import {ResponsivePie} from '@nivo/pie'
import {pieTheme, pieColors} from './chartDefaults'
import useWindowSize from '../util/useWindowSize'
import {uniqueBelts} from '../data/belts'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import {FormControl, InputLabel, Select} from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import PicksByLockingMechanism from './PicksByLockingMechanism'

function LockingMechanismsByBelt({data}) {
    const {lockingMechanismsByBelt, lockingMechanisms} = data.lockStats
    const uniqueBeltsAll = useMemo(() => ['All Belts', ...uniqueBelts], [])

    const [belt, setBelt] = useState(0)
    const nextBelt = useCallback(() => {
        setBelt(belt < uniqueBeltsAll.length - 1 ? belt + 1 : 0)
    }, [belt, uniqueBeltsAll.length])
    const previousBelt = useCallback(() => {
        setBelt(belt > 0 ? belt - 1 : uniqueBeltsAll.length - 1)
    }, [belt, uniqueBeltsAll.length])

    const chartData = useMemo(() => {
        const lockingMechanismsByBeltAll = {...lockingMechanismsByBelt, 'All Belts': lockingMechanisms}
        const mechanisms = ['Pin-tumbler', 'Dimple', 'Multiple', 'Lever', 'Disc detainer', 'Slider',
            'Pump/push', 'Lever/sidebar', 'Wafer', 'Magnet', 'Other', 'Various']
        return lockingMechanismsByBeltAll[uniqueBeltsAll[belt]]
            .sort((a, b) => mechanisms.indexOf(a.label) - mechanisms.indexOf(b.label))
    }, [lockingMechanismsByBelt, lockingMechanisms, uniqueBeltsAll, belt])

    const totalLocks = useMemo(() => {
        return chartData.reduce((acc, mechanism) => acc + mechanism.value, 0)
    }, [chartData])

    const [open, setOpen] = useState(false)
    const handleClose = useCallback(() => setOpen(false), [])
    const handleOpen = useCallback(() => setOpen(true), [])

    const handleChange = useCallback(event => {
        setBelt(uniqueBeltsAll.findIndex(x => x === event.target.value))
        handleClose()
    }, [handleClose, uniqueBeltsAll])

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
            <div style={{marginBottom: 10, display: 'flex', justifyContent: 'center'}}>
                <div style={{
                    padding: '0px',
                    width: 220,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Tooltip title='Previous Belt' arrow disableFocusListener>
                        <IconButton onClick={previousBelt}
                                    style={{backgroundColor: '#bbb', color: '#000', height: 24, width: 24}}>
                            <NavigateBeforeIcon/>
                        </IconButton>
                    </Tooltip>
                    <div style={{
                        padding: '0px',
                        display: 'flex',
                        justifyContent: 'center',
                        flexGrow: 1,
                        alignItems: 'center'
                    }}>
                        <FormControl id='beltPulldown' size='small' variant='outlined'
                                     style={{marginBottom: 0, width: 140}}>
                            <InputLabel style={{color:'#bbb'}}>Belt</InputLabel>
                            <Select
                                id='beltSelect'
                                value={uniqueBeltsAll[belt]}
                                label='Brand'
                                open={open}
                                onClose={handleClose}
                                onOpen={handleOpen}
                                onChange={handleChange}
                                style={{
                                    fontWeight: 700,
                                    color: '#eee',
                                    fontSize: '1.1rem',
                                }}
                            >
                                {uniqueBeltsAll.map((_beltName, index) =>
                                    <MenuItem key={index}
                                              value={uniqueBeltsAll[index]}>{uniqueBeltsAll[index]}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </div>
                    <Tooltip title='Next Belt' arrow disableFocusListener>
                        <IconButton onClick={nextBelt}
                                    style={{backgroundColor: '#bbb', color: '#000', height: 24, width: 24}}>
                            <NavigateNextIcon/>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            <div key='lockPie'
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
                    />
                </div>
                <div style={{
                    width: '100%',
                    position: 'absolute',
                    top: chartHeight / 2 - 14,
                    left: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                }}>
                    Locks
                </div>
            </div>

            <PicksByLockingMechanism data={data} belt={belt}/>
        </React.Fragment>
    )
}

export default LockingMechanismsByBelt
