/*
Usage:
EntryName(entry)			ASSA Twin Combi, Triton, Neptun 4900 / TrioVing System 10, Twin Control
EntryName(entry,'any', 1)	ASSA Twin Combi, Triton, Neptun 4900 / TrioVing System 10, Twin Control (6 pin with 5 finger pins)
EntryName(entry,'long')	    ASSA Twin Combi / ASSA Triton / ASSA Neptun 4900 / TrioVing System 10 / TrioVing Twin Control
EntryName(entry,'data')		ASSA,ASSA,ASSA,TrioVing,TrioVing	Twin Combi,Triton,Neptun 4900,System 10,Twin Control
EntryName(entry,'array')	['ASSA,ASSA,ASSA,TrioVing,TrioVing', 'Twin Combi,Triton,Neptun 4900,System 10,Twin Control']
*/

function EntryName(entry, nameType='short', includeVersion=false) {
    const versionString = includeVersion && entry.version ? ' (' + entry.version + ')' : ''

    if (nameType==='long') {
        let lockName = ''
        entry.makeModels.forEach((makeModel) => {
            let lockSep = lockName === '' ? '' : ' / '
            lockName += lockSep + makeModel.make + ' ' + makeModel.model
        })
        return lockName+versionString
    } else if (nameType==='data') {
        return entry.makeModels.map(e => e.make).join(',') + '\t'
            + entry.makeModels.map(e => e.model).join(',')
            + versionString
    } else if (nameType==='array') {
        return [entry.makeModels.map(e => e.make).join(','),entry.makeModels.map(e => e.model).join(',')]
    } else {
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
        return lockName+versionString
    }
}

export default EntryName
