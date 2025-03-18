import express from 'express';
import http from 'http'
import https from 'https'
import cors from 'cors'
import formidable from 'formidable';
import fs from 'fs';
import EventEmitter from 'events'
import dayjs from 'dayjs'
import archiver from 'archiver'
import {sendEmail} from './projects/nodeMailer/nodeMailer.js'
import {contentUploadRecipients} from './keys/users.js'

const privateKey = fs.readFileSync('./keys/server.key', 'utf8')
const certificate = fs.readFileSync('./keys/server.crt', 'utf8')
const credentials = {key: privateKey, cert: certificate}

const myEmitter = new EventEmitter()
myEmitter.on('myEvent', (data) => {
    const timestamp = dayjs().format('YYYY-MM-DDTHH:mm:ssZ[Z]')
    console.log(timestamp, '-', data)
})

const app = express();
app.use(cors())

app.post('/upload', async (req, res) => {
    myEmitter.emit('myEvent', 'Upload content requested')
    await upload(req, res)
})

const httpServer = http.createServer(app)
const httpsServer = https.createServer(credentials, app)
httpServer.listen(7080, () => {
})
httpsServer.listen(7443, () => {
})

//const uploadDir = path.join('uploads')

const uploadDir = '/home/dh_m5s5pf/uploads'

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

let subdirs = ''
let detailsJson = {}

async function upload(req, res) {
    const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        createDirsFromUploads: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        filter: ({ mimetype }) => mimetype && mimetype.includes('image'),
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
    });

    await form.parse(req, async function (err, fields) {
        if (err) {
            console.error('Error', err)
            res.status(500).send('An error occurred')
            return
        }
        detailsJson = JSON.stringify(fields, null, 2)

        try {
            await fs.writeFile(`${uploadDir}/${subdirs}/uploadData.json`, detailsJson, function (err) {
                if (err) {
                    console.log('writeFile error', err)
                }
            })
        } catch (error) {
            console.log('writeFile error', err)
            res.status(500).send({status: 500, message: 'json write error'})
            return
        }

        const destinationFile = `${uploadDir}/` + `${subdirs}.zip`
        const output = fs.createWriteStream(destinationFile)
        const archive = archiver('zip', {
            zlib: {level: 9} // Sets the compression level.
        })

        output.on('close', () => {
            console.log('Files zipped successfully to', `${subdirs}.zip`)
        })

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
                console.log('Message sent: %s', email.messageId)
            } catch (error) {
                error = 'An error occurred sending email'
                console.error('An error occurred sending email', error.message)
                res.status(500).send({status: 500, message: 'An error occurred sending email'})
                return
            }

            try {
                fs.rmSync(`${uploadDir}/${subdirs}/`, {recursive: true, force: true})
                console.log('Temp directory removed successfully')
            } catch (error) {
                console.error('An error occurred deleteing temp directory', error.message)
                res.status(500).send({status: 500, message: 'An error occurred deleteing temp directory'})
                return
            }
            console.log('done')
        })

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
        archive.directory(`${uploadDir}/${subdirs}/`, false)

        // finalize the archive (ie we are done appending files but streams have to finish yet)
        // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
        await archive.finalize()

        res.status(200).send('Files uploaded successfully')
    })
}


function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
    str = str.replace(/[^a-zA-Z0-9\-_+ ]/g, '') // remove any non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // remove consecutive hyphens
    return str
}
