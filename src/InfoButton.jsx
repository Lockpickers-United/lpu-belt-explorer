import React, {useCallback, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {Tooltip} from '@mui/material'
import InfoDialog from './InfoDialog.jsx'

function InfoButton() {
    const [open, setOpen] = useState(false)
    const handleOpen = useCallback(() => setOpen(true), [])
    const handleClose = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <Tooltip title='Information'>
                <IconButton color='inherit' onClick={handleOpen}>
                    <InfoOutlinedIcon/>
                </IconButton>
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
