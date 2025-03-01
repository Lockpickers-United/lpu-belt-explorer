import formidable, {errors as formidableErrors} from './src/index.js'
import fs from 'fs'
import archiver from 'archiver'
import {sendEmail} from '../nodeMailer/nodeMailer.js'
import {contentUploadRecipients} from '../../keys/users.js'


export default async function uploadContent(req) {

    let subdirs = ''
    let responseJson = {}

    const form = formidable({
        defaultInvalidName: 'invalid',
        uploadDir: `uploads`,
        keepExtensions: true,
        createDirsFromUploads: true,
        allowEmptyFiles: true,
        minFileSize: 0,
        filename(name, ext, part) {
            const {originalFilename} = part
            if (!originalFilename) {
                return 'invalid'
            }

            const originaFilenameParts = originalFilename.split('/')
            const filename = originaFilenameParts.pop()
            const filenameParts = filename.split('.')
            const fileExt = filenameParts.pop()
            const basename = slugify(filenameParts.join('.')) + '.' + slugify(fileExt)

            subdirs = originaFilenameParts.map((subdir) => {
                return slugify(subdir)
            })

            console.log('save location', `${subdirs}/${basename}`)
            return `${subdirs}/${basename}`

        },
        filter: function ({mimetype}) {
            // return Boolean(originalFilename)
            // or, keep only images
            return mimetype?.includes('image')
        }

        // maxTotalFileSize: 4000,
        // maxFileSize: 1000,
    })

    await form.parse(req, async function (err, fields) {
        if (err) {
            console.error('formidable error', err)
        }

        responseJson = JSON.stringify(fields, null, 2)

        await fs.writeFile(`uploads/${subdirs}/uploadData.json`, responseJson, function (err) {
            if (err) {
                console.log('writeFile error', err)
                responseJson.error = 'json write error'
            }
        })

        const destinationFile = 'uploads/' + `${subdirs}.zip`
        const output = fs.createWriteStream(destinationFile)
        const archive = archiver('zip', {
            zlib: {level: 9} // Sets the compression level.
        })

        output.on('close', () => {
            console.log('Files zipped successfully to', `${subdirs}.zip`)
        })

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', async function () {
            console.log(archive.pointer() + ' total bytes')
            try {
                const email = await sendEmail({
                    emailConfig: 'content',
                    to: contentUploadRecipients,
                    subject: `Photos uploaded for ${fields.lockFullName} by ${fields.photoCredit}`,
                    text: `Photos uploaded for ${fields.lockFullName} by ${fields.photoCredit} (text)`,
                    html: `Photos uploaded for ${fields.lockFullName} by ${fields.photoCredit}`,
                    attachments: {filename: `${subdirs}.zip`, path: destinationFile}
                })
                console.log("Message sent: %s", email.messageId)
            } catch (error) {
                console.error('An error occurred sending email', error.message)
            }

            try {
                fs.rmSync(`uploads/${subdirs}/`, {recursive: true, force: true})
                console.log('Temp directory removed successfully')
            } catch (error) {
                console.error('An error occurred deleteing temp directory', error.message)
            }
            console.log('done')
        })

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the Node.js Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function () {
            console.log('Data has been drained')
        })

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                console.error('archiver error', err)
            } else {
                throw err
            }
        })

        // good practice to catch this error explicitly
        archive.on('error', function (err) {
            throw err
        })

        // pipe archive data to the file
        archive.pipe(output)

        // append files from a subdirectory, putting its contents at the root of archive
        archive.directory(`uploads/${subdirs}/`, false)

        // finalize the archive (ie we are done appending files but streams have to finish yet)
        // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
        await archive.finalize()

        return responseJson

    }).then()

    // TODO: why isn't this working?
    return responseJson

}


function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
    str = str.replace(/[^a-zA-Z0-9\-_+ ]/g, '') // remove any non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // remove consecutive hyphens
    return str
}
