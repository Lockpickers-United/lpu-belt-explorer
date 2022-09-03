import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import GitHubIcon from '@mui/icons-material/GitHub'
import FilterButton from './FilterButton.jsx'
import LPUImage from './resources/LPU.png'

function Nav() {
    return (
        <AppBar position='static'>
            <Toolbar>
                <IconButton
                    edge='start' color='inherit' size='medium' sx={{mr: 2}}
                    href='https://www.lockpickersunited.org/beltsystem/belts/'
                    target='_blank' rel='noopener noreferrer'
                >
                    <img alt='LPU' src={LPUImage} width={36} height={36}/>
                </IconButton>
                <Typography variant='h6' component='div' sx={{flexGrow: 1}}>
                    Belt Explorer
                </Typography>

                <FilterButton/>
                <IconButton
                    color='inherit' target='_blank' rel='noopener noreferrer'
                    href='https://github.com/NiXXeD/lpu-belt-explorer' edge='end'
                >
                    <GitHubIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Nav
