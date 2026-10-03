import React, {useCallback, useContext} from 'react'
import IconButton from '@mui/material/IconButton'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import {enqueueSnackbar} from 'notistack'
import Tooltip from '@mui/material/Tooltip'
import DBContext from '../app/DBContext.jsx'

function CopyEntryTextButton({entry}) {
    const {isBlackBelt} = useContext(DBContext)

    const handleClick = useCallback(async () => {
        await navigator.clipboard.writeText(entry.id)
        enqueueSnackbar('ID copied to clipboard.')
    }, [entry.id])

    return (
        <Tooltip title='Copy Entry Id' arrow disableFocusListener>
            <IconButton onClick={handleClick}>
                <FingerprintIcon style={{color: isBlackBelt ? '#555' : '#000'}}/>
            </IconButton>
        </Tooltip>
    )
}

export default CopyEntryTextButton
