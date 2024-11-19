import React, {useCallback} from 'react'
import {enqueueSnackbar} from 'notistack'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

function CopyLinkToRaflPotButton({entry, nameType}) {
    const handleClick = useCallback(async () => {
        const name =  entry.title
        const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const hostname = `${window.location.protocol}//${window.location.host}`
        const link = `${hostname}/#/rafl/?id=${entry.id}&name=${safeName}`
        
        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Link to RAFL pot copied to clipboard.')
    }, [entry])

    return (
        <Tooltip title='Copy Link to Pot' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyLinkToRaflPotButton
