import data from './data.json'

export default data
    .map(datum => ({
        ...datum,
        makes: datum.makeModels.map(({make}) => make),
        fuzzy: datum.makeModels.map(({make, model}) => [make, model]).flat().filter(a => a).join(',')
    }))