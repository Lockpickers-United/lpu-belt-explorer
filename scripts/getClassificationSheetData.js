import {createGoogleSheetsClient} from '../src/data/googleSheetsClient.js'
import {sheetConfig} from '../keys/classificationSheetDetails.js'

const CREDENTIALS_PATH = new URL('../keys/google-credentials.json', import.meta.url)
const sheetsClient = await createGoogleSheetsClient(CREDENTIALS_PATH)

const sheet = await sheetsClient.getSheet({
    spreadsheetId: sheetConfig.spreadsheetId,
    sheetId: sheetConfig.gid,
    comments: true,
    notes: true
})

console.log(`Found ${sheet.comments.length} comments, ${sheet.commentAnchors.length} comment anchors, and ${sheet.notes.length} cell notes`)
console.dir(sheet, {depth: null})
