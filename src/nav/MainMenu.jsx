import ListItemIcon from '@mui/material/ListItemIcon'
import React, {useCallback, useContext, useState} from 'react'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Tooltip from '@mui/material/Tooltip'
import {useHotkeys} from 'react-hotkeys-hook'
import {useNavigate} from 'react-router-dom'
import AppContext from '../app/AppContext'
import DBContext from '../app/DBContext'
import MainMenuItem from './MainMenuItem'
import menuConfig from './menuConfig'
import lpuHeaderSmall from '../resources/LPU-header-small.png'

function MainMenu() {
    const {beta} = useContext(AppContext)
    const {adminRole} = useContext(DBContext)
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('m', handleHotkey)

    const goHome = useCallback(() => {
        navigate('/locks')
    }, [navigate])

    const openDrawer = useCallback(() => {
        setOpen(true)
        // Clear current focus to prevent weird issues on mobile
        document.activeElement.blur()
    }, [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <Tooltip title='Main Menu' arrow disableFocusListener>
                <IconButton edge='start' color='inherit' onClick={openDrawer}
                            style={{backgroundColor: '#181818', height: '36px', width: '36px', marginLeft: '-8px'}}
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
                    <MenuItem onClick={goHome} style={{
                        padding: '12px 0px 6px 10px',
                        margin: '0px',
                        backgroundColor: '#292929',
                        borderBottom: '1px solid #000'
                    }}>
                        <ListItemIcon style={{margin: '2px 0px 8px 10px'}}>
                            <img alt='LPU' src={lpuHeaderSmall} width={210}/>
                        </ListItemIcon>
                    </MenuItem>

                    {menuConfig
                        .filter(menuItem => beta || !menuItem.beta)
                        .filter(menuItem => adminRole  || !menuItem.admin)
                        .map((menuItem, index) =>
                            <React.Fragment key={index}>
                                <MainMenuItem
                                    menuItem={menuItem}
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
