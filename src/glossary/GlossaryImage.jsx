import React, {useCallback, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import ImageViewer from '../misc/ImageViewer'
import useWindowSize from '../util/useWindowSize'

function GlossaryImage({entry, highlighted}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const {width} = useWindowSize()
    const smallWidth = width < 500
    const photoWidth = !smallWidth ? 150 : 110
    const {
        term,
        media: {
            thumbnailUrl,
            sequenceId
        } = {}
    } = entry

    const [open, setOpen] = useState(() => {
        return searchParams.get('image') === sequenceId && highlighted
    })

    const handleClick = useCallback(() => {
        setOpen(true)
        searchParams.set('image', sequenceId)
        searchParams.set('term', term)
        setSearchParams(searchParams)
    }, [searchParams, sequenceId, setSearchParams, term])

    const handleClose = useCallback(() => {
        setOpen(false)
        searchParams.delete('image')
        setSearchParams(searchParams)
    }, [searchParams, setSearchParams])

    if (!thumbnailUrl) return null
    return (
        <React.Fragment>
            <div style={{
                margin: '6px 0px 12px 20px', float: 'right',
                textAlign: 'center', fontSize: '0.85rem'
            }}>
                <img
                    alt={term}
                    src={thumbnailUrl}
                    style={{width: photoWidth, cursor: 'pointer'}}
                    onClick={handleClick}
                />
            </div>

            {open && <ImageViewer
                media={[entry.media]}
                openIndex={sequenceId}
                onClose={handleClose}
                shareParams={{term: entry.term}}
            />}
        </React.Fragment>
    )
}

export default GlossaryImage
