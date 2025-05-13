import sharp from 'sharp'

export default async function createThumbnails({inputFile, width = 400}) {

    const pathComponents = inputFile.split('/')
    const filename = pathComponents.pop()
    const filenameParts = filename.match(/(.*)\.(.\w*$)/)
    const outputFile = `${pathComponents.join('/')}/${filenameParts[1]}-${width}.${filenameParts[2]}`
    try {
        // Resize and save all sizes in parallel
            return await sharp(inputFile)
                .resize({width: width, withoutEnlargement: true})
                .toFile(outputFile)
                .then(info => (outputFile)) // eslint-disable-line no-unused-vars
    } catch (err) {
        console.error('Image processing failed, details:', err.message)
    }

}

