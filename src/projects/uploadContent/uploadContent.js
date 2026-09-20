import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import {execFile} from 'node:child_process'
import {ZipArchive} from 'archiver'
import {formidable} from '../../util/formidable/src/index.js'
import parseForm from '../../util/parseForm.js'
import {logger} from '../../logger/logger.js'

const log = logger.child({module: 'upload-content'})
const execFileAsync = util.promisify(execFile)
const maxFileSizeMB = 15
const maxTotalFileSizeMB = 60

function firstValue(value) {
    return Array.isArray(value) ? value[0] : value
}

function normalizeFields(fields) {
    for (const fieldName in fields) {
        if (!Array.isArray(fields[fieldName])) fields[fieldName] = [fields[fieldName]]
    }
    return fields
}

function slugify(value) {
    return String(value)
        .replace(/^\s+|\s+$/g, '')
        .replace(/[^a-zA-Z0-9\-_+ ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

function sanitizeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;'
    })[character])
}

function createUploadFilename(part) {
    const {originalFilename} = part
    if (!originalFilename) {
        const error = new Error('Uploaded file is missing a filename')
        error.code = 'upload_content_invalid_filename'
        throw error
    }

    const filenameParts = originalFilename.replaceAll('\\', '/').split('/').filter(Boolean)
    const filename = filenameParts.pop()
    const parsedFilename = path.parse(filename)
    const basename = slugify(parsedFilename.name)
    const extension = slugify(parsedFilename.ext.slice(1))
    if (!basename || !extension) {
        const error = new Error('Uploaded file must have a valid filename and extension')
        error.code = 'upload_content_invalid_filename'
        throw error
    }

    const subdirectories = filenameParts.map(slugify).filter(Boolean)
    return [...subdirectories, `${basename}.${extension}`].join('/')
}

async function writeImageMetadata({caption, title, userComment, destination}) {
    const {stdout = '', stderr = ''} = await execFileAsync('exiftool', [
        '-r',
        '-all=',
        '-tagsFromFile',
        '@',
        '-all:all',
        '-unsafe',
        '-icc_profile',
        '-overwrite_original',
        `-iptc:Caption-Abstract=${caption}`,
        `-Title=${title}`,
        `-UserComment=${userComment}`,
        '-gps:all=',
        destination
    ])

    if (stderr && !stderr.includes('ICC_Profile deleted')) {
        const details = {stdout: stdout.replace(/\n/g, ''), stderr}
        if (stderr.includes('Warning')) {
            log.warn(details, 'ExifTool completed with warnings')
        }
        else {
            const error = new Error('ExifTool reported an error')
            error.details = details
            log.error({error}, 'ExifTool error')
            //throw error
        }
    }
}

function createZipArchive({sourceDir, destinationFile}) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(destinationFile)
        const archive = new ZipArchive({zlib: {level: 9}})

        output.once('close', () => resolve({bytes: archive.pointer()}))
        output.once('error', reject)
        archive.once('warning', reject)
        archive.once('error', reject)
        archive.pipe(output)
        archive.directory(sourceDir, false)
        Promise.resolve(archive.finalize()).catch(reject)
    })
}

function uploadedFileCount(files) {
    return Object.values(files ?? {}).reduce((count, value) => {
        return count + (Array.isArray(value) ? value.length : value ? 1 : 0)
    }, 0)
}

