import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import LaunchIcon from '@mui/icons-material/Launch'
import Stack from '@mui/material/Stack'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'
import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {useHotkeys} from 'react-hotkeys-hook'
import AppContext from '../contexts/AppContext'
import LazyDataContext from '../contexts/LazyDataContext'
import licenses from '../data/licenses'
import Transition from '../util/Transition'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import Tooltip from '@mui/material/Tooltip'

function Slideshow({onClose}) {
    const {data} = useContext(LazyDataContext)
    const media = useMemo(() => {
        return data
            .filter(datum => datum.media)
            .flatMap(datum => datum.media.map(m => ({
                entry: datum,
                ...m
            })))
    }, [data])

    const [visible, setVisible] = useState(false)
    const [open, setOpen] = useState(true)
    const [loading, setLoading] = useState(true)
    const [index, setIndex] = useState(0)

    const {setTab, setExpanded} = useContext(AppContext)

    const randomMedia = useCallback(() => {
        const index = Math.floor(Math.random() * media.length)
        return media[index]
    }, [media])

    const [entries, setEntries] = useState([randomMedia()])
    const {entry} = entries[index]
    const {fullSizeUrl, thumbnailUrl, fullUrl, title, subtitle, subtitleUrl} = entries[index]

    const handleLoaded = useCallback(() => {
        setLoading(false)
        setVisible(true)
    }, [])
    const handleClose = useCallback(() => {
        setOpen(false)
        setTimeout(() => onClose(), 200)
    }, [onClose])

    const handleNextRandomImage = useCallback(() => {
        setVisible(false)

        setTimeout(() => {
            const newEntries = entries.length > 4 ? entries.slice(1, 5) : [...entries]
            newEntries.push(randomMedia())
            setEntries(newEntries)
            setIndex(newEntries.length - 1)
        }, 1000)
    }, [entries, randomMedia])

    const handleNavigatePrevious = useCallback(() => {
        if (index > 0) {
            setIndex(index - 1)
            setLoading(true)
        }
    }, [index])
    const handleNavigateNext = useCallback(() => {
        if (index === entries.length - 1) {
            handleNextRandomImage()
        } else {
            setIndex(index + 1)
            setLoading(true)
        }
    }, [index, entries, handleNextRandomImage])

    const handleGoToLock = useCallback(() => {
        setTab(entry.belt.replace(/\s\d/g, ''))
        setExpanded(entry.id)
        handleClose()
    }, [entry, handleClose, setExpanded, setTab])

    useHotkeys('left', handleNavigatePrevious, {preventDefault: true})
    useHotkeys('right', handleNavigateNext, {preventDefault: true})

    useEffect(() => {
        const intervalId = setInterval(handleNextRandomImage, 10000) // 10 seconds
        return () => clearInterval(intervalId)
    }, [entries, index, handleNextRandomImage])

    return (
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

                    <Stack direction='column' sx={{marginLeft: 2, width: '100%'}}>
                        <Typography variant='subtitle1' component='div'>
                            {title}
                        </Typography>
                        <Typography variant='subtitle2' component='div' style={{color: '#777'}}>
                            <a href={subtitleUrl || licenses[subtitle]} target='_blank' rel='noopener noreferrer'>
                                {subtitle}
                            </a>
                        </Typography>
                    </Stack>

                    <Tooltip title='View Full Size' arrow disableFocusListener>
                        <IconButton
                            href={fullUrl}
                            style={{color: 'rgba(255, 255, 255, 0.5)'}}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <LaunchIcon/>
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            {loading && <LinearProgress color='secondary'/>}

            <DialogContent style={{
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            }}>
                <img
                    draggable={false}
                    style={{
                        maxWidth: '100vw',
                        maxHeight: 'calc(100vh - 128px)',
                        backgroundSize: 50,
                        transformOrigin: 'center center',
                        ...(visible ? styles.visible : styles.hidden)
                    }}
                    onLoad={handleLoaded}

                    title={title}
                    src={fullSizeUrl || thumbnailUrl}
                    alt={title}
                />
            </DialogContent>
            <DialogActions
                sx={{
                    maxHeight: 64,
                    display: 'flex',
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Tooltip title='Previous Image' arrow disableFocusListener>
                    <span>
                        <IconButton
                            color='inherit'
                            onClick={handleNavigatePrevious}
                            aria-label='previousImage'
                            disabled={index === 0}
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title='Go To Lock' arrow disableFocusListener>
                    <span>
                        <IconButton
                            color='inherit'
                            onClick={handleGoToLock}
                            aria-label='goToLock'
                        >
                            <FindInPageIcon/>
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title='Next Image' arrow disableFocusListener>
                    <IconButton
                        color='inherit'
                        onClick={handleNavigateNext}
                        aria-label='nextImage'
                    >
                        <ArrowForwardIcon/>
                    </IconButton>
                </Tooltip>
            </DialogActions>
        </Dialog>)
}

const styles = {
    visible: {
        visibility: 'visible',
        opacity: 1,
        transition: 'opacity 1s linear'
    },

    hidden: {
        visibility: 'hidden',
        opacity: 0,
        transition: 'visibility 0s 1s, opacity 1s linear'
    }
}

export default Slideshow
