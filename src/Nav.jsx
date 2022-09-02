import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import GitHubIcon from '@mui/icons-material/GitHub'
import FilterAltIcon from '@mui/icons-material/FilterAlt'

function Nav() {
    return (
        <AppBar position='static'>
            <Toolbar>
                <Typography variant='h6' component='div' sx={{flexGrow: 1}}>
                    LPU Belt Explorer
                </Typography>

                <IconButton color='inherit'>
                    <FilterAltIcon/>
                </IconButton>
                <IconButton color='inherit' href='https://github.com/NiXXeD/lpu-belt-explorer' target='_blank'>
                    <GitHubIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Nav
