import React, {useCallback, useState} from 'react'
import ImageGallery from '../misc/ImageGallery'

function GlossaryImageGallery({entry}) {
    const [openIndex, setOpenIndex] = useState()

    const handleOpenImage = useCallback(index => {
        setOpenIndex(index)
    }, [])

    const handleCloseImage = useCallback(() => {
        setOpenIndex(false)
    }, [])

    return (
        <ImageGallery
            columns={2}
            media={entry.media}
            initiallyOpen={false}
            openIndex={openIndex}
            onOpenImage={handleOpenImage}
            onCloseImage={handleCloseImage}
        />
    )
}

export default GlossaryImageGallery
