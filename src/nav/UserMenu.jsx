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
import {useNavigate} from 'react-router-dom'
import {useAccess} from '../app/AccessContext.jsx'
import BoltIcon from '@mui/icons-material/Bolt'
import {Collapse, useTheme} from '@mui/material'
import ExpandButton from '../misc/ExpandButton.jsx'
import FlareIcon from '@mui/icons-material/Flare'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import EggIcon from '@mui/icons-material/Egg'
import OutletIcon from '@mui/icons-material/Outlet'

function UserMenu() {
    const navigate = useNavigate()
    const theme = useTheme()
    const {isLoggedIn, user, logout} = useContext(AuthContext)
    const {accessInfo, setAccessPreview, toggleRoleEnabled} = useAccess()
    const {lockCollection} = useContext(DBContext)
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleOpen = useCallback(event => setAnchorEl(event.currentTarget), [])
    const handleClose = useCallback(() => setAnchorEl(null), [])

    console.log('accessInfo', accessInfo)

    const safeName = lockCollection.displayName && !lockCollection.privacyAnonymous
        ? lockCollection.displayName.replace(/\s/g, '_')
        : 'anonymous'
    const displayName = lockCollection.displayName
        ? lockCollection.displayName
        : 'Your Account'
    const accountTooltip = accessInfo.previewRole
        ? `${displayName} (preview: ${previewRoleLabels[accessInfo.previewRole]})`
        : isLoggedIn ? displayName : 'Account'

    const handleClick = useCallback(url => () => {
        handleClose()
        navigate(url)
    }, [handleClose, navigate])

    const handleLogout = useCallback(() => {
        handleClose()
        logout()
    }, [handleClose, logout])

    const [previewOpen, setPreviewOpen] = useState(false)

    const ownerIcon = (import.meta.env.DEV && accessInfo.previewRole === 'admin')

    return (
        <React.Fragment>
            <Tooltip title={accountTooltip} arrow disableFocusListener>
                <IconButton onClick={handleOpen} edge='end'
                            sx={{
                                width: 36,
                                height: 36,
                                margin: '4px',
                                backgroundColor: accessInfo.previewRole ? theme.roles?.[accessInfo.highestRole] : 'inherit'
                            }}>
                    {
                        (isLoggedIn && !ownerIcon)
                            ? <Avatar
                                alt={displayName}
                                src={user.photoURL}
                                sx={{width: 32, height: 32}}
                            />
                            : !ownerIcon
                                ? <AccountCircleIcon/>
                                : <OutletIcon style={{color: '#4c5e75', fontSize: '32px'}}/>
                    }
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                    '.MuiMenuItem-root': {
                        minHeight: '36px', minWidth: '210px'
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
                        {accessInfo.level > 0 &&
                            <Divider/>
                        }
                        {accessInfo.roles.admin &&
                            <MenuItem onClick={() => toggleRoleEnabled('admin')} style={{fontStyle: 'italic'}}>
                                <ListItemIcon>
                                    <BoltIcon
                                        color={accessInfo.enabledRoles.admin ? 'success' : 'default'}
                                    />
                                </ListItemIcon>
                                {accessInfo.enabledRoles.admin ?
                                    <ListItemText>Disable Admin</ListItemText>
                                    :
                                    <ListItemText>Enable Admin</ListItemText>
                                }
                            </MenuItem>
                        }
                        {accessInfo.roles.qaUser &&
                            <MenuItem onClick={() => toggleRoleEnabled('qaUser')} style={{fontStyle: 'italic'}}>
                                <ListItemIcon>
                                    <BiotechIcon color={accessInfo.enabledRoles.qaUser ? 'info' : 'default'}/>
                                </ListItemIcon>
                                {accessInfo.enabledRoles.qaUser
                                    ? <ListItemText>Disable QA Mode</ListItemText>
                                    : <ListItemText>Enable QA Mode</ListItemText>
                                }
                            </MenuItem>
                        }
                        {import.meta.env.DEV && accessInfo.availablePreviewRoles?.length > 0 &&
                            <>
                                <Divider/>
                                <MenuItem aria-expanded={previewOpen} onClick={() => setPreviewOpen(!previewOpen)}>
                                    <ListItemText sx={{
                                        '& .MuiListItemText-primary':
                                            {
                                                mb: 0.5,
                                                color: accessInfo.previewRole ? theme.roles?.[accessInfo.highestRole] : 'inherit',
                                                fontStyle: 'italic'
                                            }
                                    }}>
                                        UI Role Preview
                                    </ListItemText>
                                    <ExpandButton expanded={previewOpen}
                                                  onChange={setPreviewOpen}
                                                  small={true}
                                                  color={accessInfo.previewRole ? theme.roles?.[accessInfo.highestRole] : 'inherit'}
                                    />
                                </MenuItem>
                                <Collapse in={previewOpen}>
                                    <Divider/>
                                    <MenuItem sx={{fontWeight: 600}} selected={!accessInfo.previewRole}
                                              onClick={() => setAccessPreview(null)}>
                                        <ListItemText sx={{
                                            '& .MuiListItemText-primary': {
                                                paddingLeft: 1,
                                                fontWeight: 'bold',
                                                fontStyle: 'italic'
                                            }
                                        }}>
                                            Actual access
                                        </ListItemText>
                                    </MenuItem>
                                    {accessInfo.availablePreviewRoles.map(role =>
                                        <MenuItem key={role} selected={accessInfo.previewRole === role}
                                                  onClick={() => setAccessPreview(role)}>
                                            <ListItemText
                                                sx={{
                                                    '& .MuiListItemText-primary': {
                                                        paddingLeft: 1,
                                                        color: accessInfo.previewRole === role ? theme.roles?.[accessInfo.previewRole] : 'inherit',
                                                        fontStyle: 'italic'
                                                    }
                                                }}>
                                                {previewRoleLabels[role] ?? '[role]'}
                                            </ListItemText>
                                        </MenuItem>
                                    )}
                                    <MenuItem selected={accessInfo.previewRole === 'none'}
                                              onClick={() => setAccessPreview('none')}
                                              sx={{
                                                  '& .MuiListItemText-primary': {
                                                      paddingLeft: 1,
                                                      color: accessInfo.previewRole === 'none' ? theme.menu?.blue : 'inherit'
                                                  }
                                              }}>
                                        <ListItemText>None</ListItemText>
                                    </MenuItem>

                                </Collapse>
                            </>
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
                            <ListItemText>Own ({[...new Set(lockCollection.own || [])].length || 0})</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick(`/profile/${user.uid}?name=${safeName}&collection=Picked`)}>
                            <ListItemIcon>
                                <LockOpenOutlinedIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Picked
                                ({[...new Set(lockCollection.picked || [])].length || 0})</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleClick(`/profile/${user.uid}?name=${safeName}&collection=Wishlist`)}>
                            <ListItemIcon>
                                <SavingsOutlinedIcon fontSize='small'/>
                            </ListItemIcon>
                            <ListItemText>Wishlist
                                ({[...new Set(lockCollection.wishlist || [])].length || 0})</ListItemText>
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

                        <SignInButton onClick={handleClose} menuItem/>
                    </div>
                }
            </Menu>
        </React.Fragment>
    )
}

const previewRoleLabels = {
    none: 'None',
    owner: 'Owner',
    admin: 'Admin',
    classificationAdmin: 'Classification Admin',
    lpuMod: 'LPU Moderator',
    blackBelt: 'Black Belt',
    classificationTeam: 'Classification Team',
    qaUser: 'QA User'
}

export default UserMenu
