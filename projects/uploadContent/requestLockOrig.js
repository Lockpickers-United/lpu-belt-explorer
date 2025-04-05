import formidable from './src/index.js'
import fs from 'fs'
const {writeFile} = fs.promises;
import archiver from 'archiver'
import {sendEmail} from '../nodeMailer/nodeMailer.js'
import {contentUploadRecipients} from '../../keys/users.js'
import util from 'util'
import {exec} from 'child_process'
import {prodUser} from '../../keys/users.js'
import {spaceJoin} from '../util/stringUtils.js'

const execAsync = util.promisify(exec)
import dayjs from 'dayjs'
import {jsonIt} from '../util/jsonIt.js'

/**
 * @prop discordUsername
 * @prop redditUsername
 * @prop newBrand
 */

const uploadDir = `/home/${prodUser}/explore.lpubelts.com/public/img/requestedLocks`
const datafile = `/home/${prodUser}/explore.lpubelts.com/public/data/requestedLocks.json`
const serverPath = 'https://explore.lpubelts.com/img/requestedLocks'

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

export default async function upload(req, res) {
    let subdirs = ''
    let detailsJson = {}
    let filepaths = []

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
            }).join('').replace(/\s+/g, '-')

            //console.log('save location', `${uploadDir}/${subdirs}/${basename}`)
            filepaths.push(`${serverPath}/${subdirs}/${basename}`)
            return `${subdirs}/${basename}`
        }
    })

    await form.parse(req, async function (err, fields) {

        jsonIt('form fields', fields)

        if (err) {
            console.error('Form Parse Error', err)
            res.status(500).send('A error occurred parsing the form')
            return
        }

        // Normalize fields to arrays
        for (const fieldName in fields) {
            if (!Array.isArray(fields[fieldName])) {
                fields[fieldName] = [fields[fieldName]];
            }
        }

        const lockName = spaceJoin(fields.make || fields.newBrand, fields.model)

        const entry = {
            lockName,
            makeModels: [{make: fields.make?.firstValue() || fields.newBrand?.firstValue(), model: fields.model.firstValue()}],
            lockingMechanisms: fields.lockingMechanisms?.length ? fields.lockingMechanisms[0].split(',') : [],
            features:  fields.features?.length ? fields.features[0].split(',') : [],
            id: fields.id?.firstValue(),
            approximateBelt: fields.approxBelt?.firstValue(),
            usernames: {
                discord: fields.discordUsername?.firstValue(),
                reddit: fields.redditUsername?.firstValue(),
            },
            userBelt: fields.userBelt?.firstValue(),
            notes: fields.notes?.firstValue(),
            media: filepaths?.map((filepath, index) => {
                return {
                    title: `By: ${fields.discordUsername || fields.redditUsername}`,
                    fullUrl: filepath,
                    fullSizeUrl: filepath,
                    thumbnailUrl: filepath,
                    sequenceId: index,
                    dateAdded: dayjs().toISOString(),
                    subtitle: 'CC BY-NC-SA 4.0',
                }
            }),
            dateRequested: dayjs().toISOString()
        }

        let currentRequests = []

        try {
            const latestJson = forceFreshRead(datafile)
            currentRequests = JSON.parse(latestJson)
        } catch (error) {
            console.error('Error reloading JSON file:', error)
        }

        currentRequests.push(entry)

        try {
            await writeFile(datafile, JSON.stringify(currentRequests, null, 2), 'utf8');
        } catch (err) {
            console.error('writeFile error', err);
            res.status(500).send({status: 500, message: 'JSON write error'});
            return;
        }

        const destination = `${uploadDir}/${subdirs}`.replace(/\s+/g, '-')
        const destinationFile = `${destination}.zip`
        if (subdirs) {
            detailsJson = JSON.stringify(fields, null, 2)

            await runCommand(`exiftool -overwrite_original -iptc:Caption-Abstract='By: ${fields.discordUsername || fields.redditUsername}' -Title='${lockName}' -gps:all= -UserComment='${fields.id}' '${destination}'`)

            await fs.writeFile(`${destination}/uploadData.json`, detailsJson, function (err) {
                if (err) {
                    console.error('writeFile error', err)
                    res.status(500).send({status: 500, message: 'JSON write error'})
                }
            })

            const output = await fs.createWriteStream(destinationFile)
            const archive = archiver('zip', {
                zlib: {level: 9} // Sets the compression level.
            })


            output.on('close', async function () {
                console.log('Files zipped successfully to', destinationFile)
                console.log(archive.pointer() + ' total bytes')
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

        }

        const html = `<strong>Lock addition request for ${lockName} by ${fields.photoCredit}</strong><br/><br/>`
        let fieldsHtml = html + '<table style=\'border-width:1px\'>'
        Object.keys(fields).map((key) => {
            fieldsHtml += `<tr><td>${key}</td><td>${fields[key]}</td></tr>`
        })
        fieldsHtml += '</table>'

        try {
            const email = await sendEmail({
                emailConfig: 'content',
                to: contentUploadRecipients,
                subject: `Lock Request: ${lockName}`,
                text: `Lock Request: ${lockName}`,
                html: fieldsHtml,
                attachments: subdirs ? {filename: `${subdirs}.zip`, path: destinationFile} : null
            })
            console.log('Message sent: %s', email.messageId)
        } catch (error) {
            error = 'An error occurred sending email'
            console.error('An error occurred sending email', error)
            res.status(500).send({status: 500, message: 'Email send error'})
            return
        }

        try {
            fs.rmSync(`${destinationFile}`, {recursive: true, force: true})
            console.log('Zip file removed successfully')
        } catch (error) {
            console.error('An error occurred deleting zip file', error.message)
            //res.status(500).send({status: 500, message: 'An error occurred deleting temp directory'})
            return
        }
        console.log('done')


        res.status(200).send('Files uploaded successfully')

    })
}

function forceFreshRead(filePath) {
    const fd = fs.openSync(filePath, 'r');
    const stats = fs.fstatSync(fd);
    const buffer = Buffer.alloc(stats.size);
    fs.readSync(fd, buffer, 0, stats.size, 0);
    fs.closeSync(fd);
    return buffer.toString('utf8');
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
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-') // remove consecutive hyphens
    return str
}

if (!Array.prototype.firstValue) {
    Object.defineProperty(Array.prototype, 'firstValue', {
        value: function () {
            return this[0]
        },
        enumerable: false, // keep it hidden during loops
    })
}
