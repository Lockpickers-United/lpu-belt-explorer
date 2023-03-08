import React from 'react'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

function LinkToEntryButton({belt}) {
    const link = new URL(window.location.href)
    link.search = `id=beltreqs&belt=${belt}`

    return (
        <Tooltip title='Link to Requirements' arrow disableFocusListener>
            <IconButton href={link.href} target='_blank' rel='noopener noreferrer'>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default React.memo(LinkToEntryButton)
