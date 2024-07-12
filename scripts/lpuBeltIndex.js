import fs from 'fs'
import {parse} from 'csv-parse/sync'
import {projectSchema} from './schemas.js'

const allLocks = JSON.parse(fs.readFileSync('./src/data/data.json'))

// Access any lock data uniquely by id

export const lockById = allLocks
    .reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

// Index tuning: allow brands to be referenced in alternative ways

const alternativeBrands = {
    'miwa/anker': ['miwa', 'anker'],
    'assa': ['ruko'],
}

// Index tuning: some model names are too terrible to use as an index

const weakModelNames = [
    'padlock',
    'clone'
]

// Index tuning: apply a series of text replacements to codewords

const codewordMap = [
    ['no', 'without'], 
    ['gindrivers', 'ginned'],
    ['barreldriver', 'withbarrels'],
    ['lever', 'levers'],
    ['levers', 'elements'],
    ['jewelry', 'jewellery'],
    ['gensi&ii', 'geni'], 
    ['gensi&ii', 'genii'],
    ['5pinstacks', '>4'],
    ['5pinstacks', ''],
    ['5stacksofpins', ''],
    ['gintreepins', 'withgintreepins'],
    ['with', 'w'],
    ['with', ''],
    ['w', 'with'],
    ['sliders', 'pins'],
    ['<3barrelsorgins', 'ginsorbarrels<3chambers'],
    ['gindrivers', 'withginspools'],
    ['matching', 'matched'],
    ['zero', ''],
    ['6pinwith5fingerpins', ''],
    ['directions', 'rows'],
    ['6barreldrivers', 'withbarrels'],
    ['barrelspools', 'withbarrelspools'],
    ['913', '912'],
    ['6pin', ''],
    ['7pin', ''],
    ['exterior<6sliders', 'partiallypinned'],
    ['≥15pins', '15ormorepins'],
    ['spooldrivers', 'spools'],
    ['≥3', '>3'],
    ['≥4', '4+'],
    ['≥4', '>4'],
    ['5', '>4'],
    ['≥5', '5+'],
    ['13+', '≥13'],
    ['x18', 'q18'],
    ['barreldrivers2or3fingerpins', '2or3fingerpinsbarreldrivers'],
    ['2or3fingerpins', '2fingerpins'],
    ['2or3fingerpins', '3fingerpins'],
    ['2or3fingerpins', '3fingerpincombi'],
    ['u9', 'ur'],
    ['ec750', 'ec'],
    ['exterior≥6sliders', 'fullypinned'],
    ['lockingsystemoriginal', 'sliderlock'],
    ['flexcoreflexcoreplus', 'flexcore'],
    ['5pinwithbarrels', 'barrels'],
    ['andmatchedcountermilling', '+milling'],
    ['andmatchingcountermilling', 'sleeved'],
    ['interactiveclone', ''],
    ['usystemsucfuchucsuus3100', 'ucf3100'],
    ['+', 'plus'],
    ['formatlock', 'formatlocks'],
    ['twido', 'texo'],
    ['13masteredsliders', 'withanymasteredsliders'],
    ['≥2', 'with≥2'],
    ['elements', 'sliders'],
    ['4pinsserrateddrivers', '4serrateddrivers'],
    ['4pins4serrated', '4serrated'],
    ['4pins4spooled', '4pinsspooled'],
    ['championsc48', 'champions48'],
    ['≥4spooleddrivers', 'spooledinnerdrivers'],
    ['10leverpadlock', 'cs'],
    ['<7pins', 'shortformat'],
    ['insurance975', 'insurance'],
    ['not', 'non'],
    ['20005lever', 'walsall20005levers'],
    ['1416pins', '1416ormorepins'],
    ['twinv10', 'twinv10twin2'],
    ['interactive', 'jrclassicinteractive'],
    ['interactive', 'interactiveclassic'],
    ['biaxial≥5pins', 'biaxial'],
    ['max+restricted', '600assamax+restricted'],
    ['3ks', '3ks3ks+4ks'],
    ['5pins3orfewerspooleddrivers', 'spooleddrivers<3countermilledouterkeypins'],
    ['kesodoorcylinder', 'kesodoorcylinderlipsoctro'],
    ['magnetic', 'ava'],
    ['<5', '≤4'],
    ['safedepositlock', 'sdblock'],
    ['disklockpro', 'disklockpronovel'],
    ['32a81s', '32a81s32c81p'],
    ['e8', 'profil'],
    ['aces13117leversafe', 'ace7levers'],
    ['mortise', 'mortice'],
    ['4800', '18004800'],
    ['neptun1900', 'd12p600neptun1900triovingd12level1akad13nolongpin'],
    ['levers', 'wafers'],
    ['strongbolt2100', 'strongbolt'],
    ['484', '450484'],
    ['1950s', '50s'],
    ['champions', 'champtions'],
    ['3800', 'miwaankerslot3800'],
    ['2391safedepositlock', 'safedepositlock'],
    ['gins≥3chambers', '>3chambers'],
    ['≥2', '2+'],
    ['colorpro', 'colorcolorprocolor+'],
    ['dpi', 'dpidpsdpxeps'],
    ['barrelsorgins', 'chambers'],
    ['gindrivers', 'withginsupgradeofassatwin6000'],
    ['radialnt', 'radialntnt+'],
    ['<18pins', '≥13pins'],
    ['*****', ''],
    ['***', ''],
    ['nobutterflydiscs', ''],
    ['**', 'operatingandcontrol'],
    ['**', 'tooneshearline'],
    ['***', 'bothshearlinesinonetake'],
    ['****', 'requires360'],
    ['standardpins', 'standards'],
    ['wavelockdiscdetainer', 'dd'],
    ['18ormore', '18+'],
    ['500series', '500'],
    ['thinroundcenterpostsfewornofalsegates', ''],
    ['10rs', '10rs<13pins'],
    ['10rs', '10rs2000s4000somega≥13pins']
]

