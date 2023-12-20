import React, {useCallback} from 'react'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'

function LinkToEntryButton() {
    const handleClick = useCallback(async () => {
        const link = new URL(window.location.href)

        await navigator.clipboard.writeText(link.href)
        enqueueSnackbar('Link to belt requirements copied to clipboard.')
    }, [])

    return (
        <Tooltip title='Copy Link to Requirements' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default LinkToEntryButton
