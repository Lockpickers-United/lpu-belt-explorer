// example: setDeepPush(acc, ['newImageEntries'], object)

function setDeepBase(obj, path, value, customizer) {
    if (path.length === 1) {
        obj[path[0]] = customizer ? customizer(obj[path[0]], value) : value
        return
    }
    const key = path[0]
    if (!obj[key]) {
        obj[key] = {}
    }
    setDeepBase(obj[key], path.slice(1), value, customizer)
}

export function setDeep(obj, path, value) {
    setDeepBase(obj, path, value)
}

export function setDeepCreate(obj, path) {
    setDeepBase(obj, path, undefined, (a, b) => a ?? b)
}

export function setDeepAdd(obj, path, value) {
    setDeepBase(obj, path, value, (a, b) => (a ? a + b : b))
}

export function setDeepMax(obj, path, value) {
    setDeepBase(obj, path, value, (a, b) => (a > b ? a : b))
}

export function setDeepPush(obj, path, value) {
    setDeepBase(obj, path, value, (a, b) => (a ? [...a, b] : [b]))
}

export function setDeepUnique(obj, path, value) {
    setDeepBase(obj, path, value, (a, b) => (a ? [...new Set([...a, b])] : [b]))
}