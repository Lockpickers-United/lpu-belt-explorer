import Tooltip from '@mui/material/Tooltip'
import React, {useCallback, useContext} from 'react'
import {BugReportOutlined} from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import AppContext from '../app/AppContext'

function ToggleBetaButton() {
    const {beta, setBeta} = useContext(AppContext)

    const handleClick = useCallback(() => {
        setBeta(!beta)
    }, [beta, setBeta])

    return (
        <Tooltip title={`Toggle Beta Features ${beta ? 'Off' : 'On'}`} arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <BugReportOutlined fontSize='small' color={beta ? 'secondary' : 'primary'}/>
            </IconButton>
        </Tooltip>
    )
}

export default ToggleBetaButton
