import {encodeNonAsciiHTML} from 'entities'
import fs from 'fs'
import belts from '../src/data/belts.js'

const rawData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))
const template = fs.readFileSync('./src/resources/seo-template.html', 'utf8')
const allLocksTemplate = fs.readFileSync('./src/resources/all-locks-template.html', 'utf8')
const mediaTemplate = fs.readFileSync('./src/resources/seo-media-template.html', 'utf8')
const shareTemplate = fs.readFileSync('./src/resources/seo-share-template.html', 'utf8')

if (!fs.existsSync('./dist/locks')) fs.mkdirSync('./dist/locks')
if (!fs.existsSync('./dist/share')) fs.mkdirSync('./dist/share')

const replaceValues = (template, values) => {
    const tokens = Object.keys(values)
    let output = template
    tokens.forEach(token => {
        const re = new RegExp(`\\$\\$${token.toUpperCase()}\\$\\$`, 'g')
        output = output.replace(re, values[token])
    })

    const missed = output.match(/\$\$\w+\$\$/g)
    if (missed) {
        console.log('Missed tokens', missed)
        process.exit(1)
    }
    return output
}

const getName = entry => {
    return entry.makeModels.map(({make, model}) => {
        return encodeNonAsciiHTML(make && make !== model ? `${make} ${model}` : model)
    }).join(' / ')
}

const getUrlName = entry => {
    const {make, model} = entry.makeModels[0]
    const makeModel = make && make !== model ? `${make} ${model}` : model
    return makeModel.replace(/[\s/]/g, '_').replace(/\W/g, '')
}

rawData.forEach((entry, index, arr) => {
    const urlName = getUrlName(entry)
    const prevIndex = index === 0 ? arr.length - 1 : index - 1
    const nextIndex = index === arr.length - 1 ? 0 : index + 1
    const prevEntry = arr[prevIndex]
    const nextEntry = arr[nextIndex]
    const prevUrlName = getUrlName(prevEntry)
    const nextUrlName = getUrlName(nextEntry)

    const title_version = entry.relatedIds ? ` (${entry.version})` : ''

    const values = {
        id: entry.id,
        url_name: urlName,
        prev_id: prevEntry.id,
        prev_url_name: prevUrlName,
        next_id: nextEntry.id,
        next_url_name: nextUrlName,

        title: getName(entry),
        title_version: title_version,
        belt: entry.belt,
        version: entry.version || '',
        notes: entry.notes || '',
        image_url: entry.media?.[0]?.thumbnailUrl || '',
        image_count: entry.media?.length || 0,
        images: entry.media?.map(media => replaceValues(mediaTemplate, media)).join('\n') || '',
        features: (entry.features || []).join(', '),
        locking_mechanisms: (entry.lockingMechanisms || []).join(', ')
    }

    const output = replaceValues(template, values)
    const shareOutput = replaceValues(shareTemplate, values)

    fs.writeFileSync(`./dist/locks/${entry.id}.html`, output)
    fs.writeFileSync(`./dist/share/${entry.id}.html`, shareOutput)
})

const all_locks = Object.keys(belts)
    .map(belt => {
        return [
            `\t\t<h2>${belt} Belt</h2>`,
            rawData.filter(entry => entry.belt === belt).map(entry => {
                const urlName = getUrlName(entry)
                const name = getName(entry)
                return `\t\t<a href='https://lpubelts.com/locks/${entry.id}.html?name=${urlName}'>${name}</a><br>`
            }).join('\n')
        ].join('\n')
    })
    .join('\n')
const output = replaceValues(allLocksTemplate, {all_locks})
fs.writeFileSync('./dist/locks/all-locks.html', output)
