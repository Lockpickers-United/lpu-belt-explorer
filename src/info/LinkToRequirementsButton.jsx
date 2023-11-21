import React, {useCallback} from 'react'
import LinkIcon from '@mui/icons-material/Link'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

function LinkToEntryButton({belt}) {
    const handleClick = useCallback(async () => {
        const link = new URL(window.location.href)
        link.search = `id=beltreqs&tab=${belt}`
        link.hash = ''

        await navigator.clipboard.writeText(link.href)
    }, [belt])

    return (
        <Tooltip title='Copy Link to Requirements' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <LinkIcon/>
            </IconButton>
        </Tooltip>
    )
}

export default React.memo(LinkToEntryButton)
