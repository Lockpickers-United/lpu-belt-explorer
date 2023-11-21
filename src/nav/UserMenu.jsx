import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import React, {useCallback, useContext, useState} from 'react'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PersonIcon from '@mui/icons-material/Person'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import SignInButton from '../auth/SignInButton'
import AuthContext from '../contexts/AuthContext'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import DBContext from '../contexts/DBContext'
import FilterContext from '../contexts/FilterContext'

function UserMenu() {
    const {isLoggedIn, user, logout} = useContext(AuthContext)
    const {setFilters, removeFilters} = useContext(FilterContext)
    const {lockCollection} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    const handleFilter = useCallback((filterKey, filterValue) => () => {
        handleClose()
        setFilters({
            [filterKey]: filterValue,
            tab: 'search'
        })
    }, [setFilters, handleClose])

    const handleLogout = useCallback(() => {
        handleClose()
        removeFilters(['collection'])
        logout()
    }, [handleClose, removeFilters, logout])

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
                            <ListItemText>Owned ({lockCollection.own?.length || 0})</ListItemText>
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
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Sign Out</ListItemText>
                        </MenuItem>
                    </div>
                }
                <div>
                    <SignInButton onClick={handleClose}/>
                </div>
            </Menu>
        </React.Fragment>
    )
}

export default UserMenu
