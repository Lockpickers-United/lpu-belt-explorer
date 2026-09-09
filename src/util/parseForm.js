import {formidableErrorCodes} from './formidableErrorCodes.js'
import {logger} from '../logger/logger.js'

export default function parseForm(res, req, form, handleError, maxFileSizeMB, maxTotalFileSizeMB) {
    return new Promise((resolve, reject) => {
        form.once('error', err => {
            const status = typeof err?.httpCode === 'number'
                ? err.httpCode
                : 400
            // Defensive description mapping to avoid throwing inside the error handler
            let description = 'Formidable form parse error'
            const code = err?.code
            if (code !== null) {
                const strCode = String(code)
                if (strCode === '1016') {
                    description = 'File exceeds size limit' + (maxFileSizeMB ? ` of ${maxFileSizeMB} MB` : '')
                } else if (strCode === '1009') {
                    description = 'Total upload exceeds size limit' + (maxTotalFileSizeMB ? ` of ${maxTotalFileSizeMB} MB` : '')
                } else if (formidableErrorCodes && formidableErrorCodes[strCode]?.description) {
                    description = formidableErrorCodes[strCode].description
                } else if (formidableErrorCodes && formidableErrorCodes[Number(strCode)]?.description) {
                    description = formidableErrorCodes[Number(strCode)].description
                } else if (typeof err?.message === 'string' && err.message.trim()) {
                    description = err.message
                }
            }
            try { err.message = `Form parse error: ${description}` } catch { /* log to console? */ }
            try { handleError(res, description, err, status) } catch { /* log to console? */ }
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
                    logger.debug({
                        msg: 'multipart form parsed',
                        requestId: req.id,
                        method: req.method,
                        path: req.originalUrl || req.url,
                        fields: safeFields,
                        files: filesSummary
                    })
                }
            } catch { /* log to console? */ }

            if (err) return reject(err)
            resolve({fields, files})
        })
    })
}
