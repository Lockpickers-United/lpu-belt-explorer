export const pluralize = (word, count) => (count === 1 || count === 1n) ? word : `${word}s`

export function spaceJoin(str1, str2) {
    return str1 && str2 ? `${str1} ${str2}` : str1 || str2
}

export function commaJoin(str1, str2) {
    return str1 && str2 ? `${str1}, ${str2}` : str1 || str2
}

export function capitalizeFirstLetter(string) {
    if (typeof string !== 'string' || string.length === 0) {
        return string
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function truncate(string, maxLength = 1024, indicator = '...') {
    if (string.length <= maxLength) return string
    return string.substring(0, maxLength - indicator.length) + indicator
}

export function isValidRegex(pattern) {
    try {
        new RegExp(pattern)
        return true
    } catch (e) {
        if (e instanceof SyntaxError) {
            return false
        }
        throw e
    }
}
