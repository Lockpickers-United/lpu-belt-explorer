import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import React, {useCallback, useContext, useState} from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import AppContext from '../contexts/AppContext'

function UserMenu() {
    const {beta} = useContext(AppContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const signedIn = false

    const handleClick = useCallback(() => {
        console.log('TBD')
    }, [])

    if (!beta) return null
    return (
        <React.Fragment>
            <Tooltip title='Account' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleOpen} edge='end'>
                    <AccountCircleIcon/>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClick}>
                    <ListItemIcon>
                        {
                            signedIn
                                ? <LogoutIcon fontSize='small'/>
                                : <LoginIcon fontSize='small'/>
                        }
                    </ListItemIcon>
                    <ListItemText>Sign In</ListItemText>
                </MenuItem>
            </Menu>
        </React.Fragment>

    )
}

export default UserMenu
