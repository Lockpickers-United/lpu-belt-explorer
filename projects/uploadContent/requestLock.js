import formidable from './src/index.js'
import fs from 'fs'

const {writeFile} = fs.promises
import archiver from 'archiver'
import {sendEmail} from '../nodeMailer/nodeMailer.js'
import {contentUploadRecipients} from '../../keys/users.js'
import util from 'util'
import {exec} from 'child_process'
import {prodUser} from '../../keys/users.js'
import {spaceJoin} from '../util/stringUtils.js'
import dayjs from 'dayjs'
import {jsonIt} from '../util/jsonIt.js'

const execAsync = util.promisify(exec)

const uploadDir = `/home/${prodUser}/explore.lpubelts.com/public/img/requestedLocks`
const datafile = `/home/${prodUser}/explore.lpubelts.com/public/data/requestedLocks.json`
const serverPath = 'https://explore.lpubelts.com/img/requestedLocks'

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true})
}

function handleError(res, message, error, status = 500) {
    console.error(message, error)
    res.status(status).send({status, message})
}

export default async function upload(req, res) {
    let subdirs = ''
    let detailsJson = {}
    let filepaths = []

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        createDirsFromUploads: true,
        maxFileSize: 30 * 1024 * 1024,
        filter: ({mimetype}) => mimetype && mimetype.includes('image'),
        filename(name, ext, part) {
            const {originalFilename} = part
            if (!originalFilename) return 'invalid'

            const originaFilenameParts = originalFilename.split('/')
            const filename = originaFilenameParts.pop()
            const filenameParts = filename.split('.')
            const fileExt = filenameParts.pop()
            const basename = slugify(filenameParts.join('.')) + '.' + slugify(fileExt)

            subdirs = originaFilenameParts.map(slugify).join('').replace(/\s+/g, '-')
            filepaths.push(`${serverPath}/${subdirs}/${basename}`)
            return `${subdirs}/${basename}`
        }
    })

    await form.parse(req, async function (err, fields) {
        if (err) return handleError(res, 'Form Parse Error', err)

        //jsonIt('form fields', fields)

        for (const fieldName in fields) {
            if (!Array.isArray(fields[fieldName])) {
                fields[fieldName] = [fields[fieldName]]
            }
        }

        const lockName = spaceJoin(fields.make || fields.newBrand, fields.model)

        const entry = {
            lockName,
            makeModels: [{
                make: fields.make?.firstValue() || fields.newBrand?.firstValue(),
                model: fields.model.firstValue()
            }],
            lockingMechanisms: fields.lockingMechanisms?.[0]?.split(',') || [],
            features: fields.features?.[0]?.split(',') || [],
            id: fields.id?.firstValue(),
            approximateBelt: fields.approxBelt?.firstValue(),
            usernames: {
                discord: fields.discordUsername?.firstValue(),
                reddit: fields.redditUsername?.firstValue()
            },
            userBelt: fields.userBelt?.firstValue(),
            notes: fields.notes?.firstValue(),
            media: filepaths.map((filepath, index) => ({
                title: `By: ${fields.discordUsername || fields.redditUsername}`,
                fullUrl: filepath,
                fullSizeUrl: filepath,
                thumbnailUrl: filepath,
                sequenceId: index+1,
                dateAdded: dayjs().toISOString(),
                subtitle: 'CC BY-NC-SA 4.0'
            })),
            hazLocc: fields.hazLocc?.firstValue(),
            dateRequested: dayjs().toISOString()
        }

        let currentRequests = []
        try {
            const freshJson = fs.readFileSync(datafile, 'utf8')
            currentRequests = JSON.parse(freshJson)
        } catch (error) {
            console.warn('No existing JSON or failed to parse:', error.message)
        }

        currentRequests.push(entry)

        try {
            await writeFile(datafile, JSON.stringify(currentRequests, null, 2), 'utf8')
        } catch (err) {
            return handleError(res, 'JSON write error', err)
        }

        let csv = 'Lock Name,Locking Mechanisms,Approximate Belt,Discord Username,Reddit Username,User Belt,Has Lock(s),Notes,Date Requested,Link\n'
        currentRequests
            .sort((a, b) => {
                return dayjs(b.dateRequested).valueOf() - dayjs(a.dateRequested).valueOf()
            })
            .forEach(item => {
                const {
                    id,
                    lockName,
                    lockingMechanisms,
                    approximateBelt,
                    usernames,
                    userBelt,
                    hazLocc,
                    notes,
                    dateRequested
                } = item
                csv += `${lockName},${lockingMechanisms.join('; ')},${approximateBelt || ''},${usernames.discord || ''},${usernames.reddit || ''},${userBelt || ''},${hazLocc || ''},${notes || ''},`
                    + `${dayjs(dateRequested).format('MMM DD YYYY hh:mma') || ''},`
                    + `https://dev.lpubelts.com/#/content/lockrequest/view?id=${id}\n`
            })

        try {
            await writeFile(datafile.replace('.json', '.csv'), csv, 'utf8')
        } catch (err) {
            return handleError(res, 'JSON write error', err)
        }

        const destination = `${uploadDir}/${subdirs}`.replace(/\s+/g, '-')
        const destinationFile = `${destination}.zip`

        if (subdirs) {
            detailsJson = JSON.stringify(fields, null, 2)

            await runCommand(`exiftool -overwrite_original -iptc:Caption-Abstract='By: ${fields.discordUsername || fields.redditUsername}' -Title='${lockName}' -gps:all= -UserComment='${fields.id}' '${destination}'`)

            try {
                await writeFile(`${destination}/uploadData.json`, detailsJson, 'utf8')
            } catch (err) {
                return handleError(res, 'uploadData writeFile error', err)
            }

            const output = fs.createWriteStream(destinationFile)
            const archive = archiver('zip', {zlib: {level: 9}})

            archive.pipe(output)
            archive.directory(destination, false)

            archive.on('error', err => handleError(res, 'File compression error', err))

            try {
                await archive.finalize()
                console.log('Files zipped successfully to', destinationFile)
            } catch (err) {
                return handleError(res, 'Failed to finalize zip', err)
            }
        }

        const html = `<strong>Lock addition request for ${sanitizeHTML(lockName)} by ${sanitizeHTML(fields.discordUsername || fields.redditUsername)}</strong><br/><br/>`
        let fieldsHtml = html + '<table style="border-width:1px">'
        for (const key in fields) {
            fieldsHtml += `<tr><td>${sanitizeHTML(key)}</td><td>${sanitizeHTML(fields[key])}</td></tr>`
        }
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
            return handleError(res, 'Email send error', error)
        }

        try {
            fs.rmSync(destinationFile, {recursive: true, force: true})
            console.log('Zip file removed successfully')
        } catch (error) {
            console.error('Error deleting zip file:', error.message)
        }

        console.log('done')
        res.status(200).send('Files uploaded successfully')
    })
}

async function runCommand(command) {
    try {
        const {stdout, stderr} = await execAsync(command)
        console.log('runCommand stdout:', stdout.trim(), 'stderr:', stderr)
    } catch (error) {
        console.error('runCommand error:', error)
    }
}

function sanitizeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (char) {
        switch (char) {
            case '&':
                return '&amp;'
            case '<':
                return '&lt;'
            case '>':
                return '&gt;'
            case '"':
                return '&quot;'
            case '\'':
                return '&#39;'
            default:
                return char
        }
    })
}

function slugify(str) {
    return str
        .replace(/^\s+|\s+$/g, '')
        .replace(/[^a-zA-Z0-9\-_+ ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

if (!Array.prototype.firstValue) {
    Object.defineProperty(Array.prototype, 'firstValue', {
        value: function () {
            return this[0]
        },
        enumerable: false
    })
}
