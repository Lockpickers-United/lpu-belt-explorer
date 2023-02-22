import React, {useEffect, useState} from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close.js'
import Typography from '@mui/material/Typography'
import {Dialog, DialogContent, Slide} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import useWindowSize from './useWindowSize.js'

function InfoDialog({open, onClose}) {
    const {width} = useWindowSize()
    const [infoText, setInfoText] = useState()
    const isMobile = width <= 500

    useEffect(() => {
        if (!infoText) {
            const loadInfoText = async () => {
                const value = (await import('./data/info.md?raw')).default
                setInfoText(value)
            }
            loadInfoText()
        }
    }, [infoText])

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
                    {infoText}
                </ReactMarkdown>
            </DialogContent>
        </Dialog>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />
})

export default InfoDialog
