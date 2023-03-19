import React, {useCallback, useState} from 'react'
import {Button, Tooltip} from '@mui/material'
import InfoDialog from './InfoDialog.jsx'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {useHotkeys} from 'react-hotkeys-hook'

function InfoButton({icon}) {
    const [open, setOpen] = useState(false)
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleClose = useCallback(() => setOpen(false), [])
    useHotkeys('i', () => {
        if (!icon) return false
        setOpen(true)
    })

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
            {
                open &&
                <InfoDialog
                    open={open}
                    onClose={handleClose}
                />
            }
        </React.Fragment>
    )
}

export default InfoButton
