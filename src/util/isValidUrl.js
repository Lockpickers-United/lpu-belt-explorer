import validUrl from 'valid-url'

export default function isValidUrl(string) {
    return validUrl.isWebUri(string)
}
