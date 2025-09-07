import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RaffleContext from './RaffleContext.jsx'
import PollIcon from '@mui/icons-material/Poll'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import {useNavigate} from 'react-router-dom'
import PreviewButton from './PreviewButton.jsx'

function AdminToolsButton() {
    const {raffleAdmin, raffleAdminRole, setRaffleAdminRole, preview, setPreview} = useContext(RaffleContext)
    const navigate = useNavigate()

    const route = window.location['hash']


    const handleRoleClick = useCallback(() => {
        if (preview && raffleAdminRole) setPreview(false)
        const isAdminRole = raffleAdminRole
        setRaffleAdminRole(!raffleAdminRole)
        if (isAdminRole) navigate('/rafl')
    }, [navigate, preview, raffleAdminRole, setPreview, setRaffleAdminRole])

    const handleClick = useCallback((route) => {
        navigate(route)
    }, [navigate])

    const toolTip = raffleAdminRole ? 'Disable Admin Features' : 'Enable Admin Features'
    const color = raffleAdminRole ? '#4c82fd' : '#fff'

    if (!raffleAdmin) return null

    return (
        <React.Fragment>
            {raffleAdminRole &&
                <React.Fragment>
                    {route === '#/rafl' &&
                        <PreviewButton/>
                    }
                    <Tooltip title={'View Pot List'} arrow disableFocusListener disableHoverListener={route === '#/rafl'}>
                        <IconButton onClick={() => handleClick('/rafl')} style={{height: 48, width: 48}}>
                            <AddToPhotosIcon style={{color: route === '#/rafl' ? '#0b0' : '#fff'}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={'Reports'} arrow disableFocusListener disableHoverListener={route.includes('/rafl/reports')}>
                        <IconButton onClick={() => handleClick('/rafl/reports')} style={{height: 48, width: 48}}>
                            <PollIcon style={{color: route.includes('/rafl/reports') ? '#0b0' : '#fff'}}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={'Raffle Entry Admin'} arrow disableFocusListener disableHoverListener={route.includes('/rafl/admin')}>
                        <IconButton onClick={() => handleClick('/rafl/admin')} style={{height: 48, width: 48}}>
                            <LibraryBooksIcon style={{color: route.includes('/rafl/admin') ? '#0b0' : '#fff'}}/>
                        </IconButton>
                    </Tooltip>
                </React.Fragment>
            }
            <Tooltip title={toolTip} arrow disableFocusListener>
                <IconButton onClick={() => handleRoleClick()} style={{height: 48, width: 48}}>
                    <AdminPanelSettingsIcon style={{color: color}}/>
                </IconButton>
            </Tooltip>
        </React.Fragment>

    )
}

export default AdminToolsButton
