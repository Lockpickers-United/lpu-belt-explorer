import React, {useContext, useEffect} from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import FilterButton from './FilterButton.jsx'
import GitHubButton from './GitHubButton.jsx'
import LPUButton from './LPUButton.jsx'
import SearchBox from './SearchBox.jsx'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import BeltIcon from './BeltIcon.jsx'
import {uniqueBelts} from './data/belts'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import {useMediaQuery} from 'react-responsive'
import InfoButton from './InfoButton.jsx'
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop'
import {Fab} from '@mui/material'

function Nav({data, tab, onChangeTab}) {
    const isBigEnough = useMediaQuery({minWidth: 500})
    const tabWidth = Math.floor(window.innerWidth/10)
    const tabWidthStyle = isBigEnough
        ? {minWidth: 50, maxWidth: 50, opacity: 1}
        : {minWidth: tabWidth, maxWidth: tabWidth, opacity: 1}
    const scrollToTop = () => {
        window.scrollTo({top: 0, behavior: 'smooth'})
    }

    const handleTabClick = (event, value) => onChangeTab(value)

    return (
        <React.Fragment>
            <AppBar position='fixed' sx={{boxShadow: 'none'}}>
                <Toolbar>
                    <LPUButton/>

                    <div style={{flexGrow: 1}}></div>

                    <SearchBox onChangeTab={onChangeTab}/>

                    <div style={{flexGrow: 1}}></div>

                    <InfoButton/>
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
                    variant={isBigEnough ? 'standard' : 'fullWidth'}
                    centered={isBigEnough}
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
