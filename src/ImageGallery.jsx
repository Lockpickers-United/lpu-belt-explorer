import React, {useMemo} from 'react'
import {ImageList, ImageListItem, ImageListItemBar} from '@mui/material'
import licenses from './data/licenses.js'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch.js'
import {useMediaQuery} from 'react-responsive'

function ImageGallery({entry}) {
    const isBigEnough = useMediaQuery({minWidth: 732})

    return (
        <ImageList variant='masonry' cols={isBigEnough ? 3 : 2}>
            {entry.media.map(({title, subtitle, thumbnailUrl, fullUrl}, index) =>
                <ImageListItem key={index} style={{marginBottom: 8}}>
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        style={{paddingBottom: subtitle ? 60 : 48}}
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
                            <IconButton
                                href={fullUrl}
                                style={{color: 'rgba(255, 255, 255, 0.5)'}}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <LaunchIcon/>
                            </IconButton>
                        }
                    />
                </ImageListItem>
            )}
        </ImageList>
    )
}

export default ImageGallery
