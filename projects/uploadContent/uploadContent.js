import formidable from '../util/formidable/src/index.js'
import fs from 'fs'
import archiver from 'archiver'
import {sendEmail} from '../nodeMailer/nodeMailer.js'
import {contentUploadRecipients} from '../../keys/users.js'
import util from 'util'
import {exec} from 'child_process'
const execAsync = util.promisify(exec)

/**
 * @prop photoCredit
 * @prop lockId
 */

import {prodUser} from '../../keys/users.js'
const uploadDir = `/home/${prodUser}/uploads`

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}
let subdirs = ''
let detailsJson = {}

export default async function upload(req, res) {
    const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        createDirsFromUploads: true,
        maxFileSize: 30 * 1024 * 1024, // 30MB
        filter: ({mimetype}) => mimetype && mimetype.includes('image'),
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
            }).join('/').replace(/\s+/g, '-')

            //console.log('save location', `${subdirs}/${basename}`)
            return `${subdirs}/${basename}`
        }
    })

    await form.parse(req, async function (err, fields) {
        if (err) {
            console.error('Form Parse Error', err)
            res.status(500).send('A error occurred parsing the form')
            return
        }
        const destination = `${uploadDir}/${subdirs}`.replace(/\s+/g, '-')
        const destinationFile = `${destination}.zip`
        detailsJson = JSON.stringify(fields, null, 2)

        await runCommand(`exiftool -overwrite_original -iptc:Caption-Abstract='By: ${fields.photoCredit}' -Title='${fields.lockName}' -gps:all= -UserComment='${fields.lockId}' '${destination}'`)

        try {
            await fs.writeFile(`${destination}/uploadData.json`, detailsJson, function (err) {
                if (err) {
                    console.error('writeFile error', err)
                    res.status(500).send({status: 500, message: 'JSON write error'})
                }
            })
        } catch (error) {
            console.error('writeFile error', err)
            res.status(500).send({status: 500, message: 'JSON write error'})
            return
        }

        const output = await fs.createWriteStream(destinationFile)
        const archive = archiver('zip', {
            zlib: {level: 9} // Sets the compression level.
        })

        const html = `<strong>Photos uploaded for ${fields.lockFullName} by ${fields.photoCredit}</strong><br/><br/>`
        let fieldsHtml = html + "<table>"
        Object.keys(fields).map((key) => {
            fieldsHtml += `<tr><td>${key}</td><td>${fields[key]}</td></tr>`
        })
        fieldsHtml += '</table>'

        output.on('close', async function () {
            console.log('Files zipped successfully to', destinationFile)
            console.log(archive.pointer() + ' total bytes')
            try {
                const email = await sendEmail({
                    emailConfig: 'content',
                    to: contentUploadRecipients,
                    subject: `Photos uploaded for ${fields.lockFullName} by ${fields.photoCredit}`,
                    text: `Photos uploaded for ${fields.lockFullName} by ${fields.photoCredit} (text)`,
                    html: fieldsHtml,
                    attachments: {filename: `${subdirs}.zip`, path: destinationFile}
                })
                console.log('Message sent: %s', email.messageId)
            } catch (error) {
                error = 'An error occurred sending email'
                console.error('An error occurred sending email', error)
                res.status(500).send({status: 500, message: 'Email send error'})
                return
            }

            try {
                fs.rmSync(`${destination}/`, {recursive: true, force: true})
                console.log('Temp directory removed successfully')
            } catch (error) {
                console.error('An error occurred deleteing temp directory', error.message)
                //res.status(500).send({status: 500, message: 'An error occurred deleting temp directory'})
                return
            }
            console.log('done')
        })

        output.on('end', function () {
            console.log('Data has been drained')
        })
        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                console.warn('archiver warning', err)
                res.status(500).send({status: 500, message: 'File compression error'})
            } else {
                throw err
            }
        })
        archive.on('error', function (err) {
            console.error('archiver error', err)
            res.status(500).send({status: 500, message: 'File compression error'})
        })
        archive.pipe(output)
        archive.directory(`${uploadDir}/${subdirs}/`, false)
        await archive.finalize()

        res.status(200).send('Files uploaded successfully')

    })
}

async function runCommand(command) {
    try {
        const {stdout, stderr} = await execAsync(command)
        console.log('runCommand stdout:', stdout.replace(/\n/g, ''), '      stderr:', stderr)
        //console.log('runCommand stderr:', stderr)
    } catch (error) {
        console.error('runCommand error:', error)
    }
}

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, '') // trim leading/trailing white space
    str = str.replace(/[^a-zA-Z0-9\-_+ ]/g, '') // remove any non-alphanumeric characters
        //.replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // remove consecutive hyphens
    return str
}
