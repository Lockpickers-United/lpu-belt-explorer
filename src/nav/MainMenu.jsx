import React, {useCallback, useContext, useState} from 'react'
import AuthContext from '../contexts/AuthContext'
import CollectionSubMenu from './CollectionSubMenu.jsx'
import FilterContext from '../contexts/FilterContext'
import HomeIcon from '@mui/icons-material/Home'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LPUImage from '../resources/LPU.png'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Tooltip from '@mui/material/Tooltip'
import {useHotkeys} from 'react-hotkeys-hook'
import {useNavigate} from 'react-router-dom'

function MainMenu() {
    const {isLoggedIn, logout, login} = useContext(AuthContext)
    const {clearFilters, setFilters} = useContext(FilterContext)

    const navigate = useNavigate()

    const [open, setOpen] = useState(false)
    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('m', handleHotkey)

    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])
    
    const handleLogout = useCallback(() => {
        clearFilters() // should only clear collection filters
        navigate('/belts')
        logout()
        closeDrawer()
    }, [closeDrawer, clearFilters, logout, navigate])

    const handleClick = useCallback(url => () => {
        navigate(url)
        closeDrawer()
    }, [closeDrawer, navigate])

    function closeMain() {
        closeDrawer()
    }

    const menuItemStyle = {padding: '14px 0px 14px 24px', borderBottom: '1px solid #555'}

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
                //open='true'
                onOpen={openDrawer}
                onClose={closeDrawer}
            >
                <Stack direction='column' style={{minWidth: 250}}>

                    <div>
                        <MenuItem onClick={closeDrawer} style={{
                            padding: '8px 0px 8px 16px', margin: '0px', borderBottom: '1px solid #555'
                        }}>
                            <img alt='LPU' src={LPUImage} width={36} height={36}/>
                            <span style={{
                                fontSize: '1.3rem',
                                fontWeight: 700,
                                padding: '3px 0px 0px 4px'
                            }}>LPU Belt Explorer</span>
                        </MenuItem>

                        <MenuItem style={menuItemStyle} onClick={handleClick('/belts')}>
                            <ListItemIcon>
                                <HomeIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Home</ListItemText>
                        </MenuItem>

                        <MenuItem style={{margin: 0, padding: 0, borderBottom: '1px solid #555'}}>
                            <CollectionSubMenu closeMain={closeMain} setFilters={setFilters}/>
                        </MenuItem>

                    </div>

                    <MenuItem style={menuItemStyle} onClick={handleClick('/leaderboard')}>
                        <ListItemIcon>
                            <LeaderboardIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Leaderboard</ListItemText>
                    </MenuItem>
                    <MenuItem style={menuItemStyle} onClick={handleClick('/info')}>
                        <ListItemIcon>
                            <InfoOutlinedIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Belt Requirements</ListItemText>
                    </MenuItem>

                    {isLoggedIn &&
                        <MenuItem style={menuItemStyle} onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Sign Out</ListItemText>
                        </MenuItem>
                    }
                    {!isLoggedIn &&
                        <MenuItem style={menuItemStyle} onClick={login}>
                            <ListItemIcon>
                                <LogoutIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Sign In with Google</ListItemText>
                        </MenuItem>
                    }
                </Stack>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default MainMenu
