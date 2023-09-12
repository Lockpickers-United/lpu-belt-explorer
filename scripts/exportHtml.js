import {encodeNonAsciiHTML} from 'entities'
import fs from 'fs'

const rawData = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))
const template = fs.readFileSync('./src/resources/seo-template.html', 'utf8')

if (!fs.existsSync('./dist/locks')) {
    fs.mkdirSync('./dist/locks')
}

rawData.forEach(entry => {
    const values = {
        title: entry.makeModels.map(({make, model}) => {
            return encodeNonAsciiHTML(make && make !== model ? `${make} ${model}` : model)
        }).join (' / '),
        belt: entry.belt,
        description: entry.version,
        image_url: entry.media?.[0]?.thumbnailUrl || '',
        images: entry.media?.map(image => {
            return `<img src='${image.thumbnailUrl}' alt='${image.title}'>`
        }).join('\n') || '',
        keywords: (entry.features || []).concat(entry.lockingMechanisms || []).join(', ')
    }
    const tokens = Object.keys(values)
    let output = template
    tokens.forEach(token => {
        const re = new RegExp(`\\$\\$${token.toUpperCase()}\\$\\$`, 'g')
        output = output.replace(re, values[token])
    })

    const filename = `./dist/locks/${entry.id}.html`
    fs.writeFileSync(filename, output)
})
