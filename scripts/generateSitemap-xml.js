import fs from 'fs'
import dayjs from 'dayjs'

const entries = JSON.parse(fs.readFileSync('./src/data/data.json', 'utf8'))

const currentDate = dayjs().format('YYYY-MM-DD')

const data = entries
    .map(entry => {
        const {id, makeModels} = entry
        const {make, model} = makeModels[0]
        const makeModel = make && make !== model ? `${make} ${model}` : model
        const name = makeModel.replace(/[\s/]/g, '_').replace(/\W/g, '')
        return `<url><loc>https://lpubelts.com/locks/${id}.html?name=${name}</loc><lastmod>${currentDate}</lastmod></url>`
    })
    .join('\n')
    
const staticUrls = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `<url><loc>https://lpubelts.com/</loc><lastmod>${currentDate}</lastmod></url>`,
    `<url><loc>https://lpubelts.com/all-locks.html</loc><lastmod>${currentDate}</lastmod></url>`,
    `<url><loc>https://lpubelts.com/information.html</loc><lastmod>${currentDate}</lastmod></url>`,
].join('\n')

const sitemap = staticUrls + '\n' + data + '\n</urlset>'
fs.writeFileSync('./public/sitemap.xml', sitemap)
