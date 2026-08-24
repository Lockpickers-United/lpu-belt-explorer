import React, {useCallback, useContext, useEffect, useState} from 'react'
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
import AppContext from '../app/AppContext.jsx'
import {useLocalStorage} from 'usehooks-ts'

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

    const {admin} = useContext(AppContext)
    const [flickrDirect, _setFlickrDirect] = useLocalStorage('flickrDirect', false)

    const {isMobile} = useWindowSize()
    const [open, setOpen] = useState(initiallyOpen)

    const fullMedia = allMedia ?? media

    const handleVideoClick = useCallback(url => () => {
        return window.open(url, '_blank', 'noopener,noreferrer')
    }, [])

    const handleOpen = useCallback((imageIndex, fullUrl) => () => {
        console.log({imageIndex, fullUrl})
        onOpenImage(imageIndex, fullUrl)
        !flickrDirect && setOpen(true)
    }, [flickrDirect, onOpenImage])

    const handleClose = useCallback(() => {
        onCloseImage()
        setOpen(false)
    }, [onCloseImage])

    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    //const subtitleText = subtitle
    const mediaAnnotated = media.map(media => {
        const imageId = media.fullUrl.match(/\/(\d{11})\//)
        return {...media, imageId: imageId?.[1]}
    })

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
                {mediaAnnotated.map(({
                                         title,
                                         subtitle,
                                         thumbnailUrl,
                                         fullUrl,
                                         subtitleUrl,
                                         sequenceId,
                                         imageId
                                     }, index) =>
                    <ImageListItem key={index} style={{marginBottom: 8}}>
                        <img
                            src={thumbnailUrl}
                            alt={title}
                            style={{paddingBottom: subtitle ? 60 : 48, cursor: 'pointer'}}
                            onClick={handleOpen(index+1, fullUrl)}
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
                                <a style={{cursor: 'pointer'}}
                                   onClick={() => openInNewTab(admin ? fullUrl : (subtitleUrl || licenses[subtitle]))}>
                                    {admin ? imageId : subtitle}
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
