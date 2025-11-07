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
