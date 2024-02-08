import React, {useCallback, useMemo} from 'react'
import {useSearchParams} from 'react-router-dom'
import ImageGallery from '../misc/ImageGallery'

function LockImageGallery({entry}) {
    const [searchParams, setSearchParams] = useSearchParams()
    const image = searchParams.get('image')

    const handleOpenImage = useCallback(index => {
        searchParams.set('image', index + 1)
        setSearchParams(searchParams)
    }, [searchParams, setSearchParams])

    const handleCloseImage = useCallback(() => {
        searchParams.delete('image')
        setSearchParams(searchParams)
    }, [searchParams, setSearchParams])

    const handleBackButton = useCallback(() => {
        return isValidImage(image, entry)
    }, [entry, image])

    const openIndex = useMemo(() => {
        return image ? +image - 1 : -1
    }, [image])
    const initiallyOpen = isValidImage(openIndex, entry)

    return (
        <ImageGallery
            media={entry.media}
            openIndex={openIndex}
            initiallyOpen={initiallyOpen}
            onOpenImage={handleOpenImage}
            onCloseImage={handleCloseImage}
            onBackButton={handleBackButton}
            shareParams={{id: entry.id, name: searchParams.get('name')}} // TODO: add lock name
        />
    )
}

const isValidImage = (image, entry) => /\d+/.test(image) && !!entry.media[image]

export default LockImageGallery
