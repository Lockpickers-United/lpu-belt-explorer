import React, {useCallback, useContext, useState} from 'react'
import Box from '@mui/material/Box'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import AuthContext from '../contexts/AuthContext.jsx'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import {useHotkeys} from 'react-hotkeys-hook'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import DBContext from '../contexts/DBContext.jsx'
import Avatar from '@mui/material/Avatar'

function MainMenu() {
    const {lockCollection} = useContext(DBContext)

    const handleFilter = useCallback(() => () => {

    }, [])

    const {isLoggedIn, user} = useContext(AuthContext)
    const [open, setOpen] = useState(false)
    const handleHotkey = useCallback(() => setOpen(!open), [open])
    useHotkeys('m', handleHotkey)

    const openDrawer = useCallback(() => setOpen(true), [])
    const closeDrawer = useCallback(() => setOpen(false), [])


    return (
        <React.Fragment>
            <Tooltip title='Main Menu' arrow disableFocusListener>
                <IconButton color='inherit' onClick={openDrawer} sx={{marginLeft: 3}}>
                    <Badge
                        badgeContent={null}
                        color='secondary'
                        overlap='circular'
                        anchorOrigin={{
                            vertical: 'bottom', horizontal: 'right'
                        }}
                    >
                        <MenuIcon/>
                    </Badge>
                </IconButton>
            </Tooltip>

            <SwipeableDrawer
                anchor='right'
                open={open}
                onOpen={openDrawer}
                onClose={closeDrawer}
            >
                <Toolbar variant='dense'>
                    <Typography variant='h6' onClick={closeDrawer} style={{width: '100%'}}>Main Menu</Typography>
                </Toolbar>
                <Box margin={1}>
                    <Stack direction='column' style={{minWidth: 250}}>
                        <MenuItem sx={{fontWeight: 500}}>Lock Explorer Home</MenuItem>
                        <Divider/>
                        <Tooltip title={isLoggedIn ? user.displayName : 'Account'} arrow disableFocusListener>
                            <IconButton color='inherit' onClick={null} edge='end'>
                                {
                                    isLoggedIn
                                        ? <Avatar
                                            alt={user.displayName}
                                            src={user.photoURL}
                                            sx={{width: 24, height: 24}}
                                        />
                                        : <AccountCircleIcon/>
                                }
                            </IconButton>&nbsp;&nbsp;&nbsp;&nbsp;Sign In/Out
                        </Tooltip>
                        <div>
                            {
                                isLoggedIn &&
                                <div>
                                    <Divider/>
                                    <MenuItem disabled>
                                        <ListItemText>My Collection</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={handleFilter('collection', 'Own')}>
                                        <ListItemIcon>
                                            <LockIcon fontSize='small'/>
                                        </ListItemIcon>
                                        <ListItemText>Own ({lockCollection.own?.length || 0})</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={handleFilter('collection', 'Picked')}>
                                        <ListItemIcon>
                                            <LockOpenOutlinedIcon fontSize='small'/>
                                        </ListItemIcon>
                                        <ListItemText>Picked ({lockCollection.picked?.length || 0})</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={handleFilter('collection', 'Recorded')}>
                                        <ListItemIcon>
                                            <VideocamOutlinedIcon fontSize='small'/>
                                        </ListItemIcon>
                                        <ListItemText>Recorded ({lockCollection.recorded?.length || 0})</ListItemText>
                                    </MenuItem>
                                    <MenuItem onClick={handleFilter('collection', 'Wishlist')}>
                                        <ListItemIcon>
                                            <SavingsOutlinedIcon fontSize='small'/>
                                        </ListItemIcon>
                                        <ListItemText>Wishlist ({lockCollection.wishlist?.length || 0})</ListItemText>
                                    </MenuItem>
                                    <Divider/>

                                </div>
                            }
                            {

                                !isLoggedIn &&
                                <div>
                                    <MenuItem disabled>
                                        <ListItemText>My Collection</ListItemText>
                                    </MenuItem>
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <LockIcon fontSize='small'/>
                                        </ListItemIcon>
                                        <ListItemText>Owned</ListItemText>
                                    </MenuItem>
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <LockOpenOutlinedIcon fontSize='small'/>
                                        </ListItemIcon>
                                        <ListItemText>Picked</ListItemText>
                                    </MenuItem>
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <VideocamOutlinedIcon fontSize='small'/>
                                        </ListItemIcon>
                                        <ListItemText>Recorded</ListItemText>
                                    </MenuItem>
                                    <MenuItem disabled>
                                        <ListItemIcon>
                                            <SavingsOutlinedIcon fontSize='small'/>
                                        </ListItemIcon>
                                        <ListItemText>Wishlist</ListItemText>
                                    </MenuItem>
                                    <Divider/>
                                </div>
                            }

                        </div>
                        <MenuItem style={{padding: '0px 16px'}}>My Profile</MenuItem>
                        <Divider/>
                        <MenuItem style={{padding: '0px 16px'}}>My Collection</MenuItem>
                        <Divider/>
                        <MenuItem>Collection Leaderboard</MenuItem>
                        <Divider/>
                        <MenuItem>More Information</MenuItem>
                        <Divider/>
                    </Stack>
                </Box>
                <Toolbar variant='dense'
                         sx={{textAlign: 'center', display: 'flex', justifyContent: 'flex-end', marginRight: 2}}>
                    <Button
                        variant='outlined'
                        color='inherit'
                        onClick={closeDrawer}
                        style={{display: 'inline-block'}}
                    >
                        Done
                    </Button>
                </Toolbar>
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export default MainMenu
