import validator from 'validator'

export default function isValidUrl(string) {
    try {
        return validator.isURL(string, {require_tld: false, require_protocol: true})
    } catch (_) {
        return false
    }
}


