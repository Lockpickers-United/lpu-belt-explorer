import React from 'react'
import LinkIcon from '@mui/icons-material/Link.js'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

function LinkToEntryButton({id}) {
    const link = new URL(window.location.href)
    link.search = `id=${id}`

    return (
        <Tooltip title='Link to Entry' arrow disableFocusListener>
            <IconButton href={link.href} target='_blank' rel='noopener noreferrer'>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default React.memo(LinkToEntryButton)
