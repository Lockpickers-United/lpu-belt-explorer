import React from 'react'
import {Helmet} from 'react-helmet-async'

function EntryMetaTags({entry}) {
    const {belt, makeModels, version, media = []} = entry

    const title = `Lock Entry: ${belt} Belt`
    const description = makeModels
        .map(({make, model}) => {
            return make && make !== model ? `${make} ${model}` : model
        }).join('\n') + (version ? version : '')
    const imageUrl = media.find(m => !m.fullUrl.includes('youtube'))?.thumbnailUrl

    return (
        <Helmet>
            <meta property='og:title' content={title}/>
            <meta property='og:description' content={description}/>
            {imageUrl && <meta property='og:image' content={imageUrl}/>}
        </Helmet>
    )
}

export default EntryMetaTags
