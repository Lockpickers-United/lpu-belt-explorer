import React, {useCallback} from 'react'
import {enqueueSnackbar} from 'notistack'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

function CopyLinkToRaflPotButton({entry}) {
    const handleClick = useCallback(async (event) => {
        event.preventDefault()
        event.stopPropagation()
        const name =  entry.title
        const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const hostname = `${window.location.protocol}//${window.location.host}`
        const param = window.location.host !== 'lpubelts.com' ? `&h=${hostname}` : '' //eslint-disable-line

        const link = `https://share.lpubelts.com/?id=${entry.id}&name=${safeName}`
        
        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Link to RAFL pot copied to clipboard.')
    }, [entry])

    return (
        <Tooltip title='Copy Link to Pot' arrow disableFocusListener>
            <IconButton onClick={handleClick} style={{height:36, width:36}}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyLinkToRaflPotButton
