import fs from 'fs'

fs.copyFileSync('./src/data/data.json', './dist/data.json')
fs.copyFileSync('./src/resources/information.html', './dist/locks/information.html')
