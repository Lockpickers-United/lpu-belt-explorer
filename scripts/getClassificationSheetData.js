import {createGoogleSheetsClient} from '../src/data/googleSheetsClient.js'
import {sheetConfig} from '../keys/classificationSheetDetails.js'
import {voters, votersNotOnSite} from '../keys/classificationVoters.js'
import dayjs from 'dayjs'
import fs from 'fs'
import {findLastMentionedVoter} from './classificationNoteMatcher.js'

const refreshData = false
const historical = true

const CREDENTIALS_PATH = new URL('../keys/google-credentials.json', import.meta.url)
const OUTPUT_DIR = new URL('../src/data/classification/', import.meta.url)
const DATA_DIR = new URL('../src/data/classification/', import.meta.url)

const sheetsClient = await createGoogleSheetsClient(CREDENTIALS_PATH)

const historicalTabs = ['1214572951', '1458208653', '2003859332', '1613106571']

async function getSheetData(sheetId) {
    const sheet = await sheetsClient.getSheet({
        spreadsheetId: sheetConfig.spreadsheetId,
        sheetId,
        comments: true,
        notes: true
    })

    console.log(`Found ${sheet.comments.length} comments, ${sheet.commentAnchors.length} comment anchors, and ${sheet.notes.length} cell notes`)
    console.dir(sheet, {depth: null})

    fs.writeFile(new URL(`classification-sheet-export-${sheetId}.json`, OUTPUT_DIR), JSON.stringify(sheet, null, 2), function (err) {
        if (err) {
            console.error('save classification-sheet-export.json error:', err)
            return (`save classification-sheet-export.json error: ${err}`)
        } else {
            return ('classification-sheet-export.json saved')
        }
    })
}

async function fetchAll() {
    for (const sheetId of historicalTabs) {
        await getSheetData(sheetId)
    }

}

refreshData && !historical && getSheetData(sheetConfig.gid)
refreshData && historical && fetchAll()


async function readData(sheetId) {
    const jsonString = fs.readFileSync(new URL(`classification-sheet-export-${sheetId}.json`, OUTPUT_DIR), 'utf8')
    return JSON.parse(jsonString)
}

async function processData(sheetId) {
    const sheetData = await readData(sheetId)

    const rowData = sheetData.rows.reduce((acc, row) => {
        const [_changeDate, make, model, version, entryId, _ranking, nameLink, _type, ...voteRanks] = row.cells
        const allRowNotes = sheetData.notes.filter(note => note.sheetRow === row.sheetRow)

        const knownVoters = [...voters, ...votersNotOnSite]
        const votes = voteRanks.map((vote, index) => {
            const note = allRowNotes.find(note => note.columnIndex === index + 8)
            const votedBelt = beltNames[vote.toLowerCase()] || vote
            const lastAuthor = findLastMentionedVoter(note?.note, knownVoters)
            const userId = lastAuthor?.userId && lastAuthor?.userId !== 'unknown'
                ? lastAuthor?.userId
                : 'u_' + genHexString(8)

            const displayName = lastAuthor?.displayName || 'Unknown'

            return {votedBelt, comment: note?.note, userId, displayName}
        })

        //const dateString = '2026-10-01T01:01:01.001Z'
        const dateString = dayjs().toISOString()

            votes.forEach((vote, index) => {
            const voteData = {
                id: 'v_' + genHexString(8),
                type: historical ? 'historicalVote' : 'vote',
                //sheetRow: row.sheetRow,
                //lockname: `${make} ${model} ${version}`,
                entryId,
                //nameLink,
                ...vote,
                source: 'sheet',
                createdAt: dayjs(dateString).add(index, 'minute'),
                //updatedAt: dayjs(dateString).add(index, 'minute'),
            }
            acc.push(voteData)
        })

        return acc
    }, [])

    rowData.forEach(row => {
        // no author found
        if (row.comment?.length > 0 && row.displayName === 'Unknown') {
            console.log(row.comment, '\n')
        }

        // multiple author found
        if (row.comment?.length > 0 && row.displayName?.includes(' / ')) {
            //console.log([row.userId, row.displayName, row.comment].join('\n'), '\n')
        }

    })

    const exportData = rowData.filter(row => row.userId && row.entryId && row.votedBelt)
    console.log('exportData', exportData.length)

    fs.writeFile(new URL(`classification-sheet-votes-${sheetId}.json`, DATA_DIR), JSON.stringify(exportData, null, 2), function (err) {
        if (err) {
            console.error('save classification-sheet-export.json error:', err)
            return (`save classification-sheet-export.json error: ${err}`)
        } else {
            return ('classification-sheet-export.json saved')
        }
    })
    
    return exportData
}

async function processAll() {
    const exportData = []

    for (const sheetId of historicalTabs) {
        const data = await processData(sheetId)
        exportData.push(...data)
    }

    fs.writeFile(new URL('classification--votes-historical.json', DATA_DIR), JSON.stringify(exportData, null, 2), function (err) {
        if (err) {
            console.error('save classification-sheet-export.json error:', err)
            return (`save classification-sheet-export.json error: ${err}`)
        } else {
            return ('classification-sheet-export.json saved')
        }
    })
}

if (historical && !refreshData) {
    processAll().then()
} else if (!refreshData) {
    processData(sheetConfig.gid).then()
}

const beltNames = {
    w: 'White',
    y: 'Yellow',
    o: 'Orange',
    g: 'Green',
    gr: 'Green',
    bl: 'Blue',
    p: 'Purple',
    br: 'Brown',
    r: 'Red',
    bb1: 'Black 1',
    bb2: 'Black 2',
    bb3: 'Black 3',
    bb4: 'Black 4',
    bb5: 'Black 5'
}

function genHexString(len) {
    const hex = '0123456789ABCDEF'
    let output = ''
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length))
    }
    return output.toLowerCase()
}
