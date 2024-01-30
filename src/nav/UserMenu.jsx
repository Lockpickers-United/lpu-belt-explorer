import React, {useCallback, useContext, useState} from 'react'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PersonIcon from '@mui/icons-material/Person'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import AppContext from '../app/AppContext'
import SignInButton from '../auth/SignInButton'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import {useNavigate} from 'react-router-dom'

function UserMenu() {
    const navigate = useNavigate()
    const {beta} = useContext(AppContext)
    const {isLoggedIn, user, logout} = useContext(AuthContext)
    const {lockCollection} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const safeName = lockCollection.displayName
        ? lockCollection.displayName.replace(/\s/g, '_')
        : 'Private'

    const handleClick = useCallback(url => () => {
        handleClose()
        navigate(url)
    }, [handleClose, navigate])

    const handleLogout = useCallback(() => {
        handleClose()
        logout()
    }, [handleClose, logout])

    return (
        <React.Fragment>
            <Tooltip title={isLoggedIn ? user.displayName : 'Account'} arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleOpen} edge='end'>
                    {
                        isLoggedIn
                            ? <Avatar
                                alt={user.displayName}
                                src={user.photoURL}
                                sx={{width: 32, height: 32}}
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
                        {
                            beta &&
                            <MenuItem onClick={handleClick('/profile/edit')}>
                                <ListItemIcon>
                                    <EditIcon/>
                                </ListItemIcon>
                                <ListItemText>Edit Profile</ListItemText>
                            </MenuItem>
                        }
                        {
                            beta &&
                            <MenuItem onClick={handleClick(`/profile/${user.uid}?name=${safeName}`)}>
                                <ListItemIcon>
                                    <AccountBoxIcon/>
                                </ListItemIcon>
                                <ListItemText>View Profile</ListItemText>
                            </MenuItem>
                        }
                        <Divider/>

                        <MenuItem disabled>
                            <ListItemText>My Collection</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick('/locks?tab=search&collection=Own')}>
                            <ListItemIcon>
                                <LockIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Own ({lockCollection.own?.length || 0})</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick('/locks?tab=search&collection=Picked')}>
                            <ListItemIcon>
                                <LockOpenOutlinedIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Picked ({lockCollection.picked?.length || 0})</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick('/locks?tab=search&collection=Recorded')}>
                            <ListItemIcon>
                                <VideocamOutlinedIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Recorded ({lockCollection.recorded?.length || 0})</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick('/locks?tab=search&collection=Wishlist')}>
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
                            <ListItemText>Own</ListItemText>
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

                        <SignInButton onClick={handleClose}/>
                    </div>
                }
            </Menu>
        </React.Fragment>
    )
}

export default UserMenu
