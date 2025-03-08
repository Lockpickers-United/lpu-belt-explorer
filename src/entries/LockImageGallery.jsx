import queryString from 'query-string'
import React, {useCallback, useContext, useMemo} from 'react'
import {useLocation} from 'react-router-dom'
import FilterContext from '../context/FilterContext'
import ImageGallery from '../misc/ImageGallery'

function LockImageGallery({entry}) {
    const location = useLocation()
    const {filters, addFilter, removeFilters} = useContext(FilterContext)

    const handleOpenImage = useCallback(imageNum => {
        addFilter('image', imageNum, true)
    }, [addFilter])

    const handleCloseImage = useCallback(() => {
        removeFilters(['image'])
    }, [removeFilters])

    const handleBackButton = useCallback(() => {
        const {image} = queryString.parse(location.search)
        return isValidImage(image, entry)
    }, [entry, location])

    const openIndex = useMemo(() => {
        return filters.image ? +filters.image : -1
    }, [filters])

    const initiallyOpen = isValidImage(openIndex, entry)

    const mediaLabels = [...new Set(entry.media?.map(({label}) => label))].sort((a, b) => a.localeCompare(b)).filter(x => x)

    const labeledMedia = mediaLabels.length > 0
        ? mediaLabels.map((label) => {
            return {label: label, media: entry.media.filter(({label: l}) => l === label)}
        })
        : [{label: 'allMedia', media: entry.media}]
    if (mediaLabels.length > 0 && entry.media.filter(media => !media.label).length > 0) {
        labeledMedia.push({label: 'Other', media: entry.media.filter(media => !media.label)})
    }

    const sortedMedia = entry.media
        .sort((a, b) => {
            return a.label?.localeCompare(b.label || '')
                || a.sequenceId - b.sequenceId
        })

    return (
        <React.Fragment>
            {labeledMedia.map((group, index) =>
                <React.Fragment key={index}>
                    <div key={index}>
                        {group.label !== 'allMedia' &&
                            <div style={{
                                borderBottom: '1px solid #bbb',
                                marginLeft: 0,
                                fontWeight: 500
                            }}>{group.label}</div>
                        }
                        <ImageGallery
                            media={group.media}
                            allMedia={sortedMedia}
                            openIndex={openIndex}
                            initiallyOpen={initiallyOpen && index === 0}
                            onOpenImage={handleOpenImage}
                            onCloseImage={handleCloseImage}
                            onBackButton={handleBackButton}
                            shareParams={{id: entry.id, name: filters.name}}
                        />
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

const isValidImage = (image, entry) => /\d+/.test(image) && !!entry.media.find(m => m.sequenceId === image)

export default LockImageGallery
