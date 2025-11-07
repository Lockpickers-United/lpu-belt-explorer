import fs from 'fs'
import {parse} from 'csv-parse/sync'
import {danSchema} from './importSchemas.js'
import beltDetails, {projectTiers, modifierMultiplier} from '../src/data/belts.js'
import fetch from 'node-fetch'
import masterIndex, {lockById, projectById, normalizeCodeword} from './lpuBeltIndex.js'
import admin from 'firebase-admin'
import {getFirestore} from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(fs.readFileSync('../keys/lpu-belt-explorer-firebase-adminsdk.json'))
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lpu-belt-explorer.firebaseio.com'
})
const db = getFirestore(app, 'lpubelts-dev')

const DEBUG = false
const FOLLOW_LINKS = true
const WRITE_TO_DB = true

// Some folks take liberties with dan sheet format

function startLine(tab) {
    if (tab === 'Mick Emhurt') {
        return 7
    } else {
        return 3
    }
}

const importTabNames = async () => {
    const {TAB_SHEET_ID: sheetId} = process.env
    if (!sheetId) {
        console.log('Config error! Set TAB_SHEET_ID env var to google sheet of dan tab names and black belt dates.')
        process.exit(1)
    }
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Pickers&headers=1`
    let csvData = await (await fetch(url)).text()

    const data = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
    })
    const retval = data
        .map(datum => {
            return {
                picker: datum.Picker,
                date: datum.Date
            }
        })
    return retval
}


// Pulls all necessary info from a specified dan sheet tab

const importDanTab = async (tab) => {
    const {DAN_SHEET_ID: sheetId} = process.env
    if (!sheetId) {
        console.log('Config error! Set DAN_SHEET_ID env var to dan google sheet.')
        process.exit(1)
    }

    // Download the tab in CSV format
    const safeTab = encodeURI(tab)
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${safeTab}&headers=1`
    let csvData = await (await fetch(url)).text()

    // There is a line at the top with black lock counts and dan points,
    // and these will be useful to have on hand to crosscheck calculations.
    const secRow = parse(csvData, {
        from_line: 2,
        to_line: 2,
        trim: true
    }).pop() ?? []

    const danHeader = {picker: tab, numBlack: Number(secRow[1] ?? 0), points: Number(secRow[6] ?? 0)}

    // Extract the valid entries in the tab. The data is so dirty that
    // we silently skip over lines that we can't parse, notably those
    // that lack either a lock or a link.

    if (tab === 'Loose-Shirt') {
        // this sheet's header is split across two lines
        let csvLines = csvData.split('\n')
        csvLines[2] = csvLines[2].concat(csvLines[3])
        csvLines.splice(3, 1)
        csvData = csvLines.join('\n')
    }

    const danEntries = parse(csvData, {
        from_line: startLine(tab),
        columns: true,
        skip_empty_lines: true,
        trim: true,
        cast: (val, ctx) => {
            // some people change these header values
            if (ctx.lines === startLine(tab)) {
                if (ctx.index === 0) {
                    return 'Lock'
                } else if (ctx.index === 2) {
                    return 'Unique LPU id'
                }
            }
            // overwrite a column to add row numbers
            if (ctx.lines > startLine(tab) && ctx.index === 2) {
                return ctx.lines
            } else {
                return val
            }
        }
    }).filter(row => {
        const results = danSchema.validate(row)
        if (DEBUG && results.error) {
            // very noisy but useful for understanding skipped lines
            // console.log('Parse error, skipping:', JSON.stringify(results.error.details, null, 2))
        }
        return !results.error
    })

    // Return the fields we need

    const retEntries = danEntries
        .map(datum => {
            const lock = datum.Lock
            const link = datum.Link
            const row = datum['Unique LPU id']
            const modifier = datum.Modifier

            let value = {
                row,
                lock,
                link
            }
            if (modifier !== 'N/A') {
                value.modifier = modifier
            }
            return value
        })

    const retval = {header: danHeader, entries: retEntries}
    return retval
}

// Some brands have been replaced by a more canonical representation.
// We map to such brands before attempting to use our search index.

const inputBrandMap = {
    'sargent and greenleaf': 's&g',
    'thirard': 'fth thirard',
    'asio/scec bilock': 'bilock asio',
    'kaba gege': 'gege',
    'corbin': 'corbin russwin',
    'federal lock': 'federal locks',
    'xylock': 'xylok',
    'de guard': 'deguard',
    'walsall locks,': 'walsall locks',
    'picard cr cerrature': 'picard cr serrature',
    'american': 'american lock'
}

// When forming some codewords, they are so far removed from the 
// canonical search space that we need to simplify them directly
// before attempting a search.

const codeCarving = [
    ['quattroexpert', 'quattro']
]

