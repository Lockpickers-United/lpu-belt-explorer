export function spaceJoin(str1, str2) {
    return str1 && str2 ? `${str1} ${str2}` : str1 || str2
}

export function commaJoin(str1, str2) {
    return str1 && str2 ? `${str1}, ${str2}` : str1 || str2
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