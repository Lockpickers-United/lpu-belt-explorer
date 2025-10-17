import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import LockListContext from './LockListContext'
import FilterContext from '../context/FilterContext'
import {uniqueBelts} from '../data/belts'
import BeltIcon from '../entries/BeltIcon'
import useWindowSize from '../util/useWindowSize'
import IconAll from '../resources/iconAll.jsx'
import DataContext from './LockDataProvider.jsx'

function BeltToolbar() {
    const {tab, setTab} = useContext(LockListContext)
    const {addFilter, removeFilters} = useContext(FilterContext)
    const {visibleEntries = []} = useContext(DataContext)

    const beltCounts = visibleEntries.reduce((acc, entry) => {
        const belt = entry.belt.replace(/ \d/,'')
        acc[belt] = acc[belt] ? acc[belt]+1 : 1
        return acc
    },{})

    const tabWidth = Math.floor(window.innerWidth / 10)
    const {width} = useWindowSize()
    const smallWidth = width <= 500
    const flexStyle = !smallWidth ? 'flex' : 'block'

    const tabWidthStyle = smallWidth
        ? {minWidth: tabWidth, maxWidth: tabWidth, opacity: 1}
        : {minWidth: 50, maxWidth: 50, opacity: 1}
    useHotkeys('1,2,3,4,5,6,7,8,9', ({key}) => {
        setTab(uniqueBelts[key - 1])
    })

    const handleTabClick = useCallback((_event, value) => setTab(value), [setTab])

    const handleClick = useCallback(value => () => {
        if (tab === value) {
            addFilter('tab', tab, true)
        } else {
            removeFilters(['belt'])
        }
    }, [addFilter, removeFilters, tab])

    const allColor = tab === 'search' ? '#eee' : '#aaa'

    return (
        <AppBar position='relative' style={{boxShadow: 'none'}}>
            <div style={{display: flexStyle, justifyContent: 'center'}}>
                <div>
                    <Tabs
                        value={tab}
                        onChange={handleTabClick}
                        indicatorColor='secondary'
                        variant={smallWidth ? 'fullWidth' : 'standard'}
                        centered={!smallWidth}
                        textColor='inherit'
                    >
                        {uniqueBelts.map(belt =>
                            <CloneProps key={belt} value={belt}>
                                {tabProps => (
                                    <Tooltip title={`${belt} Belt`} arrow disableFocusListener>
                                        <Tab
                                            {...tabProps}
                                            icon={
                                                <BeltIcon value={belt} style={{paddingTop: 2, opacity: beltCounts[belt] ? 1 : 0.2}}/>
                                            }
                                            sx={tabWidthStyle}
                                            onClick={handleClick(belt)}
                                        />
                                    </Tooltip>
                                )}
                            </CloneProps>
                        )}
                        <CloneProps value='search'>
                            {tabProps => (
                                <Tooltip title='All Matching Locks' arrow disableFocusListener>
                                    <Tab
                                        {...tabProps}
                                        icon={
                                            <IconAll fill={allColor}/>
                                        }
                                        sx={tabWidthStyle}
                                    />
                                </Tooltip>
                                )}
                        </CloneProps>
                    </Tabs>
                </div>
            </div>
        </AppBar>
    )
}

function CloneProps({children, ...other}) {
    return children(other)
}

export default BeltToolbar
