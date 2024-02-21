import queryString from 'query-string'
import React, {useCallback, useContext, useMemo} from 'react'
import {useLocation} from 'react-router-dom'
import FilterContext from '../context/FilterContext'
import ImageGallery from '../misc/ImageGallery'

function LockImageGallery({entry}) {
    const location = useLocation()
    const {filters, addFilter, removeFilters} = useContext(FilterContext)

    const handleOpenImage = useCallback(index => {
        addFilter('image', index + 1, true)
    }, [addFilter])

    const handleCloseImage = useCallback(() => {
        removeFilters(['image'])
    }, [removeFilters])

    const handleBackButton = useCallback(() => {
        const {image} = queryString.parse(location.search)
        return isValidImage(image, entry)
    }, [entry, location])

    const openIndex = useMemo(() => {
        return filters.image ? +filters.image - 1 : -1
    }, [filters])
    const initiallyOpen = isValidImage(openIndex, entry)

    return (
        <ImageGallery
            media={entry.media}
            openIndex={openIndex}
            initiallyOpen={initiallyOpen}
            onOpenImage={handleOpenImage}
            onCloseImage={handleCloseImage}
            onBackButton={handleBackButton}
            shareParams={{id: entry.id, name: filters.name}}
        />
    )
}

const isValidImage = (image, entry) => /\d+/.test(image) && !!entry.media[image]

export default LockImageGallery
