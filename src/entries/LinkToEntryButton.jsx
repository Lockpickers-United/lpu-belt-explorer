import React, {useContext} from 'react'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DataContext from '../contexts/DataContext'

function LinkToEntryButton({entry}) {
    const {getNameFromId} = useContext(DataContext)
    const name = getNameFromId(entry.id)
    const link = new URL(window.location.href)
    link.search = `id=${entry.id}&name=${name}`
    if (link.host.toLowerCase().startsWith('lpubelts')) {
        link.host = `share.${link.host}`
    }
    link.hash = ''

    return (
        <Tooltip title='Link to Entry' arrow disableFocusListener>
            <IconButton href={link.href} target='_blank' rel='noopener noreferrer'>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default LinkToEntryButton
