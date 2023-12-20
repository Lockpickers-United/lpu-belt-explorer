import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import React, {useCallback, useState} from 'react'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {useHotkeys} from 'react-hotkeys-hook'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LPUImage from '../resources/LPU.png'
import HomeIcon from '@mui/icons-material/Home'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

function MainMenu() {
    const [open, setOpen] = useState(false)
    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('m', handleHotkey)

    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <Tooltip title='Main Menu' arrow disableFocusListener>
                <IconButton edge='start' color='inherit' onClick={openDrawer}>
                    <img alt='LPU' src={LPUImage} width={36} height={36}/>
                </IconButton>
            </Tooltip>

            <SwipeableDrawer
                anchor='left'
                open={open}
                onOpen={openDrawer}
                onClose={closeDrawer}
            >
                <Toolbar variant='dense'>
                    <Typography variant='h6' onClick={closeDrawer} style={{width: '100%'}}>Main Menu</Typography>
                </Toolbar>
                <Stack direction='column' style={{minWidth: 250}}>
                    <MenuItem>
                        <ListItemIcon>
                            <HomeIcon  fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Belt Explorer Home</ListItemText>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <LeaderboardIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Leaderboard</ListItemText>
                    </MenuItem>
                    <MenuItem>
                        <ListItemIcon>
                            <InfoOutlinedIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Belt System Information</ListItemText>
                    </MenuItem>
                </Stack>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default MainMenu
