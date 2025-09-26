import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RaffleContext from './RaffleContext.jsx'
import {useNavigate} from 'react-router-dom'

function AdminToolsButton() {
    const {raffleAdmin, raffleAdminRole, setRaffleAdminRole, preview, setPreview} = useContext(RaffleContext)
    const navigate = useNavigate()

    const handleRoleClick = useCallback(() => {
        if (preview && raffleAdminRole) setPreview(false)
        const isAdminRole = raffleAdminRole
        setRaffleAdminRole(!raffleAdminRole)
        if (isAdminRole) navigate('/rafl')
    }, [navigate, preview, raffleAdminRole, setPreview, setRaffleAdminRole])


    const toolTip = raffleAdminRole ? 'Disable Admin Features' : 'Enable Admin Features'
    const color = raffleAdminRole ? '#4c82fd' : '#fff'

    if (!raffleAdmin) return null

    return (
        <React.Fragment>
            <Tooltip title={toolTip} arrow disableFocusListener>
                <IconButton onClick={() => handleRoleClick()} style={{height: 48, width: 48}}>
                    <AdminPanelSettingsIcon style={{color: color}}/>
                </IconButton>
            </Tooltip>
        </React.Fragment>

    )
}

export default AdminToolsButton
