import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import entryName from './entryName.js'

export default function CopyEntryTextButtonAdmin({entry}) {
    const handleClick = useCallback(async () => {
        const name = entryName(entry,'short', {includeVersion: true})
        const text = `${entry.id}\t${entry.belt}\t${name}`
        await navigator.clipboard.writeText(text)
        enqueueSnackbar('Lock data copied to clipboard.')
    }, [entry])

    return (
        <Tooltip title='Copy Lock Data' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <ContentCopyIcon style={{color: '#90c274'}}/>
            </IconButton>
        </Tooltip>
    )
}
