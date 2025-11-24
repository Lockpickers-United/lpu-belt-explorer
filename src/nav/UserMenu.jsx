import React, {useCallback, useContext, useState} from 'react'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import PersonIcon from '@mui/icons-material/Person'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ListAltIcon from '@mui/icons-material/ListAlt'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BiotechIcon from '@mui/icons-material/Biotech'
import AvTimerIcon from '@mui/icons-material/AvTimer'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import SignInButton from '../auth/SignInButton'
import AuthContext from '../app/AuthContext'
import DBContext from '../app/DBContext'
import AppContext from '../app/AppContext'
import {useNavigate} from 'react-router-dom'

function UserMenu() {
    const navigate = useNavigate()
    const {isLoggedIn, user, logout} = useContext(AuthContext)
    const {adminRole, lockCollection, qaUserRole} = useContext(DBContext)
    const {admin, setAdmin, qaUser, setQaUser} = useContext(AppContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])
    const safeName = lockCollection.displayName && !lockCollection.privacyAnonymous
        ? lockCollection.displayName.replace(/\s/g, '_')
        : 'anonymous'

    const displayName = lockCollection.displayName
        ? lockCollection.displayName
        : 'Account'

    const handleClick = useCallback(url => () => {
        handleClose()
        navigate(url)
    }, [handleClose, navigate])

    const handleToggleAdmin = useCallback(() => {
        setAdmin(!admin)
    }, [admin, setAdmin])

    const handleToggleQaUser = useCallback(() => {
        setQaUser(!qaUser)
    }, [qaUser, setQaUser])

    const handleLogout = useCallback(() => {
        handleClose()
        logout()
    }, [handleClose, logout])

    return (
        <React.Fragment>
            <Tooltip title={isLoggedIn ? displayName : 'Account'} arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleOpen} edge='end'>
                    {
                        isLoggedIn
                            ? <Avatar
                                alt={displayName}
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
                sx={{
                    '.MuiMenuItem-root': {
                        minHeight: '36px', minWidth: '190px'
                    }
                }}
            >

                {
                    isLoggedIn &&
                    <div>
                        <MenuItem disabled>
                            <ListItemIcon>
                                <PersonIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>{safeName}</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick('/profile/edit')}>
                            <ListItemIcon>
                                <EditIcon/>
                            </ListItemIcon>
                            <ListItemText>Edit Profile</ListItemText>
                        </MenuItem>
                        {adminRole &&
                            <MenuItem onClick={handleToggleAdmin}>
                                <ListItemIcon>
                                    <AdminPanelSettingsIcon color={admin ? 'success' : 'default'}/>
                                </ListItemIcon>
                                {admin ?
                                    <ListItemText>Disable Admin</ListItemText>
                                    :
                                    <ListItemText>Enable Admin</ListItemText>
                                }
                            </MenuItem>
                        }
                        {qaUserRole &&
                            <MenuItem onClick={handleToggleQaUser}>
                                <ListItemIcon>
                                    <BiotechIcon color={qaUser ? 'info' : 'default'}/>
                                </ListItemIcon>
                                {qaUser
                                    ? <ListItemText>Disable QA Role</ListItemText>
                                    : <ListItemText>Enable QA Role</ListItemText>
                                }
                            </MenuItem>
                        }
                        <Divider/>

                        <MenuItem onClick={handleClick(`/profile/${user.uid}?name=${safeName}`)}>
                            <ListItemIcon>
                                <LibraryBooksIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Lock Collection</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick(`/profile/${user.uid}/safelocks?name=${safeName}`)}>
                            <ListItemIcon>
                                <AvTimerIcon/>
                            </ListItemIcon>
                            <ListItemText>Safe Locks</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick(`/profile/${user.uid}/scorecard?name=${safeName}`)}>
                            <ListItemIcon>
                                <ListAltIcon/>
                            </ListItemIcon>
                            <ListItemText>Scorecard</ListItemText>
                        </MenuItem>
                        <Divider/>

                        <MenuItem disabled>
                            <ListItemText>Lock Collection</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick(`/profile/${user.uid}?name=${safeName}&collection=Own`)}>
                            <ListItemIcon>
                                <LockIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Own ({lockCollection.own?.length || 0})</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick(`/profile/${user.uid}?name=${safeName}&collection=Picked`)}>
                            <ListItemIcon>
                                <LockOpenOutlinedIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Picked ({lockCollection.picked?.length || 0})</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick(`/profile/${user.uid}?name=${safeName}&collection=Wishlist`)}>
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
                            <ListItemIcon>
                                <LibraryBooksIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Lock Collection</ListItemText>
                        </MenuItem>
                        <MenuItem disabled>
                            <ListItemIcon>
                                <AvTimerIcon/>
                            </ListItemIcon>
                            <ListItemText>Safe Locks</ListItemText>
                        </MenuItem>
                        <MenuItem disabled>
                            <ListItemIcon>
                                <ListAltIcon/>
                            </ListItemIcon>
                            <ListItemText>Scorecard</ListItemText>
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
