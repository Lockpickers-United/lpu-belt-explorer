function Name(entry,includeVersion=false,nameType="short") {
    var versionString = includeVersion && entry.version ? " (" + entry.version + ")" : ""

    if (nameType==="short") {
        let lockName = ""
        let prevMake = ""
        entry.makeModels.forEach((makeModel) => {
            let thisMake = makeModel.make
            let thisModel = makeModel.model
            if (!thisMake) {
                thisMake = thisModel
                thisModel = ""
            }
            if (prevMake === "") {
                lockName = `${thisMake} ${thisModel}`
            } else if (thisMake === prevMake) {
                lockName += `, ${thisModel}`
            } else {
                lockName += ` / ${thisMake} ${thisModel}`
            }
            prevMake = thisMake
        })
        return lockName+versionString

    } else if (nameType==="long") {
        let lockName = ""
        entry.makeModels.forEach((makeModel) => {
            let lockSep = lockName === "" ? "" : " / "
            lockName += lockSep + makeModel.make + " " + makeModel.model
        })
        return lockName+versionString

    } else if (nameType==="data") {
        return entry.makeModels.map(e => e.make).join(',') + "\t"
            + entry.makeModels.map(e => e.model).join(',')
            + versionString

    } else if (nameType==="array") {
        return [entry.makeModels.map(e => e.make).join(','),entry.makeModels.map(e => e.model).join(',')]
    }
}

export default Name
