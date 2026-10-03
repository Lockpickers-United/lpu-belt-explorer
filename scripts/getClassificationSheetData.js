import {createGoogleSheetsClient} from '../src/data/googleSheetsClient.js'
import {sheetConfig} from '../keys/classificationSheetDetails.js'
import {voters} from '../keys/classificationVoters.js'
import dayjs from 'dayjs'
import fs from 'fs'

const refreshData = false

const CREDENTIALS_PATH = new URL('../keys/google-credentials.json', import.meta.url)
const OUTPUT_PATH = new URL('../src/data/classification-sheet-export.json', import.meta.url)
const DATA_PATH = new URL('../src/data/classification-samples.json', import.meta.url)

const sheetsClient = await createGoogleSheetsClient(CREDENTIALS_PATH)

async function getSheetData() {
    const sheet = await sheetsClient.getSheet({
        spreadsheetId: sheetConfig.spreadsheetId,
        sheetId: sheetConfig.gid,
        comments: true,
        notes: true
    })

    console.log(`Found ${sheet.comments.length} comments, ${sheet.commentAnchors.length} comment anchors, and ${sheet.notes.length} cell notes`)
    console.dir(sheet, {depth: null})

    fs.writeFile(OUTPUT_PATH, JSON.stringify(sheet, null, 2), function (err) {
        if (err) {
            console.error('save classification-sheet-export.json error:', err)
            return (`save classification-sheet-export.json error: ${err}`)
        } else {
            return ('classification-sheet-export.json saved')
        }
    })
}

refreshData && getSheetData()

async function readData() {
    const jsonString = fs.readFileSync(OUTPUT_PATH, 'utf8')
    return JSON.parse(jsonString)
}

async function processData() {
    const sheetData = await readData()

    const rowData = sheetData.rows.reduce((acc, row) => {
        const [description, entryId, ranking, sheetLink, type, ...voteRanks] = row.cells
        const allRowNotes = sheetData.notes.filter(note => note.sheetRow === row.sheetRow)

        const votes = voteRanks.map((vote, index) => {
            const note = allRowNotes.find(note => note.columnIndex === index + 5)
            const votedBelt = beltNames[vote.toLowerCase()] || vote
            const noteMentions = voters.reduce((acc, author) => {
                if ([author.displayName, ...author.aliases].some(name => note?.note?.toLowerCase().includes(name.toLowerCase()))) {
                    acc.push(author)
                }
                return acc
            }, [])

            const userId = noteMentions?.[noteMentions.length - 1]?.userId
            const displayName = noteMentions?.map(author => author.displayName).join(' / ')

            return {votedBelt, comment: note?.note, userId, displayName}
        })

        votes.forEach(vote => {
            const voteData = {
                id: 'v_' + genHexString(8),
                sheetRow: row.sheetRow,
                lockname: description,
                entryId,
                ranking,
                sheetLink,
                type,
                ...vote,
                source: 'Classification Sheet',
                createdAt: dayjs().format(),
                updatedAt: dayjs().format()
            }
            acc.push(voteData)
        })

        return acc
    }, [])

    rowData.forEach(row => {
        // no author found
        if (row.comment?.length > 0 && !row.userId) {
            console.log(row.comment, '\n')
        }

        // multiple author found
        if (row.comment?.length > 0 && row.displayName?.includes(' / ')) {
            //console.log([row.userId, row.displayName, row.comment].join('\n'), '\n')
        }

    })

    const exportData = rowData.filter(row => row.userId && row.entryId && row.votedBelt)
    console.log('exportData', exportData.length)

    fs.writeFile(DATA_PATH, JSON.stringify(exportData, null, 2), function (err) {
        if (err) {
            console.error('save classification-sheet-export.json error:', err)
            return (`save classification-sheet-export.json error: ${err}`)
        } else {
            return ('classification-sheet-export.json saved')
        }
    })

}

processData().then()

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
