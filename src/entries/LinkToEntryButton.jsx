import React, {useCallback, useContext} from 'react'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../contexts/DataContext'

function LinkToEntryButton({entry}) {
    const {getNameFromId} = useContext(DataContext)

    const handleClick = useCallback(async () => {
        const link = new URL(location)
        if (link.host.toLowerCase().startsWith('lpubelts')) {
            link.host = `share.${link.host}`
        }

        await navigator.clipboard.writeText(link.href)
    }, [entry, getNameFromId])

    return (
        <Tooltip title='Copy Link to Entry' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default LinkToEntryButton