function simplifyCode(code) {
    codeCarving.forEach(xfm => {
        code = code.replace(xfm[0], xfm[1])
    })
    return code
}

// We use the master LPU index to match lock strings from the 
// dan sheet in two stages. First, we perform an index lookup.
// We try all consecutive word strings, preferring longer
// sequences and preferring sequences starting earlier in the
// lock string. We are ideally trying to match the make of the
// lock, or at worst, the model. Only if we succeed with such 
// a lookup (a hit) can we go further. Second, we search the
// codeword space for the hit, attempting to find a match.
// We prefer an exact match but may settle for a prefix.
// At the end, our original list of dan entries will be 
// annotated with unique ids for the matches we have found.

function matchDanSheet(danData) {
    const hitsForEntries = danData.entries
        .map(entry => {
            if (!entry.lock) {
                return {entry} 
            }

            const wholeKey = String(entry.lock).toLowerCase()
            let key = wholeKey
            let sPos = 0
            let ePos = 0
            let hit = undefined

            while (!hit && 0 <= sPos && sPos < wholeKey.length) {
                ePos = wholeKey.length

                while (!hit && sPos < ePos && ePos <= wholeKey.length) {
                    key = wholeKey.substring(sPos, ePos)

                    // don't allow purely numeric keys
                    if (!key.match(/^\d+$/)) {
                        if (inputBrandMap[key]) {
                            key = inputBrandMap[key]
                        }
                        hit = masterIndex[key]
                    }
                    if (!hit) {
                        // the end position decreases in the inner loop
                        ePos = wholeKey.lastIndexOf(' ', ePos-1)
                    }
                }

                // the start position increases in the outer loop
                sPos = wholeKey.indexOf(' ', sPos)
                if (sPos >= 0) {
                    sPos = sPos + 1
                }
            }

            if (hit) {
                // the remainder that didn't match is the source codeword
                const code = normalizeCodeword(wholeKey.substring(ePos))
                return {key, code: simplifyCode(code), entry}
            } else {
                if (DEBUG) {
                    console.log(`WARN: no hit for ${wholeKey}`)
                }
                return {entry} 
            }
        })

    // The second stage is the codeword search

    const idEntries = hitsForEntries
        .map(hit => {
            if (hit.key) {
                // for deep debugging of specific lock
                if (hit.entry.lock === 'XXX Corbin master ring (both shearlines in one take)') {
                    console.log(`hit on ${hit.key} and searching for ${hit.code}`)
                    console.log(masterIndex[hit.key])
                }

                // prefer an exact match
                let vals = masterIndex[hit.key].filter(cw => {
                    return cw.codeword === hit.code
                })
                if (vals.length > 0) {
                    let uniqIds = [...new Set(vals.map(el => el.id))]
                    if (DEBUG && uniqIds.length > 1) {
                        console.log(`WARN: multimatch (exact) ${uniqIds} for ${hit.entry.lock}`)
                    }
                    return {id: uniqIds[0], entry: hit.entry}
                } 

                // then prefer matching the source codeword as a prefix
                vals = masterIndex[hit.key].filter(cw => {
                    return 0 === cw.codeword.indexOf(hit.code)
                })
                if (vals.length > 0) {
                    let uniqIds = [...new Set(vals.map(el => el.id))]
                    if (DEBUG && uniqIds.length > 1) {
                        console.log(`WARN: multimatch (prefix) ${uniqIds} for ${hit.entry.lock}`)
                    }
                    return {id: uniqIds[0], entry: hit.entry}
                } 

                // then prefer the codeword including the entire source
                vals = masterIndex[hit.key].filter(cw => {
                    return cw.codeword.includes(hit.code)
                })
                if (vals.length > 0) {
                    let uniqIds = [...new Set(vals.map(el => el.id))]
                    if (DEBUG && uniqIds.length > 1) {
                        console.log(`WARN: multimatch (include) ${uniqIds} for ${hit.entry.lock}`)
                    }
                    return {id: uniqIds[0], entry: hit.entry}
                } 

                // as a last hope, the codeword may be a prefix of the source
                vals = masterIndex[hit.key].filter(cw => {
                    return 0 === hit.code.indexOf(cw.codeword)
                })
                if (vals.length > 0) {
                    let uniqIds = [...new Set(vals.map(el => el.id))]
                    if (DEBUG && uniqIds.length > 1) {
                        console.log(`WARN: multimatch (reverse) ${uniqIds} for ${hit.entry.lock}`)
                    }
                    return {id: uniqIds[0], entry: hit.entry}
                } 

                // We stop trying here... going much further leads to false matches.
                // Better to tune the index rather than lower the bar.

                if (DEBUG) {
                    console.log(`WARN: unable to match ${hit.code} for ${hit.entry.lock}`)
                }

                // masterIndex[hit.key].forEach(cw => {
                //     console.log(`trying to match ${hit.code} to ${cw.codeword}`)
                // })
            }
            return {entry: hit.entry}
        })
    return idEntries
}

