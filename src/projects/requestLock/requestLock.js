/**
 * @prop newBrand
 * @prop approxBelt
 * @prop discordUsername
 * @prop redditUsername
 */

import fs from 'fs'
import {formidable} from '../../util/formidable/src/index.js'
import {sendEmail} from '../nodeMailer/nodeMailer.js'
import {contentUploadRecipients} from '../../../keys/users.js'
import util from 'util'
import {exec} from 'child_process'
import {spaceJoin} from '../../util/stringUtils.js'
import dayjs from 'dayjs'
import createThumbnails from '../../util/createThumbnails.js'
import {logFirebaseActivity} from '../logFirebaseActivity/logFirebaseActivity.js'
import {getFirestore} from 'firebase-admin/firestore'
import {getAuth} from 'firebase-admin/auth'
import {logger} from '../../logger/logger.js'
import parseForm from '../../util/parseForm.js'
import postFirebaseActivity from '../../util/postFirebaseActivity.js'
import {getFirebaseAdminApp} from '../../api/services/firebaseAdmin.js'
import isDirectRun from '../../util/isDirectRun.js'

const isCron = !!process.argv[2] && process.argv[2] === 'cron'
const log = logger.child({
    module: 'requestLock'
})

const {writeFile} = fs.promises
const maxFileSizeMB = 10
const maxTotalFileSizeMB = 50

const requestapp = getFirebaseAdminApp()

let _dbProd
let _dbDev

function getDb(prod) {
    if (prod) {
        if (!_dbProd) {
            _dbProd = getFirestore(requestapp)
            _dbProd.settings({ignoreUndefinedProperties: true})
        }
        return _dbProd
    } else {
        if (!_dbDev) {
            _dbDev = getFirestore(requestapp, 'lpubelts-dev')
            _dbDev.settings({ignoreUndefinedProperties: true})
        }
        return _dbDev
    }
}

const execAsync = util.promisify(exec)

const uploadDir = process.env.REQUESTED_LOCKS_UPLOAD_DIR
const serverPath = 'https://explore.lpubelts.com/img/requestedLocks'

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {recursive: true})
}

let uploadSubDir

function handleError(res, message, error, status = 500) {
    log.error(`handleError: ${message}`)

    if (uploadSubDir && fs.existsSync(uploadSubDir)) {
        try {
            fs.rmSync(uploadSubDir, {recursive: true, force: true})
            log.info('Upload directory removed after error:', uploadSubDir)
        } catch (err) {
            try {
                log.error(`Error removing upload directory after error: ${err}`)
            } catch {
                console.error(`Error removing upload directory after error: ${err}`)
            }
        }
    }

    if (res.headersSent) {
        log.warn('handleError called but headers already sent')
        return
    }

    const isDev = process.env.NODE_ENV !== 'production'
    const payload = {
        status: 'error',
        statusText: message || 'An unexpected error occurred.',
        error: {
            message: typeof message === 'string' ? message : (error?.message || 'Error'),
            code: error?.code,
            type: error?.name,
            details: error && typeof error === 'object' ? {
                formidableCode: error.code,
                errno: error.errno,
                syscall: error.syscall
            } : undefined,
            stack: isDev && typeof error?.stack === 'string' ? error.stack : undefined
        }
    }

    res.status(status).json(payload)
    res.end()
}

export default async function requestLock(req, res) {

    let subdirs = ''
    let filepaths = []

    try {
        req.user = await authenticateRequest(req, res)
    } catch (err) {
        return handleError(res, err.message, err, 403)
    }

    const env = process.env.NODE_ENV || 'development'
    const prod = env === 'production'
    const db = getDb(prod)

    async function logActivity(messages) {
        try {
            if (isDirectRun(import.meta.url) || isCron) await postFirebaseActivity({activityData: messages})
            else await logFirebaseActivity(messages)
        } catch (err) {
            console.log('Logging Error', err)
        }
    }

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        createDirsFromUploads: true,
        maxFileSize: maxFileSizeMB * 1024 * 1024,
        maxTotalFileSize: maxTotalFileSizeMB * 1024 * 1024,
        filter: ({mimetype}) => mimetype && mimetype.includes('image'),
        filename(_name, _ext, part) {
            const {fullFilename, filepath, localsubdirs} = createFilename(part, serverPath, uploadDir)
            filepaths.push(filepath)
            // Optionally, save uploadSubDir to a local variable (e.g. in closure) instead of global ??????
            // was: localUploadSubDir = uploadSubDir ????
            subdirs = localsubdirs
            return fullFilename
        }
    })

    try {
        const {fields, files} = await parseForm(res, req, form, handleError, maxFileSizeMB, maxTotalFileSizeMB)
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
                owner: true,
                userId: req.user.user_id,
                displayName: fields.displayName?.firstValue(),
                discordUsername: fields.discordUsername?.firstValue(),
                redditUsername: fields.redditUsername?.firstValue()
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

        const ref = db.collection('ranking-requests').doc(entry.id)
        try {
            await setRankingRequest(ref, entry, entry.id, entry.displayName)
            await logActivity([{
                type: 'READ',
                count: 1,
                source: 'request-create',
                id: entry.id,
                displayName: entry.displayName,
                prod: prod
            }])
        } catch (error) {
            handleError(res, 'Failed to set ranking request', error, 500)
        }

        const html = `<strong>Lock addition request for ${sanitizeHTML(lockName)} by ${sanitizeHTML(fields.discordUsername || fields.redditUsername)}</strong><br/><br/>`
        let fieldsHtml = html + '<table style="border-width:1px">'
        for (const key in fields) {
            fieldsHtml += `<tr><td>${sanitizeHTML(key)}</td><td>${sanitizeHTML(fields[key])}</td></tr>`
        }
        fieldsHtml += '</table>'

        try {
            await sendEmail({
                emailConfig: 'content',
                to: contentUploadRecipients,
                subject: `Lock Request: ${lockName}`,
                text: `Lock Request: ${lockName}`,
                html: fieldsHtml
            })
        } catch (error) {
            return handleError(res, 'Email send error', error)
        }
        return res.status(200).json(entry)

    } catch (err) {
        return handleError(res, 'Form Parse Error', err)
    }
}

export async function updateRequest(req, res) {
    try {
        req.user = await authenticateRequest(req, res)
    } catch (err) {
        return handleError(res, err.message, err, 403)
    }
    if (!(req.user.admin || req.user.requestAdmin)) {
        return handleError(res, 'Insufficient permissions', new Error('Insufficient Permissions'), 403)
    }
    const {entry, prod} = req.body
    const db = getDb(prod)

    try {
        const ref = db.collection('ranking-requests').doc(entry.id)
        await setRankingRequest(ref, entry, entry.id, entry.displayName)
        await logFirebaseActivity([{
            type: 'WRITE',
            count: 1,
            source: 'request-update',
            id: entry.id,
            displayName: entry.displayName,
            prod: prod
        }])
    } catch (error) {
        handleError(res, 'Failed to update ranking request', error, 500)
    }
    return res.status(200).json(entry)
}

export async function updateVotes(req, res) {
    const {newVote, prod} = req.body
    const {entryId, displayName} = newVote
    const db = getDb(prod)

    try {
        req.user = await authenticateRequest(req, res)
    } catch (err) {
        return handleError(res, err.message, err, 403)
    }

    const {user_id} = req.user
    let updatedVotes = []

    const ref = db.collection('ranking-requests').doc(entryId)
    try {
        const rankingRequest = await fetchRankingRequest(ref, entryId)
        if (!rankingRequest) return handleError(res, 'No ranking request found', new Error('No ranking request found'), 404)
        await logFirebaseActivity([{
            type: 'READ',
            count: 1,
            source: 'request-upvote',
            id: entryId,
            displayName: displayName,
            prod: prod
        }])

        const previousVotes = rankingRequest.requestedBy || []
        const hasPreviousVote = previousVotes.find(vote => vote.userId === user_id)

        const updatedVotes = hasPreviousVote
            ? previousVotes.filter(vote => vote.userId !== user_id)
            : Array.from(new Set([...previousVotes, newVote]))

        const updateData = {requestedBy: updatedVotes}
        try {
            await updateRankingRequest(ref, updateData, entryId)
            await logFirebaseActivity([{
                type: 'WRITE',
                count: 1,
                source: 'request-upvote',
                id: entryId,
                displayName: displayName,
                prod: prod
            }])

        } catch (error) {
            handleError(res, 'Failed to update ranking request', error, 500)
        }

    } catch (error) {
        log.error(`Error updating votes: ${error}`)
        return handleError(res, 'Error updating votes', error)
    }
    return res.status(200).json(updatedVotes)
}

////////////

async function fetchRankingRequest(ref, entryId) {
    try {
        const docSnap = await ref.get(entryId)
        if (!docSnap) {
            log.warn(`No ranking request found for entry: ${entryId}`)
            return null
        }
        return docSnap.data()
    } catch (error) {
        log.error(`Error getting document ${entryId}: ${error}`)
        return null
    }
}

async function setRankingRequest(ref, entry, entryId) {
    try {
        await ref.set(entry)
        return entry
    } catch (error) {
        log.error(`Error setting document ${entryId}: ${error}`)
        throw error
    }
}

async function updateRankingRequest(ref, data, entryId) {
    try {
        await ref.update(data)
        return data
    } catch (error) {
        log.error(`Error updating document ${entryId}: ${error}`)
        throw error
    }
}

async function authenticateRequest(req) {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Unauthorized')
    }
    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await getAuth(requestapp).verifyIdToken(idToken)
    if (!decodedToken) {
        throw new Error('Insufficient permissions')
    }
    return decodedToken
}

function createFilename(part, serverPath, uploadDir) {
    const {originalFilename} = part
    if (!originalFilename) return 'invalid'

    const filenameParts = originalFilename.split('/')
    const filename = filenameParts.pop()
    const matches = filename.match(/(.*)(\..\w*$)/)
    const basename = slugify(matches[1]) + '.' + slugify(matches[2])
    const localsubdirs = filenameParts.map(slugify).join('').replace(/\s+/g, '-')
    const fullFilename = `${localsubdirs}/${basename}`
    const filepath = `${serverPath}/${localsubdirs}/${basename}`
    const uploadSubDir = `${uploadDir}/${localsubdirs}`.replace(/\s+/g, '-')
    return {fullFilename, filepath, uploadSubDir, localsubdirs}
}

async function runCommand(command) {
    try {
        await execAsync(command)
        //const {stdout, stderr} = await execAsync(command)
        //console.log('runCommand stdout:', stdout.trim(), 'stderr:', stderr)
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
