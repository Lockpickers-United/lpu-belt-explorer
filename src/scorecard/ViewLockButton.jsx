import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import LinkIcon from '@mui/icons-material/Link'
import Tooltip from '@mui/material/Tooltip'
import {useNavigate} from 'react-router-dom'
import entryName from '../entries/entryName'

export default function ViewLockButton({entry}) {
    const navigate = useNavigate()
    const name =  entryName(entry)
    const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')

    const handleClick = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        setTimeout(() => navigate(`/locks?id=${entry.id}&name=${safeName}`), 0)
    }, [entry.id, navigate, safeName])

    return (
        <Tooltip title='View Lock Details' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon style={{width: 18, height: 18}}/>
            </IconButton>
        </Tooltip>
    )
}


