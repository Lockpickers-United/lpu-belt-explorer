import React, {useState} from 'react'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import {Dialog, DialogContent, Slide, Tooltip} from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import CloseIcon from '@mui/icons-material/Close.js'
import Typography from '@mui/material/Typography'

function InfoButton() {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <React.Fragment>
            <Tooltip title='Information'>
                <IconButton color='inherit' onClick={handleOpen}>
                    <InfoOutlinedIcon/>
                </IconButton>
            </Tooltip>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge='start'
                            color='inherit'
                            onClick={handleClose}
                            aria-label='close'
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant='h6' component='div'>
                            Information
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <Typography>TODO</Typography>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />
})

export default InfoButton
