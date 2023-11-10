import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import React, {useCallback, useContext, useState} from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PersonIcon from '@mui/icons-material/Person'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import AppContext from '../contexts/AppContext'
import AuthContext from '../contexts/AuthContext'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import FilterContext from '../contexts/FilterContext'

function UserMenu() {
    const {setTab} = useContext(AppContext)
    const {addFilter, removeFilters} = useContext(FilterContext)
    const {isLoggedIn, user, login, logout} = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const handleFilter = useCallback((filterKey, filterValue) => () => {
        handleClose()
        setTab('search')
        addFilter(filterKey, filterValue, true)
    }, [addFilter, handleClose])

    const handleLogin = useCallback(() => {
        handleClose()
        login()
    }, [login, handleClose])

    const handleLogout = useCallback(() => {
        handleClose()
        removeFilters(['collection'])
        logout()
    }, [logout, handleClose])

    return (
        <React.Fragment>
            <Tooltip title={isLoggedIn ? user.displayName : 'Account'} arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleOpen} edge='end'>
                    {
                        isLoggedIn
                            ? <Avatar
                                alt={user.displayName}
                                src={user.photoURL}
                                sx={{ width: 24, height: 24 }}
                            />
                            : <AccountCircleIcon/>
                    }
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {
                    isLoggedIn &&
                    <div>
                        <MenuItem disabled>
                            <ListItemIcon>
                                <PersonIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>{user.displayName}</ListItemText>
                        </MenuItem>
                        <Divider/>
                        <MenuItem disabled>
                            <ListItemText>My Collection</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleFilter('collection', 'Own')}>
                            <ListItemIcon>
                                <LockIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Owned</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleFilter('collection', 'Picked')}>
                            <ListItemIcon>
                                <LockOpenOutlinedIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Picked</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleFilter('collection', 'Recorded')}>
                            <ListItemIcon>
                                <VideocamOutlinedIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Recorded</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleFilter('collection', 'Wishlist')}>
                            <ListItemIcon>
                                <SavingsOutlinedIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Wishlist</ListItemText>
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Sign Out</ListItemText>
                        </MenuItem>
                    </div>
                }
                {
                    !isLoggedIn &&
                    <div>
                        <MenuItem onClick={handleLogin}>
                            <ListItemIcon>
                                <LoginIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Sign In with Google</ListItemText>
                        </MenuItem>
                    </div>
                }
            </Menu>
        </React.Fragment>
    )
}

export default UserMenu
