import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import Button from '@mui/material/Button'

function CopyTextButton({text, title = 'Text'}) {

    const handleClick = useCallback(async () => {
        await navigator.clipboard.writeText(text)
        enqueueSnackbar(`${title} copied to clipboard.`)
    }, [text, title])

    if (!text) {
        return null
    }

    return (
        <Tooltip title={`Copy ${title}`} arrow disableFocusListener>
            {text
                ? <Button variant='outlined' size='small' onClick={handleClick}
                          style={{color: '#ddd', borderColor: '#aaa'}} startIcon={<ContentCopyIcon/>}>
                    Copy
                </Button>
                : <IconButton onClick={handleClick}>
                    <ContentCopyIcon/>
                </IconButton>
            }
        </Tooltip>
    )
}

export default CopyTextButton
