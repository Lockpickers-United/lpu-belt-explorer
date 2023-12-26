import React, {useCallback} from 'react'
import {enqueueSnackbar} from 'notistack'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

function CopyLinkToEntryButton() {
    const handleClick = useCallback(async () => {
        const link = new URL(location)
        link.port = ''
        link.host = 'share.lpubelts.com'
        link.href = link.href.replace('#/belts','')

        await navigator.clipboard.writeText(link.href)
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
