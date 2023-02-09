import React, {useMemo} from 'react'
import {ImageList, ImageListItem, ImageListItemBar} from '@mui/material'
import licenses from './data/licenses.js'
import IconButton from '@mui/material/IconButton'
import LaunchIcon from '@mui/icons-material/Launch.js'
import {useMediaQuery} from 'react-responsive'

function ImageGallery({entry}) {
    const isBigEnough = useMediaQuery({minWidth: 732})

    const items = useMemo(() => {
        return entry.media.map((value, index) => {
            const attribution = entry.attribution[index] || {}
            return {
                title: value.text,
                subtitle: attribution.text,
                thumbUrl: value.url,
                fullUrl: attribution.url,
                licenseUrl: licenses[attribution.text]
            }
        })
    }, [entry])

    return (
        <ImageList variant='masonry' cols={isBigEnough ? 3 : 2}>
            {items.map(({title, subtitle, thumbUrl, fullUrl, licenseUrl}, index) =>
                <ImageListItem key={index} style={{marginBottom: 8}}>
                    <img
                        src={thumbUrl}
                        alt={title}
                        style={{paddingBottom: subtitle ? 60 : 48}}
                    />
                    <ImageListItemBar
                        title={title}
                        subtitle={
                            subtitle &&
                            <a href={licenseUrl} target='_blank' rel='noopener noreferrer'>
                                {subtitle}
                            </a>
                        }
                        actionIcon={
                            fullUrl &&
                            <IconButton
                                href={entry.attribution[index].url}
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
