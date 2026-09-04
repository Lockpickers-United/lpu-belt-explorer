export function normalizeRepeatedSlashes(url) {
    if (typeof url !== 'string' || !url.includes('//')) return url

    const [pathPart, queryPart] = url.split('?', 2)
    const normalizedPath = pathPart.replace(/\/{2,}/g, '/')
    return queryPart ? `${normalizedPath}?${queryPart}` : normalizedPath
}

export default function normalizeRequestUrl(req, _res, next) {
    const normalizedUrl = normalizeRepeatedSlashes(req.url)
    if (normalizedUrl !== req.url) {
        req.url = normalizedUrl
    }

    const normalizedOriginalUrl = normalizeRepeatedSlashes(req.originalUrl)
    if (normalizedOriginalUrl !== req.originalUrl) {
        req.originalUrl = normalizedOriginalUrl
    }

    next()
}
