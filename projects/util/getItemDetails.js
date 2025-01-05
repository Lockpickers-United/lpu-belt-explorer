import fetch from 'node-fetch'
import entryName from '../util/entryName.js'
import {setDeep, setDeepPush, setDeepUnique} from './useSetDeep.js'
import {json} from 'express'


export async function potDetails() {
    const raflData = await (await fetch('https://lpubelts.com/rafl.json')).json()
    return raflData.reduce((acc, item) => {
        acc[item.id] = {...item, shortName: item.title, potName: item.title, fullName: item.title}
        return acc
    }, {})
}




export async function getItemDetails() {

    let allMedia = []

    // get RAFL details
    const raflData = await (await fetch('https://lpubelts.com/rafl.json')).json()
    const potDetails = raflData.reduce((acc, item) => {
        acc[item.id] = {...item, shortName: item.title, potName: item.title, fullName: item.title}
        return acc
    }, {})

    // get SAFE LOCK details
    const safelockData = await (await fetch('https://lpubelts.com/dials.json')).json()
    const safelockDetails = safelockData.reduce((acc, item) => {
        const sep = item.make ? ' ' : ''
        acc[item.id] = {...item, shortName: `${item.make}${sep}${item.model}`}
        return acc
    }, {})

    // get PROJECT details
    const projectData = await (await fetch('https://lpubelts.com/projects.json')).json()
    const projectDetails = projectData.reduce((acc, item) => {
        acc[item.id] = {
            ...item,
            fullName: item.name,
            shortName: item.name,
            projectName: item.name,
            fullBelt: item.belt,
            rank: item.tier.charAt(item.tier.length - 1)
        }
        return acc
    }, {})

    // get AWARD details
    const awardData = await (await fetch('https://lpubelts.com/awards.json')).json()
    const awardDetails = awardData.reduce((acc, item, index) => {
        acc[item.id] = {
            ...item,
            shortName: item.name,
            awardName: item.name,
            fullBelt: item.belt,
            fullName: item.makeModels[0].model,
            absRank: index
        }
        return acc
    }, {})

    // get GLOSSARY details
    const glossaryData = await (await fetch('https://lpubelts.com/glossary.json')).json()
    const glossaryDetails = glossaryData.reduce((acc, item) => {
        allMedia.push(item.media)
        acc[item.term] = item
        return acc
    }, {})


    // get LOCK details
    const lockData = await (await fetch('https://lpubelts.com/data.json')).json()

    let allSamelineNames = {}

    const lockDetails = lockData.reduce((acc, item) => {

        const lockName = entryName(item, 'short').replaceAll('"', '\'')
        const lockFullName = entryName(item, 'short', {includeVersion: true}).replaceAll('"', '\'')

        const [belt, rank] = /(.*)\s(.*)/.exec(item.belt)
            ? [/(.*)\s(.*)/.exec(item.belt)[1], /(.*)\s(.*)/.exec(item.belt)[2]]
            : [item.belt, null]

        // sameline names
        setDeep(acc, ['allSamelineNames', item.id], lockName)

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

        allMedia = item.media ? [allMedia, ...item.media] : allMedia

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
        }
        return acc
    }, {})


    lockDetails.allSamelineNames = [...lockDetails.allSamelineNames, ...allSamelineNames]

    jsonIt('lockDetails', lockDetails.allSamelineNames)

    return lockDetails


}


await getItemDetails().then(r => {
    //console.log('response', r)
})


function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}


function jsonIt(string, object) {
    console.log(string)
    console.log(JSON.stringify(object, null, 2))
    console.log('--------')
}