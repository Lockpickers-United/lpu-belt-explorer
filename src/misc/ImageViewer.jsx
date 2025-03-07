import React, {useCallback, useState} from 'react'
import LinkIcon from '@mui/icons-material/Link'
import {enqueueSnackbar} from 'notistack'
import queryString from 'query-string'
import LaunchIcon from '@mui/icons-material/Launch'
import Stack from '@mui/material/Stack'
import DialogActions from '@mui/material/DialogActions'
import Fab from '@mui/material/Fab'
import LinearProgress from '@mui/material/LinearProgress'
import CloseIcon from '@mui/icons-material/Close'
import AppBar from '@mui/material/AppBar'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {useHotkeys} from 'react-hotkeys-hook'
import {useSwipeable} from 'react-swipeable'
import licenses from '../data/licenses'
import Transition from '../util/Transition'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import YoutubeSearchedForIcon from '@mui/icons-material/YoutubeSearchedFor'
import useWindowSize from '../util/useWindowSize'
import Tooltip from '@mui/material/Tooltip'

function ImageViewer({media, openIndex, onOpenImage, onClose, shareParams = {}}) {
    const [open, setOpen] = useState(true)
    const [loading, setLoading] = useState(true)
    const [{x: initX, y: initY}, setInitXY] = useState({x: 0, y: 0})
    const [{x: lastX, y: lastY}, setLastXY] = useState({x: 0, y: 0})
    const [{x, y}, setXY] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [moving, setMoving] = useState(false)
    const {isMobile} = useWindowSize()

    const currentMedia = media.find(m => m.sequenceId === openIndex)
    const currentMediaIndex = media.indexOf(currentMedia)

    const {fullSizeUrl, thumbnailUrl, fullUrl, title, subtitle, subtitleUrl, label} = currentMedia || {}
    const imageTitle = label ? `${label} - ${title}` : title

    const handleLoaded = useCallback(() => setLoading(false), [])
    const handleClose = useCallback(() => {
        setOpen(false)
        setTimeout(() => onClose(), 200)
    }, [onClose])

    const handleZoomIn = useCallback(() => setZoom(zoom + zoomIncrement), [zoom])
    const handleZoomOut = useCallback(() => setZoom(Math.max(zoom - zoomIncrement, 1)), [zoom])
    const handleReset = useCallback(() => {
        setXY({x: 0, y: 0})
        setInitXY({x: 0, y: 0})
        setLastXY({x: 0, y: 0})
        setZoom(1)
    }, [])

    const handleNavigatePrevious = useCallback(() => {
        const nextIndex = currentMediaIndex === 0 ? media.length - 1 : currentMediaIndex - 1
        onOpenImage(media[nextIndex].sequenceId)
        handleReset()
        setLoading(true)
    }, [currentMediaIndex, media, onOpenImage, handleReset])
    const handleNavigateNext = useCallback(() => {
        const nextIndex = currentMediaIndex === media.length - 1 ? 0 : currentMediaIndex + 1
        onOpenImage(media[nextIndex].sequenceId)
        handleReset()
        setLoading(true)
    }, [currentMediaIndex, media, onOpenImage, handleReset])

    const handleMoveStart = useCallback(event => {
        if (zoom !== 1) {
            setMoving(true)
            const xy = getCurrentPosition(event)
            const initXY = {
                x: xy.x - lastX, y: xy.y - lastY
            }
            setInitXY(initXY)
        }
    }, [lastX, lastY, zoom])
    const handleMoveDuring = useCallback(event => {
        if (moving) {
            const xy = getCurrentPosition(event)
            const lastXY = {
                x: xy.x - initX, y: xy.y - initY
            }
            setLastXY(lastXY)
            setXY(lastXY)
        }
    }, [moving, initX, initY])
    const handleMoveEnd = useCallback(() => {
        setMoving(false)
    }, [])

    // Keyboard / swipe navigation
    useHotkeys('left', handleNavigatePrevious, {preventDefault: true})
    useHotkeys('right', handleNavigateNext, {preventDefault: true})
    useHotkeys('up', handleZoomIn, {preventDefault: true})
    useHotkeys('down', handleZoomOut, {preventDefault: true})
    const swipeHandlers = useSwipeable({
        onSwipedLeft: handleNavigateNext,
        onSwipedRight: handleNavigatePrevious,
        onSwipedDown: handleClose,
        swipeDuration: 250
    })

    const handleCopyLink = useCallback(async () => {
        const query = queryString.stringify({...shareParams, image: openIndex})
        const href = `https://share.lpubelts.com/?${query}`

        await navigator.clipboard.writeText(href)
        enqueueSnackbar('Link to entry copied to clipboard.')
    }, [openIndex, shareParams])

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
                            {imageTitle}
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

            {
                !isMobile && media.length > 1 &&
                <React.Fragment>
                    <Tooltip title='Previous Image' arrow disableFocusListener>
                        <Fab
                            onClick={handleNavigatePrevious}
                            sx={{
                                position: 'fixed', left: 16, top: '50vh', zIndex: 1000
                            }}>
                            <ArrowBackIcon/>
                        </Fab>
                    </Tooltip>

                    <Tooltip title='Next Image' arrow disableFocusListener>
                        <Fab
                            onClick={handleNavigateNext}
                            sx={{
                                position: 'fixed', right: 16, top: '50vh', zIndex: 1000
                            }}>
                            <ArrowForwardIcon/>
                        </Fab>
                    </Tooltip>
                </React.Fragment>
            }

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
                        transform: `translate3d(${x}px, ${y}px, 0px) scale(${zoom})`,
                        cursor: zoom > 1 ? 'grab' : 'unset',
                        transition: moving ? 'none' : 'all 0.1s',
                        maxWidth: 'calc(100vw - 64px)',
                        maxHeight: 'calc(100vh - 160px)',
                        backgroundSize: 50,
                        transformOrigin: 'center center'

                    }}
                    onLoad={handleLoaded}

                    onTouchStart={handleMoveStart}
                    onMouseDown={handleMoveStart}
                    onTouchMove={handleMoveDuring}
                    onMouseMove={handleMoveDuring}
                    onTouchEnd={handleMoveEnd}
                    onMouseUp={handleMoveEnd}
                    onMouseLeave={handleMoveEnd}

                    {...swipeHandlers}

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
                {
                    isMobile && media.length > 0 &&
                    <Tooltip title='Previous Image' arrow disableFocusListener>
                        <IconButton
                            color='inherit'
                            onClick={handleNavigatePrevious}
                            aria-label='previousImage'
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                    </Tooltip>
                }
                <Tooltip title='Zoom In' arrow disableFocusListener>
                    <IconButton
                        color='inherit'
                        onClick={handleZoomIn}
                        aria-label='zoomIn'
                    >
                        <ZoomInIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title='Reset Zoom' arrow disableFocusListener>
                    <span>
                        <IconButton
                            color='inherit'
                            onClick={handleReset}
                            aria-label='reset'
                            disabled={zoom === 1 && x === 0 && y === 0}
                        >
                            <YoutubeSearchedForIcon/>
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title='Zoom Out' arrow disableFocusListener>
                    <span>
                        <IconButton
                            color='inherit'
                            onClick={handleZoomOut}
                            aria-label='zoomOut'
                            disabled={zoom === 1}
                        >
                            <ZoomOutIcon/>
                        </IconButton>
                    </span>
                </Tooltip>
                <Tooltip title='Copy Link to Image' arrow disableFocusListener>
                    <span>
                        <IconButton
                            color='inherit'
                            onClick={handleCopyLink}
                            aria-label='copyLink'
                        >
                            <LinkIcon/>
                        </IconButton>
                    </span>
                </Tooltip>
                {
                    isMobile && media.length > 0 &&
                    <Tooltip title='Next Image' arrow disableFocusListener>
                        <IconButton
                            color='inherit'
                            onClick={handleNavigateNext}
                            aria-label='nextImage'
                        >
                            <ArrowForwardIcon/>
                        </IconButton>
                    </Tooltip>
                }
            </DialogActions>
        </Dialog>)
}

const getCurrentPosition = event => {
    if (event.touches && event.touches.length) {
        return {x: event.touches[0].pageX, y: event.touches[0].pageY}
    } else {
        return {x: event.pageX, y: event.pageY}
    }
}

const zoomIncrement = 0.4

export default ImageViewer
