import entryName from '../src/entries/entryName.js'
import fs from 'fs'

let allMedia = []

await lockDetails().then(() => {})

export async function lockDetails() {

    const lockData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

    let allSamelineNames = {}
    return lockData.reduce((acc, item) => {

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

}

export async function potDetails() {
    const raflData = JSON.parse(fs.readFileSync('./src/data/rafl.json', 'utf8'))
    return raflData.reduce((acc, item) => {
        acc[item.id] = {...item, shortName: item.title, potName: item.title, fullName: item.title, type: 'raflPot'}
        return acc
    }, {})
}

export async function safelockDetails() {
    const safelockData = JSON.parse(fs.readFileSync('./src/data/safelocks.json', 'utf8'))
    return safelockData.reduce((acc, item) => {
        const sep = item.make ? ' ' : ''
        acc[item.id] = {...item, shortName: `${item.make}${sep}${item.model}`, type: 'safelock'}
        return acc
    }, {})
}

export async function projectDetails() {
    const projectData = JSON.parse(fs.readFileSync('./src/data/projects.json', 'utf8'))
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
    const awardData = JSON.parse(fs.readFileSync('./src/data/awards.json', 'utf8'))
    return awardData.reduce((acc, item, index) => {
        acc[item.id] = {
            ...item,
            shortName: item.name,
            awardName: item.name,
            fullBelt: item.belt,
            fullName: item.makeModels[0].model,
            absRank: index,
            type: 'award'
        }
        return acc
    }, {})
}

export async function glossaryDetails() {
    const glossaryData = JSON.parse(fs.readFileSync('./src/data/glossary.json', 'utf8'))
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
        ...await glossaryDetails(),
        ...await potDetails()
    }
}


function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}


