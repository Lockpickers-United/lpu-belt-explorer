import fs from 'fs'

const entries = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

const data = entries
    .map(entry => {
        const {id, makeModels} = entry
        const {make, model} = makeModels[0]
        const makeModel = make && make !== model ? `${make} ${model}` : model
        const name = makeModel.replace(/[\s/]/g, '_').replace(/\W/g, '')
        return `https://lpubelts.com/locks/${id}.html?name=${name}`
    })
    .join('\n')

const staticUrls = [
    'https://lpubelts.com/',
    'https://lpubelts.com/locks/all-locks.html',
    'https://lpubelts.com/locks/information.html'
].join('\n')

const sitemap = staticUrls + '\n' + data
fs.writeFileSync('./public/sitemap.txt', sitemap)
