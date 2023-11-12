import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import React, {useCallback, useState} from 'react'
import ReactMarkdown from 'react-markdown'
import Transition from '../util/Transition'
import IconButton from '@mui/material/IconButton'
import privacyPolicyMd from '../resources/privacyPolicy.md?raw'

function PrivacyPolicyButton() {
    const [open, setOpen] = useState(false)
    const handleOpen = useCallback(event => {
        event.preventDefault()
        setOpen(true)
    }, [])
    const handleClose = useCallback(() => setOpen(false), [])

    return (
        <React.Fragment>
            <a href='' onClick={handleOpen}>
                Privacy
            </a>
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                fullScreen
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
                            Privacy Policy
                        </Typography>
                    </Toolbar>
                </AppBar>
                <DialogContent>
                    <ReactMarkdown linkTarget='_blank' style={{overflowX: 'wrap'}}>
                        {privacyPolicyMd}
                    </ReactMarkdown>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default PrivacyPolicyButton