// With a matched set of dan entries, we can now score the
// dan points properly, using our own logic. 

function scoreEntries(target, header, matchedEntries) {
    let dedupIds = {}
    const danPtsArr = matchedEntries.reverse().map(row => {
        if (!row.id) {
            // unmatched locks get no points
            return 0
        }
        if (dedupIds[row.id]) {
            // duplicate (same-lined) locks get no points
            return 0
        } else {
            dedupIds[row.id] = true

            if (lockById[row.id]) {
                // unique matched locks get dan points by belt, with a potential multiplier
                const points = beltDetails[lockById[row.id].belt].danPoints
                const multiplier = modifierMultiplier[row.entry.modifier] ?? 1
                return points * multiplier
            } else {
                // projects get a specified number of dan points by tier
                return projectTiers[projectById[row.id].tier].danPoints
            }
        }
        // the double reverse is a horrile hack to more closely mimic what the dan sheets do
    }).reverse() 

    const danPts = danPtsArr.reduce((psum, term) => psum + term, 0)

    // We count matched black belt locks, regardless of same-lining or upgrades

    const numBlackArr = matchedEntries.map(row => {
        if (!row.id) {
            return 0
        }
        if (lockById[row.id] && lockById[row.id].belt.includes('Black')) {
            return 1 
        } else {
            return 0
        }
    })

    const numBlack = numBlackArr.reduce((psum, term) => psum + term, 0)

    // Compare our results with the dan sheet. They usually don't match
    // due to errors and stale data in the sheet. 

    if (DEBUG && danPts !== header.points) {
        console.log(`WARN: point mismatch, ${danPts} vs ${header.points} in sheet`)
    }
    if (DEBUG && numBlack !== header.numBlack) {
        console.log(`WARN: black count mismatch, ${numBlack} vs ${header.numBlack} in sheet`)
    }
 
    // Print out a summary of how the dan entries were matched and scored

    if (DEBUG) {
        console.log('====================================')
        console.log(`Scorecard for ${target}`)
        console.log(`Points = ${danPts}, BB locks = ${numBlack}`)
        console.log('')

        matchedEntries.toSorted((a1, a2) => a1.entry.row - a2.entry.row)
            .forEach(ent => {
                if (ent.id) {
                    if (lockById[ent.id]) {
                        console.log(`${ent.id} ${ent.entry.lock} (${lockById[ent.id].belt}) => `)
                        console.log(lockById[ent.id].makeModels)

                        if (lockById[ent.id].version) {
                            console.log(lockById[ent.id].version)
                        }
                    } else {                
                        console.log(`${ent.id} ${ent.entry.lock} => ${projectById[ent.id].name}`)
                    }
                } else {                
                    console.log(`NO MATCH for row ${ent.entry.lock}`)
                }
                console.log('')
            })

        console.log(`${matchedEntries.filter(ent => !ent.id).length} unmatched rows`)

        console.log('====================================')
    }
}

// Once we score a dan sheet, we write the result to
// the local dancache.

function writeEntriesAsJSON(target, header, idEntries) {
    const entries = idEntries.map(elem => {
        let newEnt = {
            row: elem.entry.row,
            lock: elem.entry.lock,
            link: elem.entry.link
        }
        if (elem.id) {
            newEnt.id = elem.id
        }
        if (elem.entry.publishDate) {
            newEnt.publishDate = elem.entry.publishDate
        }
        if (elem.entry.modifier) {
            newEnt.modifier = elem.entry.modifier
        }
        return newEnt
    }).toSorted((a1, a2) => a1.row - a2.row)

    const json = JSON.stringify({header, entries}, null, 2)

    const filename = `./src/data/dancache/${target}.json`
    fs.writeFileSync(filename, json)
    console.log(`Writing ${filename}...`)
}

// To tune matching system, find unmatched and
// compare new matches with existing

function findUnmatched(idEntries) { //eslint-disable-line
    idEntries.toSorted((a1, a2) => a1.entry.row - a2.entry.row)
        .forEach(elem => {
            if (!elem.id) {
                console.log(`UNMATCHED ${elem.entry.lock}`)
            }
        })
}

function compareMatches(idEntries) {
    let numSame = 0

    idEntries.toSorted((a1, a2) => a1.entry.row - a2.entry.row)
        .forEach(elem => {
            if (elem.id && !elem.entry.id) {
                console.log(`-------- > ${elem.id} : ${elem.entry.lock}`)

            } else if (!elem.id && elem.entry.id) {
                console.log(`${elem.entry.id} > -------- : ${elem.entry.lock}`)

            } else if (elem.id && elem.entry.id) {
                if (elem.id === elem.entry.id) {
                    numSame++
                } else {
                    console.log(`${elem.entry.id} > ${elem.id} : ${elem.entry.lock}`)
                }
            } else {
                numSame++
            }
        })

    return idEntries.length - numSame
}

