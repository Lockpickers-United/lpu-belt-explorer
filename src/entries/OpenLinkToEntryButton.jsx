import React, {useCallback} from 'react'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import entryName from './entryName'

function CopyLinkToEntryButton({entry, nameType}) {

    const openInNewTab = useCallback(() => {
        const name =  entryName(entry, nameType)
        const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const link = `https://lpubelts.com/#/locks?id=${entry.id}&name=${safeName}`
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [entry, nameType])


    return (
        <Tooltip title='Open Link to Entry in New Tab' arrow disableFocusListener>
            <IconButton onClick={openInNewTab}>
                <LinkIcon color='primary'/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyLinkToEntryButton
