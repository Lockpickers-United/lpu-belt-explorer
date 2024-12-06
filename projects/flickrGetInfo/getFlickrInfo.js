//TESTING IDs
//photoset 72177720322353676
//photo 54185303779

import {createFlickr} from 'flickr-sdk'
import {key} from '../../keys/flickr-keys.js'

const {flickr} = createFlickr(key)

//const photosetId = '72177720322353676'
//console.log(await getFlickrInfo(photosetId))

export default async function getFlickrInfo(photosetId) {

    if (!photosetId) return {error: 'No photoset ID specified'}

    try {
        const getPhotosetInfo = await flickr('flickr.photosets.getInfo', {
            photoset_id: photosetId
        }).then()

        const photosetInfo = getPhotosetInfo.photoset
        const title = photosetInfo.title._content
        const photoCount = photosetInfo.count_photos

        const getPhotos = await flickr('flickr.photosets.getPhotos', {
            photoset_id: photosetId
        }).then()
        const photoList = getPhotos.photoset.photo


        const mediaData = await Promise.all(photoList.map(async (photo, index) => {

            const getInfo = await flickr('flickr.photos.getInfo', {
                photo_id: photo.id
            })

            const mediaInfo = {}
            mediaInfo.seq = index + 1
            mediaInfo.title = getInfo.photo.title._content
            mediaInfo.credit = getInfo.photo.description._content
            const photoPage = getInfo.photo.urls.url[0]._content
            mediaInfo.fullURL = `${photoPage}in/album-${photosetId}/`

            const getSizes = await flickr('flickr.photos.getSizes', {
                photo_id: photo.id
            })

            const thumbnail = getSizes.sizes.size.find(size => size.label === 'Small 400')
            mediaInfo.thumbnailURL = thumbnail.source

            const original = getSizes.sizes.size.find(size => size.label === 'Original')
            mediaInfo.originalURL = original.source

            return mediaInfo

        }))
        return {title: title, photoCount: photoCount, photos: mediaData}

    } catch (err) {
        console.log('err', err)
        return {error: err.stack}
    }

}