import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import ClearFilterButton from './ClearFilterButton.jsx'
import FilterButton from './FilterButton.jsx'
import GitHubButton from './GitHubButton.jsx'
import LPUButton from './LPUButton.jsx'
import SearchBox from './SearchBox.jsx'

function Nav({onSearch}) {
    return (
        <AppBar position='fixed'>
            <Toolbar>
                <LPUButton/>

                <Typography variant='h6' component='div' sx={{flexGrow: 1}}>
                    Belt Explorer
                </Typography>

                <SearchBox onSearch={onSearch}/>

                <FilterButton/>
                <ClearFilterButton onSearch={onSearch}/>

                <GitHubButton/>
            </Toolbar>
        </AppBar>
    )
}

export default Nav
