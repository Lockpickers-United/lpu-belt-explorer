import React, {useCallback, useState} from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Tooltip from '@mui/material/Tooltip'
import licenses from '../data/licenses'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch'
import useWindowSize from '../util/useWindowSize'
import ytIcon from '../resources/yt.png'
import Lightbox from './ReactAwesomeLightbox'
import 'react-awesome-lightbox/build/style.css'

function ImageGallery({entry}) {
    const {width} = useWindowSize()
    const isMobile = width < 736
    const [openImage, setOpenImage] = useState(-1)

    const handleVideoClick = useCallback(url => () => {
        return window.open(url, '_blank', 'noopener,noreferrer')
    }, [])

    const handleImageClick = useCallback((event, index) => {
        const {fullUrl} = entry.media[index]
        return window.open(fullUrl, '_blank', 'noopener,noreferrer')
    })
    const handleOpen = useCallback(index => () => setOpenImage(index), [])
    const handleClose = useCallback(() => setOpenImage(-1), [])

    return (
        <React.Fragment>
            {
                openImage >= 0 &&
                <Lightbox
                    startIndex={openImage}
                    allowRotate={false}
                    allowReset={false}
                    images={entry.media.map(entry => ({
                        url: entry.fullSizeUrl || entry.thumbnailUrl,
                        title: `${entry.title} (${entry.subtitle})`
                    }))}
                    onClick={handleImageClick}
                    onClose={handleClose}
                />
            }
            <ImageList variant="masonry" cols={isMobile ? 2 : 3} sx={{marginTop: 0}}>
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
                                <a href={subtitleUrl || licenses[subtitle]} target="_blank" rel="noopener noreferrer">
                                    {subtitle}
                                </a>
                            }
                            actionIcon={
                                fullUrl &&
                                <Tooltip title="View Full Size" arrow disableFocusListener>
                                    <IconButton
                                        href={fullUrl}
                                        style={{color: 'rgba(255, 255, 255, 0.5)'}}
                                        target="_blank"
                                        rel="noopener noreferrer"
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
