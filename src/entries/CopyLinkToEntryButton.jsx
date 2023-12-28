import React, {useCallback} from 'react'
import {enqueueSnackbar} from 'notistack'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

function CopyLinkToEntryButton() {
    const urlParams = new URLSearchParams(location.href.split('#').pop())
    const shareURL = 'https://share.lpubelts.com/?id=' + urlParams.get('id') + '&name=' + urlParams.get('name')
    console.log({shareURL})
    const handleClick = useCallback(async () => {
        await navigator.clipboard.writeText(shareURL)
        enqueueSnackbar('Link to entry copied to clipboard.')
    }, [])

    return (
        <Tooltip title='Copy Link to Entry' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyLinkToEntryButton
