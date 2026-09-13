/**
 * @prop newBrand
 * @prop approxBelt
 * @prop discordUsername
 * @prop redditUsername
 */

import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import {execFile} from 'node:child_process'
import {formidable} from '../../util/formidable/src/index.js'
import {spaceJoin} from '../../util/stringUtils.js'
import dayjs from 'dayjs'
import createThumbnails from '../../util/createThumbnails.js'
import {logger} from '../../logger/logger.js'
import parseForm from '../../util/parseForm.js'
import sendToDiscord from '../sendToDiscord/sendToDiscord.js'

const log = logger.child({module: 'requestLock'})
const {writeFile} = fs.promises
const execFileAsync = util.promisify(execFile)
const maxFileSizeMB = 10
const maxTotalFileSizeMB = 50

function firstValue(value) {
    return Array.isArray(value) ? value[0] : value
}

function normalizeFields(fields) {
    for (const fieldName in fields) {
        if (!Array.isArray(fields[fieldName])) fields[fieldName] = [fields[fieldName]]
    }
    return fields
}

function ensurePathInside(rootDir, candidate) {
    const relativePath = path.relative(rootDir, candidate)
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        const error = new Error('Upload path escapes configured upload directory')
        error.code = 'request_lock_invalid_upload_path'
        throw error
    }
    return candidate
}

function createFilename(part, publicImageBaseUrl, uploadDir) {
    const {originalFilename} = part
    if (!originalFilename) {
        const error = new Error('Uploaded file is missing a filename')
        error.code = 'request_lock_invalid_filename'
        throw error
    }

    const filenameParts = originalFilename.replaceAll('\\', '/').split('/').filter(Boolean)
    const filename = filenameParts.pop()
    const matches = filename.match(/^(.*?)(\.[a-zA-Z0-9]+)$/)
    if (!matches) {
        const error = new Error('Uploaded file must have a valid extension')
        error.code = 'request_lock_invalid_filename'
        throw error
    }

    const basename = `${slugify(matches[1])}.${slugify(matches[2].slice(1))}`
    const localSubdirs = filenameParts.map(slugify).filter(Boolean).join('')
    const fullFilename = localSubdirs ? `${localSubdirs}/${basename}` : basename
    const localUploadSubDir = ensurePathInside(
        uploadDir,
        path.resolve(uploadDir, localSubdirs)
    )

    return {
        fullFilename,
        publicFileUrl: `${publicImageBaseUrl}/${fullFilename}`,
        localUploadSubDir,
        localSubdirs
    }
}

async function writeImageMetadata({caption, title, userComment, destination}) {
    await execFileAsync('exiftool', [
        '-overwrite_original',
        `-iptc:Caption-Abstract=${caption}`,
        `-Title=${title}`,
        '-gps:all=',
        `-UserComment=${userComment}`,
        destination
    ])
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
    return String(str)
        .replace(/^\s+|\s+$/g, '')
        .replace(/[^a-zA-Z0-9\-_+ ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/'/g, '')
}

export function createRequestLockHandlers({
                                              db,
                                              auth,
                                              uploadDir,
                                              publicImageBaseUrl,
                                              runtimeEnvironment = 'local',
                                              productionData = false,
                                              activityLogger = async () => {
                                              },
                                              emailSender,
                                              emailRecipients,
                                              formFactory = formidable,
                                              parseFormData = parseForm,
                                              thumbnailCreator = createThumbnails,
                                              imageMetadataWriter = writeImageMetadata,
                                              now = () => new Date()
                                          }) {
    if (!db || !auth) throw new Error('Request-lock Firebase dependencies are required')
    if (!uploadDir || !path.isAbsolute(uploadDir)) {
        throw new Error('Request-lock uploadDir must be an absolute path')
    }
    if (!publicImageBaseUrl) throw new Error('Request-lock publicImageBaseUrl is required')
    if (typeof emailSender !== 'function') throw new Error('Request-lock emailSender is required')

    async function logActivity(messages) {
        try {
            await activityLogger(messages)
        } catch (err) {
            log.error({err}, 'Request-lock activity logging failed')
        }
    }

    function handleError(res, message, error, status = 500, cleanupDirs = new Set()) {
        cleanupDirs.forEach(cleanupDir => {
            if (!cleanupDir || cleanupDir === uploadDir || !fs.existsSync(cleanupDir)) return
            try {
                fs.rmSync(cleanupDir, {recursive: true, force: true})
                log.info({cleanupDir}, 'Upload directory removed after error')
            } catch (cleanupError) {
                log.error({err: cleanupError, cleanupDir}, 'Unable to remove upload directory after error')
            }
        })

        if (res.headersSent) {
            log.warn({err: error}, 'Request-lock error occurred after headers were sent')
            return
        }

        log.error({err: error, status}, message)
        const isDev = runtimeEnvironment !== 'production'
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
        return res.status(status).json(payload)
    }

    async function authenticateRequest(req) {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('Unauthorized')
            error.code = 'request_lock_unauthorized'
            throw error
        }
        const decodedToken = await auth.verifyIdToken(authHeader.slice('Bearer '.length))
        if (!decodedToken) {
            const error = new Error('Insufficient permissions')
            error.code = 'request_lock_insufficient_permissions'
            throw error
        }
        return decodedToken
    }

    async function setRankingRequest(ref, entry, entryId) {
        try {
            await ref.set(entry)
            return entry
        } catch (error) {
            log.error({err: error, entryId}, 'Unable to set ranking request')
            throw error
        }
    }

    async function fetchRankingRequest(ref, entryId) {
        try {
            const docSnap = await ref.get()
            if (!docSnap?.exists) {
                log.warn({entryId}, 'No ranking request found')
                return null
            }
            return docSnap.data()
        } catch (error) {
            log.error({err: error, entryId}, 'Unable to get ranking request')
            throw error
        }
    }

    async function updateRankingRequest(ref, data, entryId) {
        try {
            await ref.update(data)
            return data
        } catch (error) {
            log.error({err: error, entryId}, 'Unable to update ranking request')
            throw error
        }
    }

    async function handleRequestLock(req, res) {
        const cleanupDirs = new Set()
        let localSubdirs = ''
        const uploadedFiles = []

        try {
            req.user = await authenticateRequest(req)
        } catch (error) {
            return handleError(res, error.message, error, 403, cleanupDirs)
        }

        const form = formFactory({
            uploadDir,
            keepExtensions: true,
            createDirsFromUploads: true,
            maxFileSize: maxFileSizeMB * 1024 * 1024,
            maxTotalFileSize: maxTotalFileSizeMB * 1024 * 1024,
            filter: ({mimetype}) => mimetype && mimetype.includes('image'),
            filename(_name, _ext, part) {
                const uploadFile = createFilename(part, publicImageBaseUrl, uploadDir)
                uploadedFiles.push(uploadFile)
                localSubdirs = uploadFile.localSubdirs
                if (localSubdirs) cleanupDirs.add(uploadFile.localUploadSubDir)
                return uploadFile.fullFilename
            }
        })

        let parsedForm
        try {
            parsedForm = await parseFormData(
                res,
                req,
                form,
                (response, message, error, status) => handleError(
                    response,
                    message,
                    error,
                    status,
                    cleanupDirs
                ),
                maxFileSizeMB,
                maxTotalFileSizeMB
            )
        } catch (error) {
            return handleError(res, 'Form Parse Error', error, 400, cleanupDirs)
        }

        const fields = normalizeFields(parsedForm.fields)
        const files = Array.isArray(parsedForm.files.files)
            ? parsedForm.files.files
            : parsedForm.files.files
                ? [parsedForm.files.files]
                : []
        const displayName = firstValue(fields.displayName)
        const discordUsername = firstValue(fields.discordUsername)
        const redditUsername = firstValue(fields.redditUsername)
        const requesterName = discordUsername || redditUsername
        const requestDate = dayjs(now()).toISOString()
        const entry = {
            makeModels: [{
                make: firstValue(fields.make) || firstValue(fields.newBrand),
                model: firstValue(fields.model)
            }],
            lockingMechanisms: firstValue(fields.lockingMechanisms)?.split(',') || [],
            id: firstValue(fields.id),
            approximateBelt: firstValue(fields.approxBelt),
            usernames: {
                discord: discordUsername,
                reddit: redditUsername
            },
            displayName,
            userBelt: firstValue(fields.userBelt),
            notes: firstValue(fields.notes),
            hazLocc: firstValue(fields.hazLocc),
            requestedBy: [{
                owner: true,
                userId: req.user.user_id,
                displayName,
                discordUsername,
                redditUsername
            }],
            requestStatus: 'Submitted',
            dateRequested: requestDate
        }

        try {
            entry.media = await Promise.all(uploadedFiles.map(async (uploadFile, index) => {
                const sourceFile = files[index]?.filepath
                if (!sourceFile) throw new Error(`Missing uploaded file at index ${index}`)
                const [fullSizeFile, thumbnailFile] = await Promise.all([
                    thumbnailCreator({inputFile: sourceFile, width: 1024}),
                    thumbnailCreator({inputFile: sourceFile, width: 500})
                ])
                if (!fullSizeFile || !thumbnailFile) throw new Error('Thumbnail creation failed')
                return {
                    title: `By: ${requesterName}`,
                    fullUrl: uploadFile.publicFileUrl,
                    fullSizeUrl: fullSizeFile.replace(uploadDir, publicImageBaseUrl),
                    thumbnailUrl: thumbnailFile.replace(uploadDir, publicImageBaseUrl),
                    sequenceId: index + 1,
                    dateAdded: dayjs(now()).toISOString(),
                    subtitle: 'CC BY-NC-SA 4.0'
                }
            }))
        } catch (error) {
            return handleError(res, 'Thumbnail creation error', error, 500, cleanupDirs)
        }

        const lockName = spaceJoin(
            firstValue(fields.make) || firstValue(fields.newBrand),
            firstValue(fields.model)
        )

        if (localSubdirs) {
            const destination = ensurePathInside(uploadDir, path.resolve(uploadDir, localSubdirs))
            try {
                await Promise.all([
                    imageMetadataWriter({
                        caption: `By: ${requesterName}`,
                        title: slugify(lockName),
                        userComment: firstValue(fields.id),
                        destination
                    }),
                    writeFile(`${destination}/uploadData.json`, JSON.stringify(fields, null, 2), 'utf8')
                ])
            } catch (error) {
                return handleError(res, 'Upload metadata write error', error, 500, cleanupDirs)
            }
        }

        try {
            const ref = db.collection('ranking-requests').doc(entry.id)
            await setRankingRequest(ref, entry, entry.id)
            await logActivity([{
                type: 'WRITE',
                count: 1,
                source: 'request-create',
                id: entry.id,
                displayName: entry.displayName,
                prod: productionData,
                trigger: 'api'
            }])
        } catch (error) {
            return handleError(res, 'Failed to set ranking request', error, 500, cleanupDirs)
        }

        const discordMessage = `Lock Ranking Request submitted: **${lockName}**`
        const discordFields = {...fields}
        discordFields.displayName = `${fields.displayName} (${fields.userBelt} Belt)`
        const keysToDelete = ['id', 'make', 'model', 'droppedFileNames', 'requestStatus', 'displayName', 'userBelt']
        keysToDelete.forEach(key => delete discordFields[key])

        try {
            await sendToDiscord({
                username: 'Locky Jr.',
                avatar: undefined,
                title: discordMessage,
                message: discordMessage,
                embedFields: discordFields,
                image: entry.media[0].thumbnailUrl,
                link: `https://lpubelts.com/#/rankingrequests/view?id=${entry.id}`
            })
        } catch (error) {
            log.error({error}, 'Failed to send to Discord')
        }

        const html = `<strong>Lock addition request for ${sanitizeHTML(lockName)} by ${sanitizeHTML(requesterName)}</strong><br/><br/>`
        let fieldsHtml = html + '<table style="border-width:1px">'
        for (const key in fields) {
            fieldsHtml += `<tr><td>${sanitizeHTML(key)}</td><td>${sanitizeHTML(fields[key])}</td></tr>`
        }
        fieldsHtml += '</table>'

        try {
            await emailSender({
                emailConfig: 'content',
                to: emailRecipients,
                subject: `Lock Request: ${lockName}`,
                text: `Lock Request: ${lockName}`,
                html: fieldsHtml
            })
        } catch (error) {
            return handleError(res, 'Email send error', error, 500, cleanupDirs)
        }
        return res.status(200).json(entry)
    }

    async function handleUpdateRequest(req, res) {
        try {
            req.user = await authenticateRequest(req)
        } catch (error) {
            return handleError(res, error.message, error, 403)
        }
        if (!(req.user.admin || req.user.requestAdmin)) {
            return handleError(
                res,
                'Insufficient permissions',
                new Error('Insufficient Permissions'),
                403
            )
        }

        const {entry} = req.body
        try {
            const ref = db.collection('ranking-requests').doc(entry.id)
            await setRankingRequest(ref, entry, entry.id)
            await logActivity([{
                type: 'WRITE',
                count: 1,
                source: 'request-update',
                id: entry.id,
                displayName: entry.displayName,
                prod: productionData,
                trigger: 'api'
            }])
        } catch (error) {
            return handleError(res, 'Failed to update ranking request', error, 500)
        }
        return res.status(200).json(entry)
    }

    async function handleUpdateVotes(req, res) {
        try {
            req.user = await authenticateRequest(req)
        } catch (error) {
            return handleError(res, error.message, error, 403)
        }

        const {newVote} = req.body
        const {entryId, displayName} = newVote
        const {user_id: userId} = req.user
        const ref = db.collection('ranking-requests').doc(entryId)

        try {
            const rankingRequest = await fetchRankingRequest(ref, entryId)
            if (!rankingRequest) {
                return handleError(
                    res,
                    'No ranking request found',
                    new Error('No ranking request found'),
                    404
                )
            }
            await logActivity([{
                type: 'READ',
                count: 1,
                source: 'request-upvote',
                id: entryId,
                displayName,
                prod: productionData,
                trigger: 'api'
            }])

            const previousVotes = rankingRequest.requestedBy || []
            const hasPreviousVote = previousVotes.some(vote => vote.userId === userId)
            const updatedVotes = hasPreviousVote
                ? previousVotes.filter(vote => vote.userId !== userId)
                : [...previousVotes, newVote]

            await updateRankingRequest(ref, {requestedBy: updatedVotes}, entryId)
            await logActivity([{
                type: 'WRITE',
                count: 1,
                source: 'request-upvote',
                id: entryId,
                displayName,
                prod: productionData,
                trigger: 'api'
            }])
            return res.status(200).json(updatedVotes)
        } catch (error) {
            return handleError(res, 'Error updating votes', error, 500)
        }
    }

    return Object.freeze({
        requestLock: handleRequestLock,
        updateRequest: handleUpdateRequest,
        updateVotes: handleUpdateVotes
    })
}

async function getDefaultHandler(name) {
    const {getDefaultRequestLockHandlers} = await import('./requestLockRuntime.js')
    const handlers = await getDefaultRequestLockHandlers()
    return handlers[name]
}

export default async function requestLock(req, res) {
    return (await getDefaultHandler('requestLock'))(req, res)
}

export async function updateRequest(req, res) {
    return (await getDefaultHandler('updateRequest'))(req, res)
}

export async function updateVotes(req, res) {
    return (await getDefaultHandler('updateVotes'))(req, res)
}
