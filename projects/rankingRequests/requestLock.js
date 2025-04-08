import formidable from '../util/formidable/src/index.js'
import fs from 'fs'

const {writeFile} = fs.promises
import {sendEmail} from '../nodeMailer/nodeMailer.js'
import {contentUploadRecipients} from '../../keys/users.js'
import util from 'util'
import {exec} from 'child_process'
import {prodUser} from '../../keys/users.js'
import {spaceJoin} from '../util/stringUtils.js'
import dayjs from 'dayjs'
import {jsonIt} from '../util/jsonIt.js'
import createThumbnails from '../util/createThumbnails.js'

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

export default async function requestLock(req, res) {
    let subdirs = ''
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
            const filenameParts = filename.match(/(.*)(\..\w*$)/)
            const basename = slugify(filenameParts[1]) + '.' + slugify(filenameParts[2])

            subdirs = originaFilenameParts.map(slugify).join('').replace(/\s+/g, '-')
            filepaths.push(`${serverPath}/${subdirs}/${basename}`)
            return `${subdirs}/${basename}`
        }
    })

    await form.parse(req, async function (err, fields, files) {
        if (err) return handleError(res, 'Form Parse Error', err)

        for (const fieldName in fields) {
            if (!Array.isArray(fields[fieldName])) {
                fields[fieldName] = [fields[fieldName]]
            }
        }

        const lockName = spaceJoin(fields.make || fields.newBrand, fields.model)

        const entry = {
            makeModels: [{
                make: fields.make?.firstValue() || fields.newBrand?.firstValue(),
                model: fields.model.firstValue()
            }],
            lockingMechanisms: fields.lockingMechanisms?.[0]?.split(',') || [],
            id: fields.id?.firstValue(),
            approximateBelt: fields.approxBelt?.firstValue(),
            usernames: {
                discord: fields.discordUsername?.firstValue(),
                reddit: fields.redditUsername?.firstValue()
            },
            displayName: fields.displayName?.firstValue(),
            userBelt: fields.userBelt?.firstValue(),
            notes: fields.notes?.firstValue(),
            hazLocc: fields.hazLocc?.firstValue(),
            requestStatus: 'Pending',
            dateRequested: dayjs().toISOString(),
        }

        entry.media = await Promise.all(filepaths.map(async (filepath, index) => ({
            title: `By: ${fields.discordUsername || fields.redditUsername}`,
            fullUrl: filepath,
            fullSizeUrl: (await createThumbnails({inputFile: files.files[index].filepath, width: 1024})).replace(uploadDir, serverPath),
            thumbnailUrl: (await createThumbnails({inputFile: files.files[index].filepath, width: 500})).replace(uploadDir, serverPath),
            sequenceId: index + 1,
            dateAdded: dayjs().toISOString(),
            subtitle: 'CC BY-NC-SA 4.0'
        })))

        let currentRequests = getCurrentRequests()
        currentRequests.push(entry)

        try {
            await writeFile(datafile, JSON.stringify(currentRequests, null, 2), 'utf8')
        } catch (err) {
            return handleError(res, 'JSON write error', err)
        }

        try {
            await saveRequestsCsv(currentRequests)
        } catch (err) {
            return handleError(res, 'CSV write error', err)
        }

        if (subdirs) {
            const destination = `${uploadDir}/${subdirs}`.replace(/\s+/g, '-')
            const detailsJson = JSON.stringify(fields, null, 2)

            await runCommand(`exiftool -overwrite_original -iptc:Caption-Abstract='By: ${fields.discordUsername || fields.redditUsername}' -Title='${lockName}' -gps:all= -UserComment='${fields.id}' '${destination}'`)

            try {
                await writeFile(`${destination}/uploadData.json`, detailsJson, 'utf8')
            } catch (err) {
                return handleError(res, 'uploadData writeFile error', err)
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
            })
            console.log('Message sent: %s', email.messageId)
        } catch (error) {
            return handleError(res, 'Email send error', error)
        }

        console.log('done')
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(entry, null, 2));
    })
}

async function saveRequestsCsv(currentRequests) {
    if (!currentRequests || !currentRequests.length) {
        currentRequests = getCurrentRequests()
    }
    let csv = 'Lock Name,Locking Mechanisms,Approximate Belt,Discord Username,Reddit Username,User Belt,Has Lock(s),Notes,Date Requested,Status,Link\n'
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
                dateRequested,
                status
            } = item
            csv += `${lockName},${lockingMechanisms.join('; ')},${approximateBelt || ''},${usernames.discord || ''},${usernames.reddit || ''},${userBelt || ''},${hazLocc || ''},${notes || ''},`
                + `${dayjs(dateRequested).format('MMM DD YYYY hh:mma') || ''},${status || ''},`
                + `https://dev.lpubelts.com/#/content/lockrequest/view?id=${id}\n`
        })

    try {
        await writeFile(datafile.replace('.json', '.csv'), csv, 'utf8')
    } catch (err) {
        return err
    }
}

function getCurrentRequests() {
    let currentRequests = []
    try {
        const freshJson = fs.readFileSync(datafile, 'utf8')
        currentRequests = JSON.parse(freshJson)
    } catch (error) {
        console.warn('No existing JSON or failed to parse:', error.message)
    }
    return currentRequests
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
