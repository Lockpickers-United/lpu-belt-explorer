import sharp from 'sharp'

export default async function createThumbnails({inputFile, sizes = [400]}) {

    console.log('Creating Thumbnails', inputFile)
    const pathComponents = inputFile.split('/')
    const filename = pathComponents.pop()
    const filenameParts = filename.match(/(.*)\.(.\w*$)/)

    const outputFiles = sizes.map((size) => {
        return {width: size, path: `${pathComponents.join('/')}/${filenameParts[1]}-${size}.${filenameParts[2]}`}
    })

    try {
        // Resize and save all sizes in parallel
        return await Promise.all(outputFiles.map(size => {
            return sharp(inputFile)
                .resize({width: size.width, withoutEnlargement: true})
                .toFile(size.path)
                .then(info => ({
                    original: inputFile,
                    filename: size.path,
                    size: size.width,
                    width: info.width,
                    height: info.height,
                }))
        }))
    } catch (err) {
        console.error('Image processing failed, details:', err.message)
    }

}

