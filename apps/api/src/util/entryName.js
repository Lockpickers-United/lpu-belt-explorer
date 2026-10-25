/*
    Usage:
    entryName(entry,'any', {includeVersion: true) -> ASSA Twin Combi, Triton, Neptun 4900 / TrioVing System 10, Twin Control (6 pin with 5 finger pins)
    entryName(entry, 'short') -> ASSA Twin Combi, Triton, Neptun 4900 / TrioVing System 10, Twin Control
    entryName(entry, 'long')  -> ASSA Twin Combi / ASSA Triton / ASSA Neptun 4900 / TrioVing System 10 / TrioVing Twin Control
    entryName(entry, 'data')  -> ASSA,ASSA,ASSA,TrioVing,TrioVing	Twin Combi,Triton,Neptun 4900,System 10,Twin Control
    entryName(entry, 'array') -> ['ASSA,ASSA,ASSA,TrioVing,TrioVing', 'Twin Combi,Triton,Neptun 4900,System 10,Twin Control']
*/


function entryName(entry, nameType = 'short', options = {}) {
    let makeModels = entry.makeModels
    const versionString = options.includeVersion && entry.version ? ' (' + entry.version + ')' : ''

    if (nameType === 'long') {
        const lockName = makeModels.map((makeModel) => {
            return makeModel.make + ' ' + makeModel.model
        }).join(' / ')
        return lockName + versionString
    } else if (nameType === 'data') {
        const makes = makeModels.map(e => e.make).join(',')
        const models = makeModels.map(e => e.model).join(',')
        return `${makes}\t${models}` + versionString
    } else if (nameType === 'array') {
        return [
            makeModels.map(e => e.make).join(','),
            makeModels.map(e => e.model).join(',')
        ]
    } else if (nameType === 'dial') {
        return entry.make && entry.model
            ? `${entry.make} ${entry.model}`
            : entry.model
    } else {
        const lockName = makeModels
            .reduce((acc, {make, model}) => {
                const group = make || model
                const item = make ? model : ''
                let toAppend = `${group} ${item}`
                if (acc.last?.group === group) {
                    toAppend = `, ${item}`
                } else if (acc.last) {
                    toAppend = ' / ' + toAppend
                }
                return {lockName: acc.lockName + toAppend, last: {group, item}}
            }, {lockName: ''}).lockName

        return lockName + versionString
    }
}

export default entryName
