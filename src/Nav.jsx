import React, {useCallback} from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import FilterButton from './FilterButton.jsx'
import GitHubButton from './GitHubButton.jsx'
import HomeButton from './HomeButton.jsx'
import SearchBox from './SearchBox.jsx'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import BeltIcon from './BeltIcon.jsx'
import {uniqueBelts} from './data/belts'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import InfoButton from './InfoButton.jsx'
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop'
import {Fab} from '@mui/material'
import useWindowSize from './useWindowSize.js'
import Tracker from './Tracker.jsx'

function Nav({data, tab, onChangeTab, isMobile}) {
    const tabWidth = Math.floor(window.innerWidth / 10)
    const {width} = useWindowSize()
    const smallWidth = width <= 500
    const tabWidthStyle = smallWidth
        ? {minWidth: tabWidth, maxWidth: tabWidth, opacity: 1}
        : {minWidth: 50, maxWidth: 50, opacity: 1}
    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    const handleTabClick = useCallback((event, value) => onChangeTab(value), [onChangeTab])

    return (
        <React.Fragment>
            <AppBar position='fixed' sx={{boxShadow: 'none'}}>
                <Toolbar>
                    <HomeButton onChangeTab={onChangeTab}/>

                    <div style={{flexGrow: 1}}></div>

                    <SearchBox tab={tab} onChangeTab={onChangeTab} isMobile={isMobile}/>

                    <div style={{flexGrow: 1}}></div>

                    <Tracker/>

                    <InfoButton icon/>
                    <FilterButton data={data} onChangeTab={onChangeTab}/>
                    <GitHubButton/>
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

            <Fab
                size='small'
                sx={{
                    position: 'fixed',
                    right: 16,
                    bottom: 16,
                    zIndex: 1000
                }}
                onClick={scrollToTop}
            >
                <VerticalAlignTopIcon/>
            </Fab>
        </React.Fragment>
    )
}

export default Nav
