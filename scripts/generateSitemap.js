import fs from 'fs'

const entries = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

const data = entries
    .map(entry => {
        const {id, makeModels} = entry
        const {make, model} = makeModels[0]
        const makeModel = make && make !== model ? `${make} ${model}` : model
        const name = makeModel.replace(/[\s/]/g, '_').replace(/\W/g, '')
        return `https://lpubelts.com/?id=${id}&name=${name}`
    })
    .join('\n')
const prefix = 'https://lpubelts.com/all-locks.html\n'
const sitemap = prefix + data
fs.writeFileSync('./public/sitemap.txt', sitemap)