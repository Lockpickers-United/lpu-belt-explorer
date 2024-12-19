export function setDeepAdd(obj, path, value) {
    if (path.length === 1) {
        obj[path[0]] = obj[path[0]] ? obj[path[0]] + value : value
        return
    }
    const key = path[0]
    if (!obj[key]) {
        obj[key] = {}
    }
    setDeepAdd(obj[key], path.slice(1), value)
}

export function setDeepPush(obj, path, value) {
    if (path.length === 1) {
        obj[path[0]] = obj[path[0]] ? [...obj[path[0]], value] : [value]
        return
    }
    const key = path[0]
    if (!obj[key]) {
        obj[key] = {}
    }
    setDeepAdd(obj[key], path.slice(1), value)
}
