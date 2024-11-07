import fs from 'fs'

const version = {version: new Date()}

fs.writeFileSync('./public/version.json', JSON.stringify(version))