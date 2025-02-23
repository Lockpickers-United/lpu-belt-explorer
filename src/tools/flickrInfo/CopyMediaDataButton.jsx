import React, {useCallback} from 'react'
import Tooltip from '@mui/material/Tooltip'
import {enqueueSnackbar} from 'notistack'
import Button from '@mui/material/Button'

function CopyMediaDataButton({mediaData}) {
    const handleClick = useCallback(async () => {
        await navigator.clipboard.writeText(mediaData)
        enqueueSnackbar('Media data copied to clipboard.')
    }, [mediaData])

    return (
        <Tooltip title='Copy Media Data' arrow disableFocusListener>
            <Button onClick={handleClick} variant='contained' size='small'
                    style={{marginLeft: 20, height: 40, backgroundColor:'#03ac03'}}>
                Copy media data to clipboard
            </Button>
        </Tooltip>
    )
}

export default CopyMediaDataButton
