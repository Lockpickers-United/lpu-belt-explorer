import React, {useCallback, useContext} from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import FilterButton from '../filters/FilterButton.jsx'
import HomeButton from './HomeButton.jsx'
import SearchBox from './SearchBox.jsx'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import BeltIcon from '../entries/BeltIcon.jsx'
import {uniqueBelts} from '../data/belts.js'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import InfoButton from '../info/InfoButton.jsx'
import useWindowSize from '../util/useWindowSize.jsx'
import Tracker from '../app/Tracker.jsx'
import AppContext from '../contexts/AppContext.jsx'
import ScrollToTopButton from './ScrollToTopButton.jsx'
import {useHotkeys} from 'react-hotkeys-hook'

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

    const handleTabClick = useCallback((event, value) => setTab(value), [setTab])

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
                        <Tab
                            key={belt}
                            icon={
                                <BeltIcon value={belt} style={{paddingTop: 2}}/>
                            }
                            value={belt}
                            sx={tabWidthStyle}
                        />
                    )}
                    <Tab
                        icon={<ManageSearchIcon/>}
                        value='search'
                        sx={tabWidthStyle}
                    />
                </Tabs>
            </AppBar>

            <ScrollToTopButton/>
        </React.Fragment>
    )
}

export default Nav
