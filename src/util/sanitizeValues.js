// utils/sanitizeValues.js
import DOMPurify from 'dompurify'
import {
    RegExpMatcher,
    TextCensor,
    englishDataset, englishRecommendedTransformers,
    grawlixCensorStrategy, keepEndCensorStrategy, keepStartCensorStrategy
} from 'obscenity'

export default function sanitizeValues(object, { profanityOK = false, urlsOK = false } = {}) {
    if (typeof object !== 'object' || object === null) {
        const sanitizedText = sanitizeText(object)
        const profanityFiltered = profanityOK ? sanitizedText : filterProfanity(sanitizedText)
        return urlsOK ? profanityFiltered : removeLinks(profanityFiltered)
    }
    if (Array.isArray(object)) {
        return object.map(sanitizeValues)
    }
    const sanitizedObject = {}
    for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            sanitizedObject[key] = sanitizeValues(object[key])
        }
    }
    return sanitizedObject
}

export function selectiveSanitizeValues(object, {profanityOKFields = [], urlsOKFields = []} = {}) {
    return Object.fromEntries(
        Object.entries(object).map(([key, value]) => {
            const profanityOK = profanityOKFields.includes(key)
            const urlsOK = urlsOKFields.includes(key)
            return [
                key, sanitizeValues(value, {profanityOK, urlsOK})
            ]
        })
    )
}

export function sanitizeText(input) {
    if (/^\d+(?:\.\d+)?$/.test(input)) {
        return input
    }
    const cleaned = stripExtras(input)
        .replace(/<script[\s\S]*?<\/script>/gi, '')
    return DOMPurify.sanitize(cleaned, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: []
    })
}

// remove all Unicode combining marks (the “Zalgo” bits) and zero-width controls
function stripExtras(str) {
    return str
        ? str.toString()
            .normalize('NFC')
            // 1) remove combining marks (Zalgo)
            .replace(/\p{M}/gu, '')
            // 2) normalize CRLF/CR to LF first
            .replace(/\r\n?/g, '\n')
            .replace(/\n\n\n/g, '\n\n')
            // 3) remove control chars EXCEPT LF (\n)
            //    This removes C0 controls except 0x0A (LF) and also C1 controls
            // eslint-disable-next-line no-control-regex
            .replace(/[\u0000-\u0009\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, '')
            // 4) remove zero-widths
            .replace(/[\u200B-\u200F\u2060-\u206F\uFEFF]/g, '')
            // 5) collapse spaces/tabs
            .replace(/[ \t]{2,}/g, ' ')
        : ''
}

export function filterProfanity(input) {
    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    })
    const censor = new TextCensor().setStrategy(keepEndCensorStrategy(keepStartCensorStrategy(grawlixCensorStrategy())))
    const matches = matcher.getAllMatches(input)
    return censor.applyTo(input, matches)
}

export function removeLinks(input) {
    return input
        .replace(/<a[^>]*>(.*?)<\/a>/g, '$1')
        .replace(/https?:\/\/\S+/g, '[link removed]')
        .replace(/<link[^>]*>/g, '[link removed]')
        .replace(/<script[^>]*>.*?<\/script>/g, '[link removed]')
}