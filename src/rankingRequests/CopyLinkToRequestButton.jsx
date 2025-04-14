import React, {useCallback} from 'react'
import {enqueueSnackbar} from 'notistack'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import entryName from '../entries/entryName'

function CopyLinkToRequestButton({entry, nameType}) {
    const handleClick = useCallback(async () => {
        const name =  entryName(entry, nameType)
        const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const link = `${window.location.origin}/#/content/lockrequest/view?id=${entry.id}&name=${safeName}`
        await navigator.clipboard.writeText(link)
        enqueueSnackbar('Link copied to clipboard.')
    }, [entry, nameType])

    return (
        <Tooltip title='Copy Link to Request' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyLinkToRequestButton
