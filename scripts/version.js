import {v4} from 'uuid'
import fs from 'fs'

const data = {version: v4()}
fs.writeFileSync('./public/version.json', JSON.stringify(data))