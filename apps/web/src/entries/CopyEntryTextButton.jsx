import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import entryName from './entryName.js'

function CopyEntryTextButton({entry}) {
    const handleClick = useCallback(async () => {
        const text = entryName(entry,'short', {includeVersion: true})
        await navigator.clipboard.writeText(text)
        enqueueSnackbar('Lock name copied to clipboard.')
    }, [entry])

    return (
        <Tooltip title='Copy Lock Name' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <ContentCopyIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyEntryTextButton
