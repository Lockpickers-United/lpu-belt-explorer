import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React, {useCallback, useState} from 'react'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import LPUImage from '../resources/LPU.png'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Tooltip from '@mui/material/Tooltip'
import {useHotkeys} from 'react-hotkeys-hook'
import MainMenuItem from './MainMenuItem'
import menuConfig from './menuConfig'
import lpuHeaderSmall from '../resources/LPU-header-small.png'


function MainMenu() {
    const [open, setOpen] = useState(false)
    const [openTitle, setOpenTitle] = useState('My Collection')

    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('m', handleHotkey)

    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <Tooltip title='Main Menu' arrow disableFocusListener>
                <IconButton edge='start' color='inherit' onClick={openDrawer}
                            style={{ backgroundColor: '#181818', height:'36px', width:'36px', marginLeft:'-8px'}}
                >
                    <MenuIcon/>
                </IconButton>
            </Tooltip>

            <SwipeableDrawer
                anchor='left'
                open={open}
                onOpen={openDrawer}
                onClose={closeDrawer}
            >
                <Stack direction='column' style={{minWidth: 250}}>
                    <MenuItem onClick={closeDrawer} style={{
                        padding: '12px 0px 6px 10px',
                        margin: '0px',
                        backgroundColor:'#292929',
                        borderBottom:'1px solid #000'
                    }}>
                        <ListItemIcon style={{margin:'2px 0px 8px 10px'}}>
                            <img alt='LPU' src={lpuHeaderSmall} width={210}/>
                        </ListItemIcon>

                        <ListItemText>
                            <span style={{
                                fontSize: '1.3rem',
                                fontWeight: 700,
                                paddingLeft: 4
                            }}></span>
                        </ListItemText>
                    </MenuItem>

                    {menuConfig.map((menuItem, index) =>
                        <React.Fragment key={index}>
                            <MainMenuItem
                                menuItem={menuItem}
                                openTitle={openTitle}
                                onOpen={setOpenTitle}
                                onClose={closeDrawer}
                            />
                            <Divider style={{margin: 0}}/>
                        </React.Fragment>
                    )}
                </Stack>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default MainMenu
