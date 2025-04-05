import sharp from 'sharp'

export default function createThumbnails({inputFile, outputFile}) {
    sharp(inputFile)
        .resize(400)
        .toFile(outputFile, function(err) {
            if (err) {
                console.error('Error creating thumbnail:', err)
            } else {
                console.log('Thumbnail created:', outputFile)
            }
        })
}

