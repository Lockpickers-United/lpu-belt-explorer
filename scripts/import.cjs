const fs = require('fs')
const {parse} = require('csv-parse/sync')

const csvData = fs.readFileSync('./import.csv')
const data = parse(csvData, {
    columns: true,
    skip_empty_lines: true
})

const cleaned = data.map(datum => {
    // TODO: Build this
    // return {
    //     makeModels: [
    //         {
    //             make: '',
    //             model: datum.MakeModel
    //         }
    //     ],
    //     version: datum.Version,
    //     belt: datum.Belt,
    //     lockingMechanisms,
    //     features,
    //     notes: datum.notes || '',
    //     links: [],
    //     regions: []
    // }
})

fs.writeFileSync('./data.json', JSON.stringify(cleaned, null, 2))