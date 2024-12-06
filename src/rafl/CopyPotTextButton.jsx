import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'

function CopyPotTextButton({entry}) {
    const handleClick = useCallback(async () => {
        const text = entry.title
        await navigator.clipboard.writeText(text)
        enqueueSnackbar('Pot name copied to clipboard.')
    }, [entry])

    return (
        <Tooltip title='Copy RAFL pot name' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <ContentCopyIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyPotTextButton
