import React from 'react'
import LinkIcon from '@mui/icons-material/Link.js'
import IconButton from '@mui/material/IconButton'

function LinkToEntryButton({id}) {
    const link = new URL(window.location.href)
    link.search = `id=${id}`

    return (
        <IconButton href={link.href} target='_blank' rel='noopener noreferrer'>
            <LinkIcon/>
        </IconButton>
    )
}

export default React.memo(LinkToEntryButton)