// Simple identification of YouTube urls

function isYouTubeLink(link) {
    const ytUrls = [
        'https://youtube.com/',
        'https://youtu.be/',
        'https://www.youtube.com/',
        'https://m.youtube.com/'
    ]
    return ytUrls.map(url => link.startsWith(url)).some(val => val)
}

/** 
 * Try out a single tab or process the full sheet. 
 * Provided DAN_SHEET_ID is set, run:
 *  yarn run import-dan
 * 
 * We cache the tabs so we can test without pounding google sheets
 * (1 http request per tab/target/picker)
 */


let target = undefined

// target = 'NiXXeD'
// target = 'Tonysansan'

let pickers = fs.readdirSync('./src/data/dancache/').map(fl => fl.replace(/\.json$/, ''))

const allTabsAndDates = await importTabNames()
const allPickers = allTabsAndDates.map(td => td.picker)
const bbDatesByPicker = allTabsAndDates.reduce((group, term) => {
    const match = term.date.match(/^(\d\d)\/(\d\d)\/(\d\d\d\d)$/)
    if (match) {
        group[term.picker] = `${match[3]}-${match[1]}-${match[2]}T00:00:00.000Z`
    }
    return group
}, {})

if (target) {
    pickers = [target]
} else {
    pickers = allPickers
}

for (let idx = 0; idx < pickers.length; idx++) {
    const target = pickers[idx]
    const filename = `./src/data/dancache/${target}.json`
    let danData

    if (fs.existsSync(filename)) {
        danData = JSON.parse(fs.readFileSync(filename))
    } else {
        danData = await importDanTab(target)
    }

    if (DEBUG || WRITE_TO_DB) {
        console.log(`Imported ${danData.entries.length} entries for ${target}...`)
    }

    // Find any YouTube links, follow and grab date published.
    // This is slow, but we have a cache.

    const linkCacheFilename = './src/data/linkCache.json'
    let linkCache = {}
    if (fs.existsSync(linkCacheFilename)) {
        linkCache = JSON.parse(fs.readFileSync(linkCacheFilename))
    }
 
    for (let jdx = 0; jdx < danData.entries.length; jdx++) {
        const link = danData.entries[jdx].link
        let result = undefined
        let match = undefined

        if (FOLLOW_LINKS && !danData.entries[jdx].publishDate) {
            if (!linkCache[link] && isYouTubeLink(link)) {
                try {
                    result = await (await fetch(link)).text()
                } catch (error) {
                    if (DEBUG) {
                        console.log(`WARN: ${error.name} failed to fetch ${link}`)
                    }
                }
            }
            if (result) {
                match = result.match(/"publishDate":"(\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d-\d\d:\d\d)"/)
                if (match) {
                    linkCache[link] = match[1]
                }
            }
            if (linkCache[link]) {
                danData.entries[jdx].publishDate = linkCache[link]
            }
        }
    }

    if (FOLLOW_LINKS) {
        const json = JSON.stringify(linkCache, null, 2)
        fs.writeFileSync(linkCacheFilename, json)
    }

    const idEntries = matchDanSheet(danData)
    scoreEntries(target, danData.header, idEntries)

    compareMatches(idEntries)
//    findUnmatched(idEntries)

    if (!fs.existsSync(filename)) {
        writeEntriesAsJSON(target, danData.header, idEntries)
    }

    if (WRITE_TO_DB) {
        if (bbDatesByPicker[target]) {
            await db.collection('unclaimed-blackbelts').doc(target.trim()).set({awardedAt: bbDatesByPicker[target], claimed: false})
        }

        const docs = await db.collection('unclaimed-evidence').where('tabName', '==', target.trim()).get()
        docs.forEach(rec => rec.ref.delete())

        for (let idx=0; idx < idEntries.length; idx++) {
            const elem = idEntries[idx]
            let rec = {
                tabName: target.trim(),
                evidenceNotes: elem.entry.lock,
                evidenceUrl: elem.entry.link,
                modifier: ''
            }

            if (['First Recorded Pick',
                'First Recorded Pick (Notable)',
                'Non-Picking Defeat',
                'First Recorded Defeat',
                'First Recorded Defeat (Notable)'].includes(elem.entry.modifier)) {
                rec.modifier = elem.entry.modifier
            }

            if (elem.id) {
                rec.projectId = elem.id
            }
            if (elem.entry.publishDate) {
                rec.evidenceCreatedAt = elem.entry.publishDate
            }
            await db.collection('unclaimed-evidence').add(rec)
        }
    }

    // await new Promise(r => setTimeout(r, 1000));
}

console.log('Complete.')
