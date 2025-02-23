import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import RaffleContext from './RaffleContext.jsx'

function AdminRoleButton({active}) {
    const {raffleAdmin, raffleAdminRole, setRaffleAdminRole, preview, setPreview} = useContext(RaffleContext)

    const handleClick = useCallback(() => {
        if (preview && raffleAdminRole) setPreview(false)
        setRaffleAdminRole(!raffleAdminRole)
    },[preview, raffleAdminRole, setPreview, setRaffleAdminRole])

    const toolTip = active ? 'Disable Admin Features' : 'Enable Admin Features'
    const color = raffleAdminRole ? '#4c82fd' : '#fff'

    if (!raffleAdmin) return null

    return (
        <Tooltip title={toolTip} arrow disableFocusListener>
            <IconButton onClick={() => handleClick()} style={{height: 48, width: 48}}>
                <AdminPanelSettingsIcon style={{color: color}}/>
            </IconButton>
        </Tooltip>
    )
}

export default AdminRoleButton
