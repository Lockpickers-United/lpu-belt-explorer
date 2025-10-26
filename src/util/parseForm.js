import {formidableErrorCodes} from './formidableErrorCodes.js'
import {logger} from '../logger/logger.js'

export default function parseForm(res, req, form, handleError, maxFileSizeMB, maxTotalFileSizeMB) {
    return new Promise((resolve, reject) => {
        form.once('error', err => {
            const status = typeof err?.httpCode === 'number'
                ? err.httpCode
                : 400
            const description = err?.code
                ? err.code === 1016 || err.code === '1016'
                    ? 'File exceeds size limit' + (maxFileSizeMB ? ` of ${maxFileSizeMB} MB` : '')
                    : err.code === 1009 || err.code === '1009'
                        ? 'Total upload exceeds size limit' + (maxTotalFileSizeMB ? ` of ${maxTotalFileSizeMB} MB` : '')
                        : formidableErrorCodes[err.code].description
                : 'Formidable form parse error'
            err.message = `Form parse error: ${description}`
            handleError(res, description, err, status)
            reject(err)
        })  // ensure the Promise settles
        form.parse(req, (err, fields, files) => {
            try {
                if (req && req.logMultipart) {
                    const truncate = (v, n = 500) => {
                        const s = String(v)
                        return s.length > n ? s.slice(0, n) + '…' : s
                    }
                    const safeFields = {}
                    if (fields && typeof fields === 'object') {
                        for (const [k, v] of Object.entries(fields)) {
                            if (Array.isArray(v)) {
                                safeFields[k] = v.map(x => truncate(x))
                            } else if (v && typeof v === 'object' && 'value' in v) {
                                safeFields[k] = truncate(v.value)
                            } else {
                                safeFields[k] = truncate(v)
                            }
                        }
                    }
                    const summarizeFiles = (ff) => {
                        const list = []
                        if (!ff || typeof ff !== 'object') return list
                        for (const [field, val] of Object.entries(ff)) {
                            const arr = Array.isArray(val) ? val : [val]
                            for (const f of arr) {
                                if (!f) continue
                                list.push({
                                    field,
                                    originalFilename: f.originalFilename,
                                    mimetype: f.mimetype,
                                    size: f.size,
                                    filepath: f.filepath ? String(f.filepath) : undefined
                                })
                            }
                        }
                        return list
                    }
                    const filesSummary = summarizeFiles(files)
                    logger.info({
                        msg: 'multipart form parsed',
                        requestId: req.id,
                        method: req.method,
                        path: req.originalUrl || req.url,
                        fields: safeFields,
                        files: filesSummary
                    })
                }
            } catch {}

            if (err) return reject(err)
            resolve({fields, files})
        })
    })
}
