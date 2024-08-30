import React, {useCallback} from 'react'
import IconButton from '@mui/material/IconButton'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import {enqueueSnackbar} from 'notistack'

function CopyEntryTextButton({entry}) {
    const handleClick = useCallback(async () => {
        await navigator.clipboard.writeText(entry.id)
        enqueueSnackbar('ID copied to clipboard.')
    }, [entry.id])

    return (
            <IconButton onClick={handleClick} style={{marginRight:210}}>
                <FingerprintIcon color='primary'/>
            </IconButton>
    )
}

export default CopyEntryTextButton
