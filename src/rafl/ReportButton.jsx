import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {useNavigate} from 'react-router-dom'
import PollIcon from '@mui/icons-material/Poll'

function ReportButton({active}) {
    const navigate = useNavigate()

    const handleClick = useCallback(() => {
        if (!active) { navigate('/rafl/reports') }
        else { navigate('/rafl') }
    },[active, navigate])

    const toolTip = active ? 'Return to RAFL' : 'View Reports'
    const color = active ? '#0b0' : '#fff'


    return (
        <Tooltip title={toolTip} arrow disableFocusListener>
            <IconButton onClick={() => handleClick()} style={{height: 48, width: 48}}>
                <PollIcon style={{color: color}}/>
            </IconButton>
        </Tooltip>
    )
}

export default ReportButton
