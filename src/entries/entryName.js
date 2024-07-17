/*
    Usage:
    entryName(entry,'any', {includeVersion: true) -> ASSA Twin Combi, Triton, Neptun 4900 / TrioVing System 10, Twin Control (6 pin with 5 finger pins)
    entryName(entry, 'short') -> ASSA Twin Combi, Triton, Neptun 4900 / TrioVing System 10, Twin Control
    entryName(entry, 'long')  -> ASSA Twin Combi / ASSA Triton / ASSA Neptun 4900 / TrioVing System 10 / TrioVing Twin Control
    entryName(entry, 'data')  -> ASSA,ASSA,ASSA,TrioVing,TrioVing	Twin Combi,Triton,Neptun 4900,System 10,Twin Control
    entryName(entry, 'array') -> ['ASSA,ASSA,ASSA,TrioVing,TrioVing', 'Twin Combi,Triton,Neptun 4900,System 10,Twin Control']
*/

import levenshtein from 'fast-levenshtein'

function entryName(entry, nameType = 'short', options = {}) {
    let makeModels = entry.makeModels
    const versionString = options.includeVersion && entry.version ? ' (' + entry.version + ')' : ''

    if (options.matchTo) {
        const match = options.matchTo.match(/^([&\/\w\s+.'-]+)/)
        const searchStr = match ? match[1] : options.matchTo

        const closest = makeModels.reduce((group, {make, model}) => {
            let target = model
            if (make && make !== model) {
                target = make.concat(' ').concat(model)
            }
            const dist = levenshtein.get(searchStr.toLowerCase(), target.toLowerCase())

            if (options.matchTo.startsWith('Picard')) {
                console.log(`leven(${searchStr.toLowerCase()}, ${target.toLowerCase()}) = ${dist}`)
            }
            if (group.min === undefined || dist < group.min) {
                group.min = dist
                group.winners = [{make, model}]
            } else if (dist === group.min) {
                group.winners = [...group.winners, {make, model}]
            }
            return group
        }, {})

        if (closest.winners.length === 1) {
            const {make, model} = closest.winners[0]
            return make && make !== model ? make.concat(' ').concat(model) : model
        }
    }

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
        // TODO: Clean up to be a bit more functional style
        let lockName = ''
        let prevMake = ''
        makeModels.forEach((makeModel) => {
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
