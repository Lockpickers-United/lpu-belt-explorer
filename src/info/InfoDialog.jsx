import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import ReactMarkdown from 'react-markdown'
import useWindowSize from '../util/useWindowSize'
import introMd from '../resources/intro.md?raw'
import infoMd from '../resources/info.md?raw'
import changelogMd from '../resources/changelog.md?raw'
import Transition from '../util/Transition'

function InfoDialog({open, onClose}) {
    const {width} = useWindowSize()
    const isMobile = width <= 500

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={Transition}
            fullScreen={isMobile}
            scroll='body'
        >
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge='start'
                        color='inherit'
                        onClick={onClose}
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
                <ReactMarkdown linkTarget='_blank' style={{overflowX: 'wrap'}}>
                    {markdown}
                </ReactMarkdown>
            </DialogContent>
        </Dialog>
    )
}

const markdown = [
    introMd,
    infoMd,
    changelogMd
].join('\n\n---\n\n')

export default InfoDialog
