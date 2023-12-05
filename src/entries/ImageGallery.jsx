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
import ImageViewer from '../misc/ImageViewer'

function ImageGallery({entry}) {
    const {width} = useWindowSize()
    const isMobile = width < 736
    const [openImage, setOpenImage] = useState(() => {
        const {hash} = window.location
        const [, index] = (hash.match(/#image-(\d+)/) || [])
        if (index > -1) {
            // Delay this so scrolling to entry can occur
            setTimeout(() => {
                // Make a history entry so the back button will exit dialog instead of app
                history.replaceState({}, '', window.location.pathname + window.location.search)
                history.pushState({}, '', `#image-${index}`)
                setOpenImage(index)
            }, 50)
        }
        return -1
    })

    const handleVideoClick = useCallback(url => () => {
        return window.open(url, '_blank', 'noopener,noreferrer')
    }, [])

    const handleOpen = useCallback(index => () => {
        setOpenImage(index)
        history.pushState({}, '', `#image-${index}`)
    }, [])

    const handleClose = useCallback(() => {
        setOpenImage(-1)
        history.pushState({}, '', window.location.pathname + window.location.search)
    }, [])

    // Handle back button presses
    useEffect(() => {
        const handler = () => {
            const {hash} = window.location
            const [, index] = (hash.match(/#image-(\d+)/) || [])
            setOpenImage(index || -1)
        }
        addEventListener('hashchange', handler)
        return () => removeEventListener('hashchange', handler)
    })

    return (
        <React.Fragment>
            {
                openImage >= 0 &&
                <ImageViewer
                    media={entry.media}
                    startIndex={openImage}
                    onClose={handleClose}
                />
            }
            <ImageList variant='masonry' cols={isMobile ? 2 : 3} sx={{marginTop: 2}}>
                {entry.media.map(({title, subtitle, thumbnailUrl, fullUrl, subtitleUrl}, index) =>
                    <ImageListItem key={index} style={{marginBottom: 8}}>
                        <img
                            src={thumbnailUrl}
                            alt={title}
                            style={{paddingBottom: subtitle ? 60 : 48, cursor: 'pointer'}}
                            onClick={handleOpen(index)}
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
