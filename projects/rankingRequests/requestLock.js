/**
 * @prop newBrand
 * @prop approxBelt
 * @prop discordUsername
 * @prop redditUsername
 */

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
import createThumbnails from '../util/createThumbnails.js'

import admin from 'firebase-admin'
import {getFirestore} from 'firebase-admin/firestore'

import serviceAccount from '../../keys/service-account.json' with {type: 'json'}

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
}, 'dev')
const db = getFirestore(app, 'lpubelts-dev')
db.settings({ignoreUndefinedProperties: true})

const execAsync = util.promisify(exec)

const uploadDir = `/home/${prodUser}/explore.lpubelts.com/public/img/requestedLocks`
const serverPath = 'https://explore.lpubelts.com/img/requestedLocks'

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true})
}

let uploadSubDir

function handleError(res, message, error, status = 500) {
    console.error(message, error)
    if (uploadSubDir && fs.existsSync(uploadSubDir)) {
        try {
            fs.rmSync(uploadSubDir, {recursive: true, force: true})
            console.log('Upload directory removed after error:', uploadSubDir)
        } catch (err) {
            console.error('Error removing upload directory after error:', err)
        }
    }
    res.status(status).send({status, message})
}

export default async function requestLock(req, res) {
    let subdirs = ''
    let filepaths = []

    try {
        req.user = await authenticateRequest(req, res)
    } catch (err) {
        return handleError(res, err.message, err, 403)
    }
    const form = formidable({
        uploadDir,
        keepExtensions: true,
        createDirsFromUploads: true,
        maxFileSize: 30 * 1024 * 1024,
        filter: ({mimetype}) => mimetype && mimetype.includes('image'),
        filename(name, ext, part) {
            const { fullFilename, filepath, uploadSubDir, localsubdirs } = createFilename(part, serverPath, uploadDir)
            filepaths.push(filepath)
            // Optionally, save uploadSubDir to a local variable (e.g. in closure) instead of global ??????
            // was: localUploadSubDir = uploadSubDir ????
            subdirs = localsubdirs
            return fullFilename
        }
    })

    try {
        const { fields, files } = await parseForm(req, form)
        for (const fieldName in fields) {
            if (!Array.isArray(fields[fieldName])) {
                fields[fieldName] = [fields[fieldName]]
            }
        }

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
            requestedBy: [{
                owner: true, userId: req.user.user_id, displayName: fields.displayName?.firstValue(),
                discordUsername: fields.discordUsername?.firstValue(), redditUsername: fields.redditUsername?.firstValue()
            }],
            requestStatus: 'Submitted',
            dateRequested: dayjs().toISOString()
        }

        entry.media = await Promise.all(filepaths.map(async (filepath, index) => ({
            title: `By: ${fields.discordUsername || fields.redditUsername}`,
            fullUrl: filepath,
            fullSizeUrl: (await createThumbnails({
                inputFile: files.files[index].filepath,
                width: 1024
            })).replace(uploadDir, serverPath),
            thumbnailUrl: (await createThumbnails({
                inputFile: files.files[index].filepath,
                width: 500
            })).replace(uploadDir, serverPath),
            sequenceId: index + 1,
            dateAdded: dayjs().toISOString(),
            subtitle: 'CC BY-NC-SA 4.0'
        })))

        const lockName = spaceJoin(fields.make || fields.newBrand, fields.model)

        if (subdirs) {
            const destination = `${uploadDir}/${subdirs}`.replace(/\s+/g, '-')
            const detailsJson = JSON.stringify(fields, null, 2)
            try {
                await Promise.all([
                    runCommand(`exiftool -overwrite_original -iptc:Caption-Abstract='By: ${fields.discordUsername || fields.redditUsername}' -Title='${slugify(lockName)}' -gps:all= -UserComment='${fields.id}' '${destination}'`),
                    writeFile(`${destination}/uploadData.json`, detailsJson, 'utf8')
                ])
            } catch (err) {
                return handleError(res, 'uploadData or thumbnail writeFile error', err)
            }
        }

        try {
            const ref = db.collection('ranking-requests').doc(entry.id)
            await ref.set(entry)
            console.log('Request updated successfully')
        } catch (error) {
            console.error('Error writing document: ', error)
            return handleError(res, 'Database write error', error)
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
                html: fieldsHtml
            })
            console.log('Message sent: %s', email.messageId)
        } catch (error) {
            return handleError(res, 'Email send error', error)
        }

        console.log('done')
        return res.status(200).json(entry)

    } catch (err) {
        return handleError(res, 'Form Parse Error', err)
    }
}

export async function updateRequest(req, res) {

    const {entry} = req.body

    try {
        req.user = await authenticateRequest(req, res)
    } catch (err) {
        return handleError(res, err.message, err, 403)
    }

    if (!(req.user.admin || req.user.requestAdmin)) {
        return handleError(res, 'Insufficient permissions', new Error('Insufficient Permissions'), 403)
    }

    try {
        const ref = db.collection('ranking-requests').doc(entry.id)
        await ref.set(entry)
        console.log('Request updated successfully')
    } catch (error) {
        console.error('Error writing document: ', error)
        return handleError(res, 'Database write error', error)
    }

    console.log('done')
    return res.status(200).json(entry)
}

export async function updateVotes(req, res) {
    const {newVote} = req.body
    const {entryId} = newVote

    try {
        req.user = await authenticateRequest(req, res)
    } catch (err) {
        return handleError(res, err.message, err, 403)
    }

    const {user_id} = req.user

    const ref = db.collection('ranking-requests').doc(entryId)
    let updatedVotes = []

    try {
        const rankingRequest = await ref.get()
        const previousVotes = rankingRequest.data().requestedBy || []
        const hasPreviousVote = previousVotes.find(vote => vote.userId === user_id)

        if (hasPreviousVote) {
            console.log('already requested, removing', user_id)
            updatedVotes = previousVotes.filter(vote => vote.userId !== user_id)
        } else {
            updatedVotes = Array.from(new Set([...previousVotes, newVote]))
        }
        await ref.update({requestedBy: updatedVotes})

    } catch (error) {
        console.error('Error updating votes: ', error)
        return handleError(res, 'Error updating votes', error)
    }

    console.log('done')
    return res.status(200).json(updatedVotes)
}

////////////

async function authenticateRequest(req) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized');
    }
    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await admin.auth().verifyIdToken(idToken)
        if (!decodedToken) {
            throw new Error('Insufficient permissions');
        }
    return decodedToken
}

function parseForm(req, form) {
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            resolve({ fields, files })
        })
    })
}

function createFilename(part, serverPath, uploadDir) {
    const { originalFilename } = part
    if (!originalFilename) return 'invalid'

    const filenameParts = originalFilename.split('/')
    const filename = filenameParts.pop()
    const matches = filename.match(/(.*)(\..\w*$)/)
    const basename = slugify(matches[1]) + '.' + slugify(matches[2])
    const localsubdirs = filenameParts.map(slugify).join('').replace(/\s+/g, '-')
    const fullFilename = `${localsubdirs}/${basename}`
    const filepath = `${serverPath}/${localsubdirs}/${basename}`
    const uploadSubDir = `${uploadDir}/${localsubdirs}`.replace(/\s+/g, '-')
    return { fullFilename, filepath, uploadSubDir, localsubdirs }
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
        .replace(/'/g, '')
}

if (!Array.prototype.firstValue) {
    Object.defineProperty(Array.prototype, 'firstValue', {
        value: function () {
            return this[0]
        },
        enumerable: false
    })
}
