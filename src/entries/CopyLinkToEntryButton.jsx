import React, {useCallback, useContext} from 'react'
import {enqueueSnackbar} from 'notistack'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../contexts/DataContext'

function CopyLinkToEntryButton({entry}) {
    const {getNameFromId} = useContext(DataContext)

    const handleClick = useCallback(async () => {
        const name = getNameFromId(entry.id)
        const link = `https://share.lpubelts.com/?id=${entry.id}&name=${name}`

        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Link to entry copied to clipboard.')
    }, [entry])

    return (
        <Tooltip title='Copy Link to Entry' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyLinkToEntryButton
