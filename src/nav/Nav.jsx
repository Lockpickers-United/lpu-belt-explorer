import React, {useCallback, useContext} from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import FilterButton from '../filters/FilterButton'
import HomeButton from './HomeButton'
import SearchBox from './SearchBox'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import BeltIcon from '../entries/BeltIcon'
import {uniqueBelts} from '../data/belts'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import InfoButton from '../info/InfoButton'
import useWindowSize from '../util/useWindowSize'
import Tracker from '../app/Tracker'
import AppContext from '../contexts/AppContext'
import ScrollToTopButton from './ScrollToTopButton'
import {useHotkeys} from 'react-hotkeys-hook'
import Tooltip from '@mui/material/Tooltip'
import FilterContext from '../contexts/FilterContext'

function Nav() {
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
        <React.Fragment>
            <AppBar position='fixed' sx={{boxShadow: 'none'}}>
                <Toolbar>
                    <HomeButton/>

                    <div style={{flexGrow: 1}}></div>

                    <SearchBox/>

                    <div style={{flexGrow: 1}}></div>

                    <Tracker/>

                    <InfoButton icon/>
                    <FilterButton/>
                </Toolbar>
            </AppBar>

            {/* Dummy toolbar to help content place correctly */}
            <Toolbar/>

            <AppBar position='relative'>
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

            <ScrollToTopButton/>
        </React.Fragment>
    )
}

function CloneProps({children, ...other}) {
    return children(other)
}

export default Nav
