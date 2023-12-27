import queryString from 'query-string'
import React, {useCallback, useContext, useEffect, useState} from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import Tooltip from '@mui/material/Tooltip'
import {useLocation} from 'react-router-dom'
import FilterContext from '../contexts/FilterContext'
import licenses from '../data/licenses'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch'
import useWindowSize from '../util/useWindowSize'
import ytIcon from '../resources/yt.png'
import ImageViewer from '../misc/ImageViewer'

function ImageGallery({entry}) {
    const {width} = useWindowSize()
    const isMobile = width < 736
    const location = useLocation()
    const {filters, addFilter, removeFilters} = useContext(FilterContext)

    const [open, setOpen] = useState(() => {
        return isValidImage(filters.image, entry)
    })

    const handleVideoClick = useCallback(url => () => {
        return window.open(url, '_blank', 'noopener,noreferrer')
    }, [])

    const handleOpen = useCallback(index => () => {
        addFilter('image', index + 1, true)
        setOpen(true)
    }, [addFilter])

    const handleClose = useCallback(() => {
        removeFilters(['image'])
        setOpen(false)
    }, [removeFilters])

    // Handle back button presses
    useEffect(() => {
        const handler = () => {
            const {image} = queryString.parse(location.search)
            if (isValidImage(image, entry)) {
                setOpen(true)
            } else {
                setOpen(false)
            }
        }
        addEventListener('hashchange', handler)
        return () => removeEventListener('hashchange', handler)
    })

    return (
        <React.Fragment>
            {open &&
                <ImageViewer
                    media={entry.media}
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

const isValidImage = (image, entry) => /\d+/.test(image) && !!entry.media[(+image) - 1]

export default ImageGallery
