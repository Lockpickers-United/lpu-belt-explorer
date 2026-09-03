export function jsonIt(string, object) {
    console.log(string)
    console.log(JSON.stringify(object, null, 2))
    console.log('--------')
}

export function jsonItArray(string, array) {
    console.log(string)

    if (array !== null && Array.isArray(array)) {
        array.forEach((element) => {
            console.log(`${element.join('||')}`)
        })
    } else {
        console.log(JSON.stringify(object, null, 2))
    }
    console.log('--------')
}

export function jsonItSortedObject(string, object) {
    console.log(string)

    if (object !== null && typeof object === 'object' && !Array.isArray(object)) {
        Object.entries(object).sort((a,b) => b[1] - a[1]).forEach(([key, value]) => {
            console.log(`${key}: ${JSON.stringify(value, null, 2)}`)
        })
    } else {
        console.log(JSON.stringify(object, null, 2))
    }
    console.log('--------')
}