import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import FilterButton from './FilterButton.jsx'
import GitHubButton from './GitHubButton.jsx'
import LPUButton from './LPUButton.jsx'
import SearchBox from './SearchBox.jsx'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import BeltIcon from './BeltIcon.jsx'
import beltIcons from './data/beltIcons.js'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import {useMediaQuery} from 'react-responsive'
import InfoButton from './InfoButton.jsx'

function Nav({data, belt, searchTerm, onSearch, onChangeTab}) {
    const isBigEnough = useMediaQuery({minWidth: 500})
    const beltStyle = isBigEnough ? {} : {transform: 'rotate(-90deg)'}
    const tabWidthStyle = isBigEnough
        ? {minWidth: 50, maxWidth: 50}
        : {minWidth: 'calc(100vw / 10)', maxWidth: 'calc(100vw / 10)'}

    return (
        <React.Fragment>
            <AppBar position='fixed' sx={{boxShadow: 'none'}}>
                <Toolbar>
                    <LPUButton/>

                    <div style={{flexGrow: 1}}></div>

                    <SearchBox searchTerm={searchTerm} onSearch={onSearch} onChangeTab={onChangeTab}/>

                    <div style={{flexGrow: 1}}></div>

                    <InfoButton/>
                    <FilterButton data={data} onSearch={onSearch}/>
                    <GitHubButton/>
                </Toolbar>
            </AppBar>

            {/* Dummy toolbar to help content place correctly */}
            <Toolbar/>

            <AppBar position='relative'>
                <Tabs
                    value={belt}
                    onChange={onChangeTab}
                    indicatorColor='secondary'
                    variant={isBigEnough ? 'standard' : 'fullWidth'}
                    centered={isBigEnough}
                    textColor='inherit'
                >
                    {belts.map(belt =>
                        <Tab
                            key={belt}
                            icon={
                                <BeltIcon belt={belt} style={beltStyle}/>
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
        </React.Fragment>
    )
}

const belts = Object.keys(beltIcons)

export default Nav
