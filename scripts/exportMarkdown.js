import fs from 'fs'
import {uniqueBelts} from '../src/data/belts.js'
import {encodeNonAsciiHTML} from 'entities'

const rawData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))
const introMd = fs.readFileSync('./src/resources/intro.md', 'utf8')
const infoMd = fs.readFileSync('./src/resources/info.md', 'utf8')

const initialVal = uniqueBelts.reduce((acc, val) => ({...acc, [val]: []}), [])
const groupedByBelt = rawData.reduce((acc, val) => {
    const belt = val.belt.replace(/\s\d/g, '')
    if (acc[belt]) acc[belt].push(val)
    return acc
}, initialVal)

const beltsMd = uniqueBelts.map(belt => {
    const actualBelt = belt.toLowerCase()
    const header = `### ${belt} Belt\n![](%%${actualBelt}%%)\n\n`
    const entriesHeader = `**${belt} Belt Locks**\n\n`
    const reqsPath = `./src/resources/beltRequirements/${actualBelt}.md`
    const reqs = fs.readFileSync(reqsPath, 'utf8')
    const specialReqsPath = `./src/resources/specialRequirements/${actualBelt}.md`
    const specialReqs = fs.existsSync(specialReqsPath)
        ? fs.readFileSync(specialReqsPath, 'utf8')
        : ''

    const entries = groupedByBelt[belt].map(entry => {
        const makeModels = entry.makeModels.map(({make, model}) => {
            return encodeNonAsciiHTML(make && make !== model ? `${make} ${model}` : model)
        }).join (' / ')
        const url = `https://lpubelts.com/#/locks?id=${entry.id}`
        const version = encodeNonAsciiHTML(entry.version ? ` (${entry.version})` : '')
        return `- [${makeModels}](${url})${version}`
    }).join('\n')
    return header + reqs + '\n\n' + entriesHeader + entries + '\n\n' + specialReqs
}).join('\n\n')

const beltExplorerPromoMd = fs.readFileSync('./src/resources/beltExplorerPromo.md', 'utf8')
const changelogMd = fs.readFileSync('./src/resources/changelog.md', 'utf8')
const footerMd = fs.readFileSync('./src/resources/footer.md', 'utf8')

// Layout
const markdown = [
    introMd,
    beltExplorerPromoMd,
    beltsMd,
    changelogMd,
    infoMd,
    footerMd
].join('\n\n---\n\n')

fs.writeFileSync('./dist/belts.md', markdown)