// Apply 3 iterations of replacements to generate codeword variants

function findCodewordVariants(cw) {
    const firstIter = codewordMap
        .map(pair => cw.replace(pair[0], pair[1]))
        .filter(pos => pos != cw)

    const secondIter = firstIter.map(cw1 => {
        return codewordMap
        .map(pair => cw1.replace(pair[0], pair[1]))
        .filter(pos => pos != cw1)
    }).flat()

    const thirdIter = secondIter.map(cw2 => {
        return codewordMap
        .map(pair => cw2.replace(pair[0], pair[1]))
        .filter(pos => pos != cw2)
    }).flat()

    return firstIter.concat(secondIter).concat(thirdIter)
}

export function normalizeCodeword(cw) {
    return cw.replace(/[^A-Za-z0-9<>&+≤≥*]/g, '').toLowerCase()
}

// The lock index is built from lock makes, models, and versions.
// There is an outer hash lookup and an inner codeword array.
// The outer hash keys include the make, model, alternate brands, 
// and the first word of the model. The codeword space for each 
// key contains the remainder of the model and the version.
// Codewords are normalized and several iterations of variants 
// are added. Each key/codeword combination maps to some unique
// lock id in the LPU Belt List.

const lockIndex = allLocks
    .map(lock => lock.makeModels
        .map(mMod => {
            const makeStr = String(mMod.make).toLowerCase()
            const modelStr = String(mMod.model).toLowerCase()
            const versionStr = lock.version ? String(lock.version).toLowerCase() : ''

            let values = [{
                id: lock.id,
                index: makeStr, 
                codeword: modelStr + versionStr
            }]

            if (!weakModelNames.includes(modelStr)) {
                values.push({
                    id: lock.id,
                    index: modelStr, 
                    codeword: versionStr
                })
            }

            const altBrands = alternativeBrands[makeStr] 
            if (altBrands) {
                altBrands.forEach(brand => {
                    values.push({
                        id: lock.id,
                        index: brand, 
                        codeword: modelStr + versionStr                    
                    })
                })
            }

            const spaceIdx = modelStr.indexOf(' ')
            if (spaceIdx > 0) {
                values.push({
                    id: lock.id,
                    index: modelStr.substring(0, spaceIdx),
                    codeword: modelStr.substring(spaceIdx+1) + versionStr
                })
            }

            values.forEach(val => {
                val.codeword = normalizeCodeword(val.codeword)

                findCodewordVariants(val.codeword).forEach(variant => {
                    let newVal = {...val}
                    newVal.codeword = variant
                    values.push(newVal)
                })
            })
            return values
        })
    ).flat().flat().reduce((group, term) => {
        const {index} = term
        group[index] = group[index] ?? []
        group[index].push(term)
        return group
    }, {})


// The project index is simpler, as you can directly look up a
// project from its name. TODO: For now the project definition
// lives on the local filesystem, but ideally this would reside
// in the LPU Belt List google sheet alongside the locks.

const projectCSV = parse(fs.readFileSync('./src/data/projects.csv'), {
    columns: true,
    skip_empty_lines: true,
    trim: true    
})

const results = projectSchema.validate(projectCSV)
if (results.error) {
    console.log('Parse error!', JSON.stringify(results.error.details, null, 2))
    process.exit(1)
}

const allProjects = projectCSV.map(datum => {
    const name = datum.Name
    const tier = datum.Tier
    const id = datum['Unique Id']
    const index = datum.Name.toLowerCase()
    const codeword = ''
    const value = {name, tier, id, index, codeword}
    return value
})

// Access any project uniquely by id

export const projectById = allProjects.reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

// Build an index for the projects by name

const projectIndex = allProjects.reduce((group, term) => {
        const {index} = term
        group[index] = group[index] ?? []
        group[index].push(term)
        return group
    }, {})

// The master index combines the locks and projects in 
// a common namespace.

const masterIndex = {...lockIndex, ...projectIndex}
export default masterIndex

console.log('Index loaded...')
