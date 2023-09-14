import {encodeNonAsciiHTML} from 'entities'
import fs from 'fs'

const rawData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))
const template = fs.readFileSync('./src/resources/seo-template.html', 'utf8')
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

rawData.forEach(entry => {
    const values = {
        id: entry.id,
        title: entry.makeModels.map(({make, model}) => {
            return encodeNonAsciiHTML(make && make !== model ? `${make} ${model}` : model)
        }).join (' / '),
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
