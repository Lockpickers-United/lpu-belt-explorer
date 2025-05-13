import fetch from 'node-fetch'
import entryName from './entryName.js'

let allMedia = []

export async function lockDetails() {
    const lockData = await (await fetch('https://lpubelts.com/data.json')).json()

    let allSamelineNames = {}
    const lockDetails = lockData.reduce((acc, item) => {

        //TODO entries with no make, only model
        const lockName = entryName(item, 'short').replaceAll('"', '\'')
        const lockFullName = entryName(item, 'short', {includeVersion: true}).replaceAll('"', '\'')

        const [belt, rank] = /(.*)\s(.*)/.exec(item.belt)
            ? [/(.*)\s(.*)/.exec(item.belt)[1], /(.*)\s(.*)/.exec(item.belt)[2]]
            : [item.belt, null]

        // sameline names
        allSamelineNames[item.id] = lockName

        const allBrands = item.makeModels.reduce((acc, makeModel) => {
            acc.push(makeModel.make ? makeModel.make : makeModel.model)
            return acc
        }, [])
        const lockBrands = [...new Set(allBrands)]

        const samelineNames = item.makeModels.reduce((acc, makeModel, index) => {
            const samelineName = makeModel.model ? `${makeModel.make} ${makeModel.model}` : makeModel.model
            acc.push(samelineName)
            const samelineId = item.id + '-' + (index + 1)
            allSamelineNames[samelineId] = samelineName
            return acc
        }, [])

        allMedia = item.media ? [...allMedia, ...item.media] : allMedia

        acc[item.id] = {
            ...item,
            shortName: lockName,
            lockName: lockName,
            lockFullName: lockFullName,
            fullBelt: ucfirst(item.belt),
            belt: ucfirst(belt),
            rank: rank,
            mediaCount: item.media?.length,
            lockViewCount: item.views,
            lockBrands: lockBrands,
            samelineNames: samelineNames,
            type: 'lock'
        }
        return acc
    }, {})


    //lockDetails.allSamelineNames = new Map([...lockDetails.allSamelineNames, ...allSamelineNames])
    //allSamelineNames.forEach((value, key) => lockDetails.allSamelineNames.set(key, value));
    // jsonIt('allSamelineNames', allSamelineNames)

    return lockDetails
}

export async function potDetails() {
    const raflData = await (await fetch('https://lpubelts.com/rafl.json')).json()
    return raflData.reduce((acc, item) => {
        acc[item.id] = {...item, shortName: item.title, potName: item.title, fullName: item.title, type: 'raflPot'}
        return acc
    }, {})
}

export async function safelockDetails() {
    const safelockData = await (await fetch('https://lpubelts.com/dials.json')).json()
    return safelockData.reduce((acc, item) => {
        const sep = item.make ? ' ' : ''
        acc[item.id] = {...item, shortName: `${item.make}${sep}${item.model}`, type: 'safelock'}
        return acc
    }, {})
}

export async function projectDetails() {
    const projectData = await (await fetch('https://lpubelts.com/projects.json')).json()
    return projectData.reduce((acc, item) => {
        acc[item.id] = {
            ...item,
            fullName: item.name,
            shortName: item.name,
            projectName: item.name,
            fullBelt: item.belt,
            rank: item.tier.charAt(item.tier.length - 1),
            type: 'project'
        }
        return acc
    }, {})
}

export async function awardDetails() {
    const awardData = await (await fetch('https://lpubelts.com/awards.json')).json()
    return awardData.reduce((acc, item, index) => {
        acc[item.id] = {
            ...item,
            shortName: item.name,
            awardName: item.name,
            fullBelt: item.belt,
            fullName: item.makeModels[0].model,
            absRank: index,
            awardType: item.awardType,
            type: 'award'
        }
        return acc
    }, {})
}

export async function glossaryDetails() {
    const glossaryData = await (await fetch('https://lpubelts.com/glossary.json')).json()
    return glossaryData.reduce((acc, item) => {
        allMedia.push(item.media)
        acc[item.term] = {...item, shortName: item.term, type: 'glossary', media: item.media ? [item.media] : undefined}
        return acc
    }, {})
}

export async function itemDetails() {
    return {
        ...await lockDetails(),
        ...await safelockDetails(),
        ...await projectDetails(),
        ...await awardDetails(),
        ...await glossaryDetails()
    }
}

function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}
