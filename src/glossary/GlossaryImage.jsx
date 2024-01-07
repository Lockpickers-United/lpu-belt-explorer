import React, {useCallback, useState} from 'react'
import ImageViewer from '../misc/ImageViewer'
import useWindowSize from '../util/useWindowSize'

function GlossaryImage({entry}) {
    const {width} = useWindowSize()
    const smallWidth = width < 500
    const photoWidth = !smallWidth ? 150 : 110
    const {
        term,
        media: {
            thumbnailUrl
        } = {}
    } = entry
    const [open, setOpen] = useState(false)

    const handleClick = useCallback(() => {
        setOpen(true)
    }, [])

    const handleClose = useCallback(() => {
        setOpen(false)
    }, [])

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
                openIndex={0}
                onClose={handleClose}
            />}
        </React.Fragment>
    )
}

export default GlossaryImage
