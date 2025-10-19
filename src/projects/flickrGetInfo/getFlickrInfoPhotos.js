//TESTING IDs
//photoset 72177720322353676
//photo 54185303779

import {createFlickr} from 'flickr-sdk'
import {key} from '../../../keys/flickr-keys.js'

const {flickr} = createFlickr(key)

const photoUrls = [
    'https://www.flickr.com/photos/lpubeltapp/52913754216/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53448406083/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53448597624/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53448877681/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53448878226/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53448885038/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53448885038/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53449197029/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53450653917/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451579976/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451580256/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451581346/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451705603/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451895759/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451896064/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451897119/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451897689/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451998120/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53451998315/in/album-72177720313919453/',
    'https://www.flickr.com/photos/lpubeltapp/53453275437/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53453276117/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53453276117/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53453551847/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53453551932/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454201586/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454201791/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454201946/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454282012/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53454327983/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454475966/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454476256/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454517004/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454604173/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454613390/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454613605/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53454791324/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454889445/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454889920/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454889920/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454890055/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53454890160/in/album-72177720313869627/',
    'https://www.flickr.com/photos/lpubeltapp/53455206281/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455315816/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455330808/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455330808/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455330808/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455331238/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455441238/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455518409/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455518929/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455520604/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455520744/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455618090/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53455728065/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53456009048/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53457185357/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53457185852/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53457186222/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458112556/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458112556/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458112976/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458113446/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458237508/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458237938/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458241978/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458422274/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53458422619/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458422864/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458522005/in/album-72177720313944555/',
    'https://www.flickr.com/photos/lpubeltapp/53458546730/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53460471757/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53460933487/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53461276101/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53461454624/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53461454729/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53461528278/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53461528573/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53461853341/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53461853781/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53461984533/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53462037248/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53462160549/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53462259685/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53464425787/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53464982397/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53465908136/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53467494412/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53467772702/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53467773027/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53468228215/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53468679871/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53468680226/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53468821110/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53468998464/in/album-72177720313985501/',
    'https://www.flickr.com/photos/lpubeltapp/53469949070/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53469949135/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470288778/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470288993/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470331139/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470331516/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470358003/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470409520/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470466339/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470466569/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470477672/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53470618405/in/album-72177720314012610/',
    'https://www.flickr.com/photos/lpubeltapp/53470636482/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53471476312/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53471476312/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53471476417/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53471523318/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53471564862/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53471695479/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53471802380/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53471802620/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53471802860/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53472383621/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53472465197/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53473373491/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53473373671/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53473513653/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53473683759/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53473718329/in/album-72177720314155751/',
    'https://www.flickr.com/photos/lpubeltapp/53475759669/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53475862860/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53475863370/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53476644017/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53476725867/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53477628621/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53477628956/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53477677593/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53481213271/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53481327427/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53481357758/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53481623790/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53482369033/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53482369238/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53482809619/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53484623463/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53484781194/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53484805404/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53484890270/in/album-72177720314210693/',
    'https://www.flickr.com/photos/lpubeltapp/53496823347/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53497186777/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53497186912/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53497707951/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53498034751/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53498034866/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53498129105/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53498189258/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53498224303/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53498338309/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53498338429/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53498338979/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53500636863/in/album-72177720314444642/',
    'https://www.flickr.com/photos/lpubeltapp/53518343856/in/album-72177720314691759/',
    'https://www.flickr.com/photos/lpubeltapp/53895730907/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53896649381/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53896892538/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53896892538/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53896892893/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53896990284/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53896990389/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53896990719/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53896991514/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53897075085/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53897075195/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53897075710/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/53897075710/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/54004575811/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/54004613192/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/54004806248/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/54004997805/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/54004997980/in/album-72177720319269835/',
    'https://www.flickr.com/photos/lpubeltapp/54006881709/in/album-72177720319269835/'
]

const mediaInfo = await getFlickrInfoPhotos(photoUrls)

mediaInfo.photos.forEach(photo => {
    console.log(`${photo.URL}\t${photo.thumbnailURL}`)
})

export default async function getFlickrInfoPhotos(photoUrls) {

    if (!photoUrls) return {error: 'No photos URLs specified'}

    try {

        const mediaData = await Promise.all(photoUrls.map(async (photoUrl, index) => {

            const { photoId, albumId } = extractFlickrIds(photoUrl)

            const getInfo = await flickr('flickr.photos.getInfo', {
                photo_id: photoId
            })

            const mediaInfo = {}

            const getSizes = await flickr('flickr.photos.getSizes', {
                photo_id: photoId
            })

            const thumbnail = getSizes.sizes.size.find(size => size.label === 'Small 400')
            mediaInfo.thumbnailURL = thumbnail.source
            mediaInfo.URL = photoUrl

            return mediaInfo

        }))
        return {photos: mediaData}

    } catch (err) {
        console.log('err', err)
        return {error: err.stack}
    }

}


function extractFlickrIds(u) {
    const m = u.match(/\/photos\/[^/]+\/(\d+)\/in\/album-(\d+)(?:\/|$)/)
    if (!m) return { photoId: null, albumId: null }
    const [, photoId, albumId] = m
    return { photoId, albumId }
}