export function createUploadContentHandler({
                                               uploadDir,
                                               runtimeEnvironment = 'local',
                                               emailSender,
                                               emailRecipients,
                                               formFactory = formidable,
                                               parseFormData = parseForm,
                                               imageMetadataWriter = writeImageMetadata,
                                               archiveDirectory = createZipArchive
                                           }) {
    if (!uploadDir || !path.isAbsolute(uploadDir)) {
        throw new Error('Content uploadDir must be an absolute path')
    }
    if (typeof emailSender !== 'function') throw new Error('Content emailSender is required')

    function handleError(res, message, error, status = 500) {
        if (res.headersSent) {
            log.warn({err: error}, 'Upload-content error occurred after headers were sent')
            return
        }

        log.error({err: error, status}, message)
        const isDev = runtimeEnvironment !== 'production'
        return res.status(status).json({
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
        })
    }

    async function cleanup(workspaceDir, archiveFile) {
        const cleanupResults = await Promise.allSettled([
            workspaceDir
                ? fs.promises.rm(workspaceDir, {recursive: true, force: true})
                : Promise.resolve(),
            archiveFile
                ? fs.promises.rm(archiveFile, {force: true})
                : Promise.resolve()
        ])
        cleanupResults.forEach(result => {
            if (result.status === 'rejected') {
                log.error({err: result.reason}, 'Unable to clean up upload workspace')
            }
        })
    }

    return async function uploadContent(req, res) {
        let workspaceDir
        let archiveFile
        let failureMessage = 'Upload processing error'

        try {
            workspaceDir = await fs.promises.mkdtemp(path.join(uploadDir, 'content-upload-'))
            archiveFile = `${workspaceDir}.zip`
            const form = formFactory({
                uploadDir: workspaceDir,
                keepExtensions: true,
                createDirsFromUploads: true,
                maxFileSize: maxFileSizeMB * 1024 * 1024,
                maxTotalFileSize: maxTotalFileSizeMB * 1024 * 1024,
                filter: ({mimetype}) => mimetype && mimetype.includes('image'),
                filename(_name, _ext, part) {
                    return createUploadFilename(part)
                }
            })

            failureMessage = 'Form Parse Error'
            const {fields: rawFields, files} = await parseFormData(
                res,
                req,
                form,
                handleError,
                maxFileSizeMB,
                maxTotalFileSizeMB
            )
            const fields = normalizeFields(rawFields)
            const photoCredit = firstValue(fields.photoCredit)
            const lockName = firstValue(fields.lockName)
            const lockFullName = firstValue(fields.lockFullName)
            const lockId = firstValue(fields.lockId)
            const attachmentBaseName = slugify(lockFullName || lockName || lockId || 'photos') || 'photos'
            const attachmentName = `${attachmentBaseName}.zip`

            try {
                await imageMetadataWriter({
                    caption: `By: ${photoCredit}`,
                    title: lockName,
                    userComment: lockId,
                    destination: workspaceDir
                })
            } catch (err) {
                failureMessage = 'Upload metadata write error'
                log.error({err}, failureMessage)
            }
            await fs.promises.writeFile(
                path.join(workspaceDir, 'uploadData.json'),
                JSON.stringify(fields, null, 2),
                'utf8'
            )

            failureMessage = 'File compression error'
            const archiveResult = await archiveDirectory({
                sourceDir: workspaceDir,
                destinationFile: archiveFile
            })

            const html = `<strong>Photos uploaded for ${sanitizeHTML(lockFullName)} by ${sanitizeHTML(photoCredit)}</strong><br/><br/>`
            let fieldsHtml = html + '<table>'
            Object.keys(fields).forEach(key => {
                fieldsHtml += `<tr><td>${sanitizeHTML(key)}</td><td>${sanitizeHTML(fields[key])}</td></tr>`
            })
            fieldsHtml += '</table>'

            failureMessage = 'An error occurred sending email'
            const email = await emailSender({
                emailConfig: 'content',
                to: emailRecipients,
                subject: `Photos uploaded for ${lockFullName} by ${photoCredit}`,
                text: `Photos uploaded for ${lockFullName} by ${photoCredit} (text)`,
                html: fieldsHtml,
                attachments: {filename: attachmentName, path: archiveFile}
            })

            log.info({
                type: 'photos',
                count: uploadedFileCount(files),
                archiveStatus: `Files zipped successfully: ${archiveResult.bytes} total bytes`,
                emailStatus: `Message sent: ${email.messageId}`
            }, 'files uploaded successfully')

            await cleanup(workspaceDir, archiveFile)
            return res.status(200).send('Files uploaded successfully')
        } catch (error) {
            await cleanup(workspaceDir, archiveFile)
            if (res.headersSent) return
            const status = typeof error?.httpCode === 'number' ? error.httpCode : 500
            return handleError(res, failureMessage, error, status)
        }
    }
}

export default async function uploadContent(req, res) {
    const {getDefaultUploadContentHandler} = await import('./uploadContentRuntime.js')
    return (await getDefaultUploadContentHandler())(req, res)
}
