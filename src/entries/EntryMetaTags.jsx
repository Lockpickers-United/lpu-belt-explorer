import React from 'react'
import {Helmet} from 'react-helmet-async'

function EntryMetaTags({entry}) {
    const {id, belt, makeModels, version, media = []} = entry

    const title = `Lock Entry: ${belt} Belt`
    const description = makeModels
        .map(({make, model}) => {
            return make && make !== model ? `${make} ${model}` : model
        }).join('\n') + (version ? version : '')
    const imageUrl = media.find(m => !m.fullUrl.includes('youtube'))?.thumbnailUrl
    const link = new URL(window.location.href)
    link.search = `id=${id}&name=${name}`

    return (
        <Helmet>
            <meta property='og:url' content={link.href}/>
            <meta property='og:title' content={title}/>
            <meta property='og:description' content={description}/>
            {imageUrl && <meta property='og:image' content={imageUrl}/>}
        </Helmet>
    )
}

export default EntryMetaTags
