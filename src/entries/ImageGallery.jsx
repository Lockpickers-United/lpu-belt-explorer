import React, {useCallback} from 'react'
import {ImageList, ImageListItem, ImageListItemBar, Tooltip} from '@mui/material'
import licenses from '../data/licenses.js'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch.js'
import useWindowSize from '../util/useWindowSize.jsx'

function ImageGallery({entry}) {
    const {width} = useWindowSize()
    const isMobile = width < 736

    const handleClick = useCallback(url => {
        return () => window.open(url, '_blank', 'noopener,noreferrer')
    }, [])

    return (
        <ImageList variant='masonry' cols={isMobile ? 2 : 3} sx={{marginTop: 0}}>
            {entry.media.map(({title, subtitle, thumbnailUrl, fullUrl}, index) =>
                <ImageListItem key={index} style={{marginBottom: 8}}>
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        style={{paddingBottom: subtitle ? 60 : 48, cursor: 'pointer'}}
                        onClick={handleClick(fullUrl)}
                    />
                    <ImageListItemBar
                        title={title}
                        subtitle={
                            subtitle &&
                            <a href={licenses[subtitle]} target='_blank' rel='noopener noreferrer'>
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
    )
}

export default ImageGallery
