import React from 'react'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

function LinkToEntryButton({entry}) {
    const {id, makeModels} = entry
    const {make, model} = makeModels[0]
    const makeModel = make && make !== model ? `${make} ${model}` : model
    const name = makeModel.replace(/[\s/]/g, '_').replace(/\W/g, '')
    const link = new URL(window.location.href)
    link.search = `id=${id}&name=${name}`
    if (link.host.toLowerCase().startsWith('lpubelts')) {
        link.host = `share.${link.host}`
    }

    return (
        <Tooltip title='Link to Entry' arrow disableFocusListener>
            <IconButton href={link.href} target='_blank' rel='noopener noreferrer'>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default LinkToEntryButton
