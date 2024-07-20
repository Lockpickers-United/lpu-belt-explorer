import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import LinkIcon from '@mui/icons-material/Link'
import Tooltip from '@mui/material/Tooltip'
import entryName from '../entries/entryName'

export default function ViewLockButton({entry}) {
    const name =  entryName(entry)
    const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')

    const handleClick = useCallback(event => {
        event.preventDefault()
        event.stopPropagation()
        const url = `${window.location.origin}/#/locks?id=${entry.id}&name=${safeName}`
        console.log(url)
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [entry.id, safeName])

    return (
        <Tooltip title='View Lock Details' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon style={{width: 18, height: 18}}/>
            </IconButton>
        </Tooltip>
    )
}


