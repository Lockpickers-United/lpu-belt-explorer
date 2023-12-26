import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import Divider from '@mui/material/Divider'
import React, {useCallback, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import LPUImage from '../resources/LPU.png'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Tooltip from '@mui/material/Tooltip'
import {useHotkeys} from 'react-hotkeys-hook'
import menuConfig from './menuConfig'

function MainMenu() {
    const [open, setOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('m', handleHotkey)

    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])

    const handleParentClick = useCallback(menuItem => () => {
        const isOpen = menuOpen === menuItem.title
        setMenuOpen(isOpen ? null : menuItem.title)
    }, [menuOpen])

    const menuItemStyle = {padding: '14px 0px 14px 24px'}
    const childItemStyle = {padding: '14px 0px 14px 48px'}

    return (
        <React.Fragment>
            <Tooltip title='Main Menu' arrow disableFocusListener>
                <IconButton edge='start' color='inherit' onClick={openDrawer}>
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
                        padding: '8px 0px 8px 16px', margin: '0px', borderBottom: '1px solid #555'
                    }}>
                        <img alt='LPU' src={LPUImage} width={36} height={36}/>
                        <span style={{
                            fontSize: '1.3rem',
                            fontWeight: 700,
                            padding: '3px 0px 0px 4px'
                        }}>
                            LPU Belt Explorer
                        </span>
                    </MenuItem>

                    {menuConfig.map((menuItem, index) =>
                        <React.Fragment key={index}>
                            <MenuItem style={menuItemStyle} onClick={handleParentClick(menuItem)}>
                                {menuItem.icon &&
                                    <ListItemIcon>
                                        {menuItem.icon}
                                    </ListItemIcon>
                                }

                                <ListItemText>{menuItem.title}</ListItemText>

                                {menuItem.children?.length > 0 &&
                                    <ListItemIcon>
                                        <ExpandMoreIcon
                                            style={{
                                                margin: '0px 16px',
                                                transform: menuOpen === menuItem.title
                                                    ? 'rotate(180)'
                                                    : null
                                        }}
                                        />
                                    </ListItemIcon>
                                }
                            </MenuItem>

                            {menuItem.children && menuItem.children.map((childItem, childIndex) =>
                                <Collapse key={childIndex} in={menuOpen === menuItem.title}>
                                    <MenuItem style={childItemStyle}>
                                        {menuItem.icon &&
                                            <ListItemIcon>
                                                {childItem.icon}
                                            </ListItemIcon>
                                        }
                                        <ListItemText>{childItem.title}</ListItemText>
                                    </MenuItem>
                                </Collapse>
                            )}

                            <Divider style={{margin: 0}}/>
                        </React.Fragment>
                    )}
                </Stack>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default MainMenu
