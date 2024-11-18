import fs from 'fs'

const version = {version: new Date()}

fs.writeFileSync('./public/minVersion.json', JSON.stringify(version))