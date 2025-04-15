import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import entryName from './entryName'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

function CopyLinkToEntryButton({entry, nameType}) {

    const openInNewTab = useCallback(() => {
        const name =  entryName(entry, nameType)
        const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const link = `https://lpubelts.com/#/locks?tab=search&search=${entry.id}&id=${entry.id}&name=${safeName}`
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }, [entry, nameType])


    return (
        <Tooltip title='Open Link to Entry in New Tab' arrow disableFocusListener>
            <IconButton onClick={openInNewTab}>
                <OpenInNewIcon color='primary'/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyLinkToEntryButton
