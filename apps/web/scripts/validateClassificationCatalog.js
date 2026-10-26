import fs from 'node:fs'
import {validateClassificationCatalog} from './classificationCatalog.js'

const [dataPath, catalogPath] = process.argv.slice(2)
if (!dataPath || !catalogPath) {
    throw new Error('Usage: node scripts/validateClassificationCatalog.js DATA_JSON CATALOG_JSON')
}

validateClassificationCatalog(
    fs.readFileSync(dataPath, 'utf8'),
    JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
)
