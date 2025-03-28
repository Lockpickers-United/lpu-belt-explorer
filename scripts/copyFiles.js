import fs from 'fs'

fs.copyFileSync('./src/data/data.json', './dist/data.json')
fs.copyFileSync('./src/data/glossary.json', './dist/glossary.json')
fs.copyFileSync('./src/data/safelocks.json', './dist/dials.json')
fs.copyFileSync('./src/data/projects.json', './dist/projects.json')
fs.copyFileSync('./src/data/awards.json', './dist/awards.json')
fs.copyFileSync('./src/data/rafl.json', './dist/rafl.json')
fs.copyFileSync('./src/data/raflCharities.json', './dist/raflCharities.json')
fs.copyFileSync('./src/data/historicalData.json', './dist/historicalData.json')
fs.copyFileSync('./src/data/lockStats.json', './dist/lockStats.json')
