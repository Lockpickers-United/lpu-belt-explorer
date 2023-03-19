import React, {useCallback, useState} from 'react'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import InfoDialog from './InfoDialog'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {useHotkeys} from 'react-hotkeys-hook'

function InfoButton({icon}) {
    const [open, setOpen] = useState(false)
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleClose = useCallback(() => setOpen(false), [])
    const handleHotkey = useCallback(() => {
        if (!icon) return false
        else setOpen(!open)
    }, [icon, open])
    useHotkeys('i', handleHotkey)

    const button = icon
        ? (
            <IconButton color='inherit' onClick={handleOpen}>
                <InfoOutlinedIcon/>
            </IconButton>
        )
        : (
            <Button color='inherit' onClick={handleOpen}>
                Read more...
            </Button>
        )

    return (
        <React.Fragment>
            <Tooltip title='Information' arrow disableFocusListener>
                {button}
            </Tooltip>
            <InfoDialog
                open={open}
                onClose={handleClose}
            />
        </React.Fragment>
    )
}

export default InfoButton
