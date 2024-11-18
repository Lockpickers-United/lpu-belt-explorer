import fs from 'fs'

const version = {version: new Date()}

fs.readFile('./public/minVersion.json', function(err, data) {
    if (err) throw err
    const {version: minVersion} = JSON.parse(data)
    version['minVersion'] = minVersion
    fs.writeFileSync('./public/version.json', JSON.stringify(version))
})


