import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import AppBar from '@mui/material/AppBar'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {useHotkeys} from 'react-hotkeys-hook'
import AppContext from '../contexts/AppContext'
import FilterContext from '../contexts/FilterContext'
import {uniqueBelts} from '../data/belts'
import BeltIcon from '../entries/BeltIcon'
import useWindowSize from '../util/useWindowSize'

function BeltToolbar() {
    const tabWidth = Math.floor(window.innerWidth / 10)
    const {width} = useWindowSize()
    const smallWidth = width <= 500

    const tabWidthStyle = smallWidth
        ? {minWidth: tabWidth, maxWidth: tabWidth, opacity: 1}
        : {minWidth: 50, maxWidth: 50, opacity: 1}
    useHotkeys('1,2,3,4,5,6,7,8,9', ({key}) => {
        setTab(uniqueBelts[key - 1])
    })

    const {tab, setTab} = useContext(AppContext)
    const {addFilter} = useContext(FilterContext)

    const handleTabClick = useCallback((event, value) => setTab(value), [setTab])

    const handleClick = useCallback(value => () => {
        if (tab === value) addFilter('tab', tab, true)
    }, [addFilter, tab])

    return (
        <AppBar position='relative' style={{boxShadow: 'none'}}>
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
                                        <BeltIcon value={belt} style={{paddingTop: 2}}/>
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
                        <Tooltip title='Search Results' arrow disableFocusListener>
                            <Tab
                                {...tabProps}
                                icon={
                                    <ManageSearchIcon/>
                                }
                                sx={tabWidthStyle}
                            />
                        </Tooltip>
                    )}
                </CloneProps>
            </Tabs>
        </AppBar>
    )
}

function CloneProps({children, ...other}) {
    return children(other)
}

export default BeltToolbar
