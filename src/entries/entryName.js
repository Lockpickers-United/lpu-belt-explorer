/*
    Usage:
    entryName(entry,'any', 1) -> ASSA Twin Combi, Triton, Neptun 4900 / TrioVing System 10, Twin Control (6 pin with 5 finger pins)
    entryName(entry, 'short') -> ASSA Twin Combi, Triton, Neptun 4900 / TrioVing System 10, Twin Control
    entryName(entry, 'long')  -> ASSA Twin Combi / ASSA Triton / ASSA Neptun 4900 / TrioVing System 10 / TrioVing Twin Control
    entryName(entry, 'data')  -> ASSA,ASSA,ASSA,TrioVing,TrioVing	Twin Combi,Triton,Neptun 4900,System 10,Twin Control
    entryName(entry, 'array') -> ['ASSA,ASSA,ASSA,TrioVing,TrioVing', 'Twin Combi,Triton,Neptun 4900,System 10,Twin Control']
*/

function entryName(entry, nameType = 'short', includeVersion = false) {
    const versionString = includeVersion && entry.version ? ' (' + entry.version + ')' : ''

    if (nameType === 'long') {
        const lockName = entry.makeModels.map((makeModel) => {
            return makeModel.make + ' ' + makeModel.model
        }).join(' / ')
        return lockName + versionString
    } else if (nameType === 'data') {
        const makes = entry.makeModels.map(e => e.make).join(',')
        const models = entry.makeModels.map(e => e.model).join(',')
        return `${makes}\t${models}` + versionString
    } else if (nameType === 'array') {
        return [
            entry.makeModels.map(e => e.make).join(','),
            entry.makeModels.map(e => e.model).join(',')
        ]
    } else {
        // TODO: Clean up to be a bit more functional style
        let lockName = ''
        let prevMake = ''
        entry.makeModels.forEach((makeModel) => {
            let thisMake = makeModel.make
            let thisModel = makeModel.model
            if (!thisMake) {
                thisMake = thisModel
                thisModel = ''
            }
            if (prevMake === '') {
                lockName = `${thisMake} ${thisModel}`
            } else if (thisMake === prevMake) {
                lockName += `, ${thisModel}`
            } else {
                lockName += ` / ${thisMake} ${thisModel}`
            }
            prevMake = thisMake
        })
        return lockName + versionString
    }
}

export default entryName
