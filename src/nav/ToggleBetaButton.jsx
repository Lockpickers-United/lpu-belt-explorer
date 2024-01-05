import {BugReportOutlined} from '@mui/icons-material'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import React, {useCallback, useContext} from 'react'
import AppContext from '../app/AppContext'

function ToggleBetaButton({onToggle}) {
    const {beta, setBeta} = useContext(AppContext)

    const handleClick = useCallback(() => {
        setBeta(!beta)
        onToggle()
    }, [beta, setBeta, onToggle])

    return (
        <MenuItem onClick={handleClick}>
            <ListItemIcon>
                <BugReportOutlined fontSize='small'/>
            </ListItemIcon>
            <ListItemText>Toggle Beta Features {beta ? 'Off' : 'On'}</ListItemText>
        </MenuItem>
    )
}

export default ToggleBetaButton
