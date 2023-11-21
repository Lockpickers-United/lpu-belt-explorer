import React, {useCallback, useContext} from 'react'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../contexts/DataContext'

function LinkToEntryButton({entry}) {
    const {getNameFromId} = useContext(DataContext)

    const handleClick = useCallback(async () => {
        const name = getNameFromId(entry.id)
        const link = new URL(window.location.href)
        link.search = `id=${entry.id}&name=${name}`
        if (link.host.toLowerCase().startsWith('lpubelts')) {
            link.host = `share.${link.host}`
        }
        link.hash = ''

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
