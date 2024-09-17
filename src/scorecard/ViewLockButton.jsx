import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import LinkIcon from '@mui/icons-material/Link'
import Tooltip from '@mui/material/Tooltip'
import entryName from '../entries/entryName'
import {useNavigate} from 'react-router-dom'

export default function ViewLockButton({entry, color}) {
    const navigate = useNavigate()
    const name =  entryName(entry)
    const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')

    const iconColor = color ? color : '#fff'

    const handleClick = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        navigate(`/locks?id=${entry.id}&name=${safeName}`)
    }, [entry.id, navigate, safeName])

    return (
        <Tooltip title='View Lock Details' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon style={{width: 18, height: 18, color:iconColor}}/>
            </IconButton>
        </Tooltip>
    )
}

