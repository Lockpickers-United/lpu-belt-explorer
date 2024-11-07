import fs from 'fs'

const minVersion = {minVersion: new Date()}

fs.writeFileSync('../public/minVersion.json', JSON.stringify(minVersion))