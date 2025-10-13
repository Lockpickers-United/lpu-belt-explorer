import React, {useCallback, useEffect, useState} from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Tooltip from '@mui/material/Tooltip'
import licenses from '../data/licenses'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch'
import useWindowSize from '../util/useWindowSize'
import ytIcon from '../resources/yt.png'
import ImageViewer from './ImageViewer'

function ImageGallery(props) {
    const {
        columns,
        media,
        allMedia,
        initiallyOpen,
        openIndex,
        onOpenImage,
        onCloseImage,
        onBackButton,
        shareParams
    } = props

    const {isMobile} = useWindowSize()
    const [open, setOpen] = useState(initiallyOpen)

    const fullMedia = allMedia ?? media

    const handleVideoClick = useCallback(url => () => {
        return window.open(url, '_blank', 'noopener,noreferrer')
    }, [])

    const handleOpen = useCallback(sequenceId => () => {
        onOpenImage(sequenceId)
        setOpen(true)
    }, [onOpenImage])

    const handleClose = useCallback(() => {
        onCloseImage()
        setOpen(false)
    }, [onCloseImage])

    // Handle back button presses
    useEffect(() => {
        const handler = () => {
            if (onBackButton) {
                const result = onBackButton()
                return setOpen(result)
            }
            return setOpen(false)
        }
        addEventListener('hashchange', handler)
        return () => removeEventListener('hashchange', handler)
    })

    const cols = columns ?? (isMobile ? 2 : 3)

    return (
        <React.Fragment>
            {open &&
                <ImageViewer
                    media={fullMedia}
                    openIndex={openIndex}
                    onOpenImage={onOpenImage}
                    onClose={handleClose}
                    shareParams={shareParams}
                />
            }
            <ImageList variant='masonry' cols={cols} sx={{marginTop: 2}}>
                {media.map(({title, subtitle, thumbnailUrl, fullUrl, subtitleUrl, sequenceId}, index) =>
                    <ImageListItem key={index} style={{marginBottom: 8}}>
                        <img
                            src={thumbnailUrl}
                            alt={title}
                            style={{paddingBottom: subtitle ? 60 : 48, cursor: 'pointer'}}
                            onClick={handleOpen(sequenceId)}
                            loading='lazy'
                        />
                        {
                            fullUrl?.match(/youtube\.com/) &&
                            <img
                                src={ytIcon}
                                alt={title}
                                style={{
                                    alignItems: 'center',
                                    position: 'absolute',
                                    top: 'calc(50% - 65px)',
                                    left: 'calc(50% - 40px)',
                                    width: 80,
                                    height: 80,
                                    cursor: 'pointer'
                                }}
                                onClick={handleVideoClick(fullUrl)}
                                loading='lazy'
                            />
                        }
                        <ImageListItemBar
                            title={title}
                            subtitle={
                                subtitle &&
                                <a href={subtitleUrl || licenses[subtitle]} target='_blank' rel='noopener noreferrer'>
                                    {subtitle}
                                </a>
                            }
                            actionIcon={
                                fullUrl &&
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
                            }
                        />
                    </ImageListItem>
                )}
            </ImageList>
        </React.Fragment>
    )
}

export default ImageGallery
