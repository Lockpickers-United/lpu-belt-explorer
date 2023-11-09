import Avatar from '@mui/material/Avatar'
import React, {useCallback, useContext, useState} from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import AuthContext from '../contexts/AuthContext'

function UserMenu() {
    const {isLoggedIn, user, login, logout} = useContext(AuthContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const handleLogin = useCallback(() => {
        setAnchorEl(null)
        login()
    }, [login])

    const handleLogout = useCallback(() => {
        setAnchorEl(null)
        logout()
    }, [logout])

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
                    <MenuItem disabled>
                        <ListItemText>{user.displayName}</ListItemText>
                    </MenuItem>
                }
                {
                    isLoggedIn
                        ? <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Sign Out</ListItemText>
                        </MenuItem>
                        : <MenuItem onClick={handleLogin}>
                            <ListItemIcon>
                                <LoginIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Sign In with Google</ListItemText>
                        </MenuItem>
                }
            </Menu>
        </React.Fragment>
    )
}

export default UserMenu
