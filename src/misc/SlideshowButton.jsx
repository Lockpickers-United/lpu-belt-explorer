import React, {useCallback, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Slideshow from './Slideshow'
import SlideshowIcon from '@mui/icons-material/Slideshow'

function SlideshowButton() {
    const [open, setOpen] = useState(false)

    const handleOpen = useCallback(() => setOpen(true), [])
    const handleClose = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <Tooltip title='Slideshow' arrow disableFocusListener>
                <IconButton color='inherit' onClick={handleOpen}>
                    <SlideshowIcon/>
                </IconButton>
            </Tooltip>
            {
                open &&
                <Slideshow
                    open={open}
                    onClose={handleClose}
                />
            }
        </React.Fragment>
    )
}

export default SlideshowButton
