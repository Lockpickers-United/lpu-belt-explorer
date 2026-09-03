import queryString from 'query-string'
import React, {useCallback, useContext, useMemo} from 'react'
import {useLocation} from 'react-router-dom'
import FilterContext from '../context/FilterContext'
import ImageGallery from '../misc/ImageGallery'
import {useLocalStorage} from 'usehooks-ts'

const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
}

function LockImageGallery({entry}) {
    const location = useLocation()
    const {filters, addFilter, removeFilters} = useContext(FilterContext)
    const [flickrDirect, _setFlickrDirect] = useLocalStorage('flickrDirect', false)
    
    const handleOpenImage = useCallback((imageNum, fullUrl) => {
        //console.log('handleOpenImage', imageNum, fullUrl)
        if (!flickrDirect) {
            addFilter('image', imageNum, true)
        } else {
            openInNewTab(fullUrl)
        }
    }, [addFilter, flickrDirect])

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

    //console.log('openIndex', openIndex, isValidImage(openIndex, entry))

    const initiallyOpen = isValidImage(openIndex, entry)

    const filteredMedia = filters.photographers
        ? entry.media.filter(({title}) => title.includes(filters.photographers))
        : entry.media

    const sequencedMedia = filteredMedia
        .sort((a, b) => {
            return a.sequenceId - b.sequenceId
        })
        .map((media, index) => ({...media, imageIndex: index+1}))

    const mediaLabels = [...new Set(sequencedMedia?.map(({label}) => label))].filter(x => x)
    const labeledMedia = mediaLabels.length > 0
        ? mediaLabels.map((label) => {
            return {label: label, media: sequencedMedia.filter(({label: l}) => l === label)}
        })
        : [{label: 'allMedia', media: sequencedMedia}]
    if (mediaLabels.length > 0 && sequencedMedia.filter(media => !media.label).length > 0) {
        labeledMedia.push({label: 'Other', media: sequencedMedia.filter(media => !media.label)})
    }

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
                            allMedia={sequencedMedia}
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

const isValidImage = (image, entry) => /\d+/.test(image)
    && image > 0 && image <= (entry.media.length)

export default LockImageGallery
